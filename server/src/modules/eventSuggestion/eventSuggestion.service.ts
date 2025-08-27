import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { AppError } from '../../utils/errors';
import { getTargetDates, REDIS_KEYS } from './targetDates';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface EventSuggestionFilters {
  eventType?: string;
  forceFresh?: boolean; 
}

export class EventSuggestionService {

  /**
   * Generate AI-powered event suggestions without mock data
   */
  async generateEventSuggestions(
    pgCommunityId: string,
    userId: string,
    userRole: string,
    ai: any,
    filters: EventSuggestionFilters = {}
  ) {
    try {
      // Verify user access
      await this.verifyUserAccess(pgCommunityId, userId, userRole);

      // Check if we have cached suggestions (unless force fresh)
      if (!filters.forceFresh) {
        const cachedSuggestions = await this.getCachedSuggestions(pgCommunityId);
        if (cachedSuggestions) {
          console.log('📋 Returning cached suggestions');
          return cachedSuggestions;
        }
      }

      // Get PG community basic data
      const pgCommunity = await this.getPgCommunityData(pgCommunityId);

      // Get target dates for suggestions
      const targetDates = getTargetDates();

      // Generate suggestions using AI for each target date
      const allSuggestions = [];
      for (const targetDate of targetDates) {
        const suggestions = await this.generateAISuggestionsForDate(
          pgCommunity,
          targetDate,
          ai,
          filters
        );
        allSuggestions.push(...suggestions);
      }

      // Save suggestions to database
      const savedSuggestions = await this.saveSuggestions(pgCommunityId, allSuggestions);

      // Cache the results
      const result = {
        suggestions: savedSuggestions,
        targetDates,
        pgCommunity: {
          name: pgCommunity.name,
          facilitiesCount: pgCommunity.facilities.length,
          residentsCount: pgCommunity.residents.length
        },
        generatedAt: new Date().toISOString()
      };

      await this.cacheSuggestions(pgCommunityId, result);

      return result;

    } catch (error) {
      throw new AppError(`Failed to generate event suggestions: ${error}`, 500);
    }
  }

  /**
   * Get existing event suggestions with broadcast capability
   */
  async getEventSuggestions(
    pgCommunityId: string,
    userId: string,
    userRole: string,
    filters: { status?: string; limit?: number } = {}
  ) {
    try {
      await this.verifyUserAccess(pgCommunityId, userId, userRole);

      const { status, limit = 10 } = filters;

      const suggestions = await prisma.eventSuggestion.findMany({
        where: {
          pgCommunityId,
          ...(status && { status: status as any })
        },
        orderBy: [
          { expectedEngagement: 'desc' },
          { suggestedDate: 'asc' }
        ],
        take: limit,
        include: {
          pgCommunity: {
            select: {
              name: true,
              residents: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              facilities: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  capacity: true
                }
              }
            }
          }
        }
      });

      // Add broadcast capability info
      const suggestionsWithBroadcast = suggestions.map(suggestion => ({
        ...suggestion,
        canBroadcast: userRole === 'PG_OWNER',
        residentsCount: suggestion.pgCommunity.residents.length,
        broadcastStatus: 'ready'
      }));

