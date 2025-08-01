import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { mockPgData, REDIS_KEYS, getNextMockDataSet, getTargetDates } from './eventsMockData';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class MockDataInjectionService {
  
  /**
   * Auto-inject mock data to a PG community when first accessing suggestions
   */
  async injectMockDataToPg(pgCommunityId: string): Promise<void> {
    try {
      // Check if this PG already has mock data injected
      const existingMapping = await redis.get(REDIS_KEYS.PG_MOCK_DATA_MAPPING + pgCommunityId);
      if (existingMapping) {
        console.log(`PG ${pgCommunityId} already has mock data injected`);
        return;
      }

      // Verify PG exists
      const pgCommunity = await prisma.pgCommunity.findUnique({
        where: { id: pgCommunityId },
        include: {
          facilities: true,
          events: true
        }
      });

      if (!pgCommunity) {
        throw new AppError('PG Community not found', 404);
      }

      // Get next mock data set in rotation
      const { setIndex, data } = await this.getNextMockDataSetWithRedis();
      
      console.log(`Injecting mock data set ${setIndex} (${data.setId}) to PG: ${pgCommunity.name}`);

      // Inject facilities
      const createdFacilities = await this.injectFacilities(pgCommunityId, data.facilities);
      
      // Inject past events with analytics
      await this.injectPastEvents(pgCommunityId, pgCommunity.ownerId, data.pastEvents, createdFacilities);

      // Mark this PG as having mock data injected
      await redis.set(REDIS_KEYS.PG_MOCK_DATA_MAPPING + pgCommunityId, JSON.stringify({
        setIndex,
        setId: data.setId,
        injectedAt: new Date().toISOString(),
        facilitiesCount: data.facilities.length,
        eventsCount: data.pastEvents.length
      }));

      console.log(`✅ Successfully injected mock data to PG: ${pgCommunity.name}`);
      
    } catch (error) {
      console.error('Failed to inject mock data:', error);
      throw new AppError(`Failed to inject mock data: ${error}`, 500);
    }
  }

  /**
   * Get next mock data set using Redis for proper alternation
   */
  private async getNextMockDataSetWithRedis(): Promise<{ setIndex: number; data: any }> {
    const lastAssignedStr = await redis.get(REDIS_KEYS.LAST_ASSIGNED_MOCK_DATA);
    let lastAssigned = lastAssignedStr ? parseInt(lastAssignedStr) : -1;
    
    // Get next index in rotation (0, 1, 2)
    const nextIndex = (lastAssigned + 1) % mockPgData.length;
    
    // Update Redis with new last assigned
    await redis.set(REDIS_KEYS.LAST_ASSIGNED_MOCK_DATA, nextIndex.toString());
    
    return {
      setIndex: nextIndex,
      data: mockPgData[nextIndex]
    };
  }

  /**
   * Inject facilities for the PG
   */
  private async injectFacilities(pgCommunityId: string, facilities: any[]): Promise<any[]> {
    const createdFacilities = [];
    
    for (const facilityData of facilities) {
      const facility = await prisma.pgFacility.create({
        data: {
          name: facilityData.name,
          type: facilityData.type as any,
          capacity: facilityData.capacity,
          description: facilityData.description,
          amenities: facilityData.amenities,
          isAvailable: true,
          pgCommunityId
        }
      });
      
      createdFacilities.push(facility);
      console.log(`  🏢 Created facility: ${facility.name}`);
    }
    
    return createdFacilities;
  }

  /**
   * Inject past events with analytics
   */
  private async injectPastEvents(
    pgCommunityId: string, 
    ownerId: string, 
    pastEvents: any[], 
    facilities: any[]
  ): Promise<void> {
    
    for (const eventData of pastEvents) {
      // Find matching facility
      const matchingFacility = facilities.find(f => f.type === eventData.facilityType);
      
      // Create event
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: `A successful ${eventData.eventType.toLowerCase()} event that brought the community together with great engagement and positive feedback.`,
          eventType: eventData.eventType as any,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
          location: eventData.location,
          actualCost: eventData.actualCost,
          maxCapacity: eventData.maxCapacity,
          facilityId: matchingFacility?.id,
          createdById: ownerId,
          pgCommunityId,
          requiresRegistration: true,
          imageUrls: []
        }
      });

      // Create event analytics
      await prisma.eventAnalytic.create({
        data: {
          eventId: event.id,
          pgCommunityId,
          totalRegistrations: eventData.analytics.totalRegistrations,
          actualAttendance: eventData.analytics.actualAttendance,
          attendanceRate: eventData.analytics.attendanceRate,
          noShowCount: eventData.analytics.totalRegistrations - eventData.analytics.actualAttendance,
          averageRating: eventData.analytics.averageRating,
          totalFeedbacks: eventData.analytics.totalFeedbacks,
          positiveFeedbackCount: eventData.analytics.positiveFeedbackCount,
          negativeFeedbackCount: eventData.analytics.totalFeedbacks - eventData.analytics.positiveFeedbackCount,
          neutralFeedbackCount: 0,
          engagementScore: eventData.analytics.engagementScore,
          photosShared: Math.floor(eventData.analytics.engagementScore / 2), // Mock data
          socialMentions: Math.floor(eventData.analytics.engagementScore / 4), // Mock data
          successFactors: eventData.analytics.successFactors,
          improvementAreas: ['Better time management', 'More variety in activities'],
          eventCost: eventData.actualCost
        }
      });

      console.log(`  🎉 Created event: ${event.title} with analytics`);
    }
  }

  /**
   * Check if PG has mock data
   */
  async hasMockData(pgCommunityId: string): Promise<boolean> {
    const mapping = await redis.get(REDIS_KEYS.PG_MOCK_DATA_MAPPING + pgCommunityId);
    return !!mapping;
  }

  /**
   * Get mock data info for a PG
   */
  async getMockDataInfo(pgCommunityId: string): Promise<any> {
    const mappingStr = await redis.get(REDIS_KEYS.PG_MOCK_DATA_MAPPING + pgCommunityId);
    if (!mappingStr) return null;
    
    return JSON.parse(mappingStr);
  }

  /**
   * Clear mock data for a PG (for testing)
   */
  async clearMockData(pgCommunityId: string): Promise<void> {
    try {
      // Delete event analytics
      await prisma.eventAnalytic.deleteMany({
        where: { pgCommunityId }
      });

      // Delete events
      await prisma.event.deleteMany({
        where: { pgCommunityId }
      });

      // Delete facilities  
      await prisma.pgFacility.deleteMany({
        where: { pgCommunityId }
      });

      // Clear Redis mapping
      await redis.del(REDIS_KEYS.PG_MOCK_DATA_MAPPING + pgCommunityId);

      console.log(`✅ Cleared mock data for PG: ${pgCommunityId}`);
    } catch (error) {
      console.error('Failed to clear mock data:', error);
      throw error;
    }
  }

}

export const mockDataInjectionService = new MockDataInjectionService();