      return {
        suggestions: suggestionsWithBroadcast,
        total: suggestions.length
      };

    } catch (error) {
      throw new AppError(`Failed to fetch event suggestions: ${error}`, 500);
    }
  }

  /**
   * Broadcast event suggestion to all residents
   */
  async broadcastEventSuggestion(
    suggestionId: string,
    userId: string,
    broadcastData: {
      message?: string;
      scheduleFor?: Date;
      channels?: string[];
    }
  ) {
    try {
      const suggestion = await prisma.eventSuggestion.findUnique({
        where: { id: suggestionId },
        include: {
          pgCommunity: {
            include: {
              residents: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              owner: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!suggestion) {
        throw new AppError('Suggestion not found', 404);
      }

      // Verify user is the owner
      if (suggestion.pgCommunity.owner.id !== userId) {
        throw new AppError('Only PG owner can broadcast suggestions', 403);
      }

      const residents = suggestion.pgCommunity.residents;
      const broadcastMessage = broadcastData.message ||
        `🎉 New Event Suggestion: ${suggestion.title}\n\n${suggestion.description}\n\nSuggested Date: ${suggestion.suggestedDate?.toDateString()}\nExpected Engagement: ${suggestion.expectedEngagement}%\n\nWhat do you think? Let us know your interest!`;

      // Create broadcast record
      const broadcastId = `broadcast_${Date.now()}`;

      // Store broadcast info in Redis
      await redis.setex(`broadcast:${broadcastId}`, 3600 * 24 * 7, JSON.stringify({
        suggestionId,
        pgCommunityId: suggestion.pgCommunityId,
        broadcastBy: userId,
        message: broadcastMessage,
        recipients: residents.map(r => r.id),
        channels: broadcastData.channels || ['email'],
        scheduledFor: broadcastData.scheduleFor || new Date(),
        status: 'sent',
        sentAt: new Date()
      }));

      console.log(`📢 Broadcasting suggestion "${suggestion.title}" to ${residents.length} residents`);

      // Update suggestion with broadcast info
      await prisma.eventSuggestion.update({
        where: { id: suggestionId },
        data: {
          updatedAt: new Date()
        }
      });

      return {
        broadcastId,
        recipientsCount: residents.length,
        message: broadcastMessage,
        scheduledFor: broadcastData.scheduleFor || new Date(),
        status: 'sent'
      };

    } catch (error) {
      throw new AppError(`Failed to broadcast suggestion: ${error}`, 500);
    }
  }

  /**
   * Implement suggestion as actual event
   */
  async implementSuggestion(
    suggestionId: string,
    eventDetails: {
      startDate?: Date;
      endDate?: Date;
      maxCapacity?: number;
      estimatedCost?: number;
      facilityId?: string;
    },
    userId: string
  ) {
    try {
      const suggestion = await prisma.eventSuggestion.findUnique({
        where: { id: suggestionId },
        include: { pgCommunity: true }
      });

      if (!suggestion) {
        throw new AppError('Suggestion not found', 404);
      }

      // Use suggested date if no override provided
      const startDate = eventDetails.startDate || suggestion.suggestedDate || new Date();
      const endDate = eventDetails.endDate || new Date(startDate.getTime() + (suggestion.suggestedDuration || 180) * 60 * 1000);

      // Create the actual event
      const event = await prisma.event.create({
        data: {
          title: suggestion.title,
          description: suggestion.description,
          eventType: suggestion.suggestedEventType,
          location: suggestion.requiredFacilities[0] || suggestion.location || 'TBD',
          startDate,
          endDate,
          maxCapacity: eventDetails.maxCapacity || suggestion.recommendedCapacity,
          estimatedCost: eventDetails.estimatedCost || suggestion.estimatedCost,
          facilityId: eventDetails.facilityId,
          createdById: userId,
          pgCommunityId: suggestion.pgCommunityId,
          requiresRegistration: true,
          registrationDeadline: new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
        }
      });

      // Update suggestion status
      await prisma.eventSuggestion.update({
        where: { id: suggestionId },
        data: {
          status: 'IMPLEMENTED',
          implementedAsEventId: event.id
        }
      });

      // Clear cache
      await redis.del(REDIS_KEYS.SUGGESTION_CACHE + suggestion.pgCommunityId);

      return event;
    } catch (error) {
      throw new AppError(`Failed to implement suggestion: ${error}`, 500);
    }
  }

  private async verifyUserAccess(pgCommunityId: string, userId: string, userRole: string) {
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { id: pgCommunityId },
      include: {
        residents: true,
        owner: true
      }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    const isOwner = pgCommunity.ownerId === userId;
    const isResident = pgCommunity.residents.some(resident => resident.id === userId);

    if (!isOwner && !isResident) {
      throw new AppError('Access denied to this PG community', 403);
    }
  }

  private async getPgCommunityData(pgCommunityId: string) {
    const pgCommunity = await prisma.pgCommunity.findUnique({
      where: { id: pgCommunityId },
      include: {
        facilities: true,
        residents: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!pgCommunity) {
      throw new AppError('PG Community not found', 404);
    }

    return pgCommunity;
  }

  private async generateAISuggestionsForDate(
    pgCommunity: any,
    targetDate: any,
    ai: any,
    filters: EventSuggestionFilters
  ) {
    const facilitiesData = pgCommunity.facilities.map((f: any) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      capacity: f.capacity,
      amenities: f.amenities
    }));

    const prompt = this.buildAIPromptForDate(
      pgCommunity,
      facilitiesData,
      targetDate,
      filters
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const analysisText = response.text;
    return this.parseAIResponse(analysisText, pgCommunity.id, targetDate);
  }

  private buildAIPromptForDate(
    pgCommunity: any,
    facilities: any[],
    targetDate: any,
    filters: EventSuggestionFilters
  ): string {
    const currentDate = new Date().toLocaleDateString();

    return `
You are an expert event planner for PG communities. Suggest 1 PERFECT event for "${pgCommunity.name}" for the specific date: ${targetDate.date} (${targetDate.context}).

**Current Date:** ${currentDate}
**Target Date Context:** ${targetDate.context} - ${targetDate.description}

**PG Community Details:**
- Name: ${pgCommunity.name}
- Total Residents: ${pgCommunity.residents.length}
- Community Type: Paying Guest accommodation

**Available Facilities:**
${facilities.length > 0
        ? facilities.map(f => `- ${f.name} (${f.type}, capacity: ${f.capacity}): ${f.amenities?.join(', ') || 'Basic facilities'}`).join('\n')
        : '- Common Room (Community space for gatherings)\n- Terrace (Open area for outdoor activities)'
      }

**Event Context:**
- Date: ${targetDate.date}
- Occasion: ${targetDate.context}
- Type: ${targetDate.type}
- Why this date: ${targetDate.description}

**Requirements:**
- Suggest EXACTLY 1 event perfect for this specific date and occasion
- Consider it's a PG community with young working professionals
- Make it engaging, cost-effective, and community-building focused
- Match the event type to the occasion (${targetDate.type})
- Provide realistic cost estimates for a PG community
- Consider the target date context: ${targetDate.context}

**Response Format (JSON only, no extra text):**
{
  "title": "Event Title that matches ${targetDate.context}",
  "description": "Detailed description explaining why this event is perfect for ${targetDate.context} in a PG community",
  "eventType": "SOCIAL|FESTIVAL|EDUCATIONAL|SPORTS|CULTURAL|OTHER",
  "reasoning": "Why this event will be successful for PG residents on ${targetDate.context}",
  "contextFactors": ["${targetDate.context}", "PG Community Event", "Young Professionals"],
  "requiredFacilities": ["Main facility needed"],
  "location": "Clear location name (e.g., 'Common Room', 'Terrace', 'Garden Area')",
  "recommendedCapacity": ${Math.min(pgCommunity.residents.length || 20, 50)},
  "estimatedCost": 1500,
  "expectedEngagement": 80,
  "duration": 180
}

Focus on creating ONE perfect community event that brings PG residents together for ${targetDate.context}.
    `;
  }

  private parseAIResponse(aiResponse: string, pgCommunityId: string, targetDate: any) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      return [{
        pgCommunityId,
        title: parsedResponse.title,
        description: parsedResponse.description,
        location: parsedResponse.location,
        suggestedEventType: parsedResponse.eventType,
        suggestedDate: new Date(targetDate.date),
        suggestedDuration: parsedResponse.duration || 180,
        reasoning: parsedResponse.reasoning,
        contextFactors: parsedResponse.contextFactors || [targetDate.context],
        basedOnEventIds: [],
        expectedEngagement: parsedResponse.expectedEngagement || 75,
        requiredFacilities: parsedResponse.requiredFacilities || [],
        recommendedCapacity: parsedResponse.recommendedCapacity,
        estimatedCost: parsedResponse.estimatedCost,
        status: 'PENDING'
      }];

    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackSuggestion(pgCommunityId, targetDate);
    }
  }

  private getFallbackSuggestion(pgCommunityId: string, targetDate: any) {
    return [{
      pgCommunityId,
      title: `${targetDate.context} Community Gathering`,
      description: `A special community event designed for ${targetDate.context.toLowerCase()} to bring PG residents together and strengthen bonds.`,
      location: 'Common Room',
      suggestedEventType: targetDate.type === 'festival' ? 'FESTIVAL' : 'SOCIAL',
      suggestedDate: new Date(targetDate.date),
      suggestedDuration: 180,
      reasoning: `Perfect timing for ${targetDate.context} celebration in PG community`,
      contextFactors: [targetDate.context, 'PG Community Event'],
      basedOnEventIds: [],
      expectedEngagement: 75,
      requiredFacilities: ['Common Room'],
      recommendedCapacity: 25,
      estimatedCost: 1500,
      status: 'PENDING'
    }];
  }

  private async saveSuggestions(pgCommunityId: string, suggestions: any[]) {
    const savedSuggestions = await Promise.all(
      suggestions.map(suggestion =>
        prisma.eventSuggestion.create({
          data: suggestion
        })
      )
    );

    return savedSuggestions;
  }

  private async getCachedSuggestions(pgCommunityId: string) {
    const cached = await redis.get(REDIS_KEYS.SUGGESTION_CACHE + pgCommunityId);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  private async cacheSuggestions(pgCommunityId: string, suggestions: any) {
    await redis.setex(
      REDIS_KEYS.SUGGESTION_CACHE + pgCommunityId,
      3600 * 6, // Cache for 6 hours
      JSON.stringify(suggestions)
    );
  }
}

export const eventSuggestionService = new EventSuggestionService();