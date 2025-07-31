import { redis } from "../../lib/redis";
import { prisma } from "../../lib/prisma";
import { PriorityLevel, TechnicianField, IssueType, ServiceType } from "@prisma/client";
import { ai } from "../../lib/googleGemini";

interface VoiceChatData {
  call_id: number;
  bot_id: number;
  bot_name: string;
  phone_number: string;
  call_date: string;
  user_email: string;
  call_report: {
    recording_url: string;
    summary: string;
    sentiment: string;
    extracted_variables: {
      issue_description: string;
      issue_location: string;
      issue_type: string;
      service_details: string;
    };
    full_conversation: string;
    interactions: any[];
  };
}

interface GeminiAnalysisResponse {
  hasValidInformation: boolean;
  insufficientInfoReason?: string;
  isIssue: boolean;
  category: IssueType | ServiceType;
  priority: PriorityLevel;
  title: string;
  description: string;
  requiredTechnicianField: TechnicianField;
}

export const voiceChatService = {
  getResidentCallData: async function (data: VoiceChatData): Promise<any> {
    try {
      console.log('Resident data received successfully:', data);

      // Step 1: Get user session from Redis
      const userId = await redis.get('widgetSession');
      if (!userId) {
        throw new Error('No active user session found');
      }

      // Step 2: Find the user and their PG community
      const user = await prisma.user.findUnique({
        where: { id: userId as string },
        include: {
          pgCommunity: true
        }
      });

      if (!user || !user.pgCommunity) {
        throw new Error('User or PG community not found');
      }

      // Step 3: Use Gemini to analyze the issue and validate information
      const analysisResult = await analyzeIssueWithGemini(data.call_report);

      console.log("gemini analysis", analysisResult);

      // Step 4: Check if we have valid and sufficient information
      if (!analysisResult.hasValidInformation) {
        return {
          success: false,
          message: analysisResult.insufficientInfoReason || 'Insufficient information provided',
          requiresMoreInfo: true,
          type: 'validation_failed'
        };
      }

      // Step 5: Find available technician for this PG community and required skill
      const availableTechnician = await findAvailableTechnician(
        user.pgCommunityId!,
        analysisResult.requiredTechnicianField
      );

      let result;

      if (analysisResult.isIssue) {
        // Step 6a: Create and assign issue
        result = await createAndAssignIssue({
          userId: user.id,
          pgCommunityId: user.pgCommunityId!,
          analysisResult,
          location: data.call_report.extracted_variables.issue_location || 'Not specified',
          technicianId: availableTechnician?.id
        });
      } else {
        // Step 6b: Create and assign service request
        result = await createAndAssignService({
          userId: user.id,
          pgCommunityId: user.pgCommunityId!,
          analysisResult,
          location: data.call_report.extracted_variables.issue_location || 'Not specified',
          technicianId: availableTechnician?.id
        });
      }

      return {
        success: true,
        message: `${analysisResult.isIssue ? 'Issue' : 'Service request'} registered successfully`,
        ticketNumber: result.ticketNumber,
        priority: analysisResult.priority,
        assignedTechnician: availableTechnician?.name || 'Will be assigned soon',
        type: analysisResult.isIssue ? 'issue' : 'service',
        data: result
      };

    } catch (error) {
      console.error('Error processing voice chat data:', error);
      throw error;
    }
  }
};

async function analyzeIssueWithGemini(callReport: VoiceChatData['call_report']): Promise<GeminiAnalysisResponse> {
  try {
    const prompt = `
    Analyze the following call report and determine:

    FIRST AND MOST IMPORTANT: Validate if the user has provided sufficient and valid information to create an issue or service request.

    Information Validation Criteria:
    - The user must have clearly described a specific problem, issue, or service need
    - The description should be meaningful and actionable (not just noise, accidental clicks, or unclear mumblings)
    - There should be enough context to understand what needs to be done
    - Avoid processing if the call seems like an accidental activation (very short, no clear intent, just background noise, etc.)
    - The conversation should indicate genuine intent to report an issue or request a service

    If the information is insufficient or unclear, set hasValidInformation to false and provide a reason.

    If the information is valid, then determine:
    1. Is this an ISSUE (something broken/not working) or a SERVICE REQUEST (new service needed)?
    2. What category does it fall under?
    3. What priority level should it have?
    4. What technician field is required?
    5. Generate a proper title and description

    Call Summary: ${callReport.summary}
    Issue Description: ${callReport.extracted_variables.issue_description}
    Issue Type: ${callReport.extracted_variables.issue_type}
    Service Details: ${callReport.extracted_variables.service_details}
    Full Conversation: ${callReport.full_conversation.substring(0, 500)}...

    Priority Levels:
    - P1: Critical (safety hazards, complete system failures)
    - P2: High (major inconvenience, partial system failure)
    - P3: Medium (minor inconvenience, cosmetic issues)
    - P4: Low (nice-to-have improvements)

    Issue Categories: PLUMBING, ELECTRICAL, HEATING_COOLING, CLEANING, SECURITY, INTERNET_WIFI, APPLIANCE, STRUCTURAL, PEST_CONTROL, OTHER
    Service Categories: CLEANING, MAINTENANCE, REPAIR, INSTALLATION, UPGRADE, INSPECTION, OTHER
    Technician Fields: PLUMBING, ELECTRICAL, CARPENTRY, CLEANING, PAINTING, AC_REPAIR, APPLIANCE_REPAIR, GENERAL_MAINTENANCE

    Respond in this JSON format:
    {
      "hasValidInformation": boolean,
      "insufficientInfoReason": "string (only if hasValidInformation is false)",
      "isIssue": boolean,
      "category": "CATEGORY_NAME",
      "priority": "P1|P2|P3|P4",
      "title": "Brief title",
      "description": "Detailed description",
      "requiredTechnicianField": "TECHNICIAN_FIELD"
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const analysisText = response.text;
    
    // Extract JSON from the response
    const jsonMatch = analysisText?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as GeminiAnalysisResponse;
    
    // Validate the response structure
    if (analysis.hasValidInformation === undefined) {
      throw new Error('Invalid analysis response from Gemini - missing hasValidInformation');
    }

    // If information is insufficient, return early
    if (!analysis.hasValidInformation) {
      return analysis;
    }

    // Validate other required fields only if hasValidInformation is true
    if (!analysis.category || !analysis.priority || !analysis.requiredTechnicianField) {
      throw new Error('Invalid analysis response from Gemini - missing required fields');
    }

    return analysis;

  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    // Fallback analysis based on keywords
    return getFallbackAnalysis(callReport);
  }
}

function getFallbackAnalysis(callReport: VoiceChatData['call_report']): GeminiAnalysisResponse {
  const description = callReport.extracted_variables.issue_description?.toLowerCase() || '';
  const issueType = callReport.extracted_variables.issue_type?.toLowerCase() || '';
  const summary = callReport.summary?.toLowerCase() || '';
  const fullConversation = callReport.full_conversation?.toLowerCase() || '';

  // First, validate if we have sufficient information
  const hasValidInformation = validateInformationSufficiency(description, issueType, summary, fullConversation);
  
  if (!hasValidInformation) {
    return {
      hasValidInformation: false,
      insufficientInfoReason: "The call appears to be accidental or lacks sufficient information to create a valid issue or service request. Please provide more details about the specific problem or service needed.",
      isIssue: false,
      category: IssueType.OTHER,
      priority: PriorityLevel.P4,
      title: "",
      description: "",
      requiredTechnicianField: TechnicianField.GENERAL_MAINTENANCE
    };
  }

  // Determine if it's an issue or service request
  const isIssue = description.includes('broken') || 
                  description.includes('not working') || 
                  description.includes('problem') ||
                  issueType.includes('issue');

  // Map to appropriate categories and technician fields
  let category: IssueType | ServiceType;
  let requiredTechnicianField: TechnicianField;

  if (issueType.includes('clean') || description.includes('clean') || description.includes('clutter')) {
    category = isIssue ? IssueType.CLEANING : ServiceType.CLEANING;
    requiredTechnicianField = TechnicianField.CLEANING;
  } else if (issueType.includes('electric') || description.includes('electric')) {
    category = isIssue ? IssueType.ELECTRICAL : ServiceType.REPAIR;
    requiredTechnicianField = TechnicianField.ELECTRICAL;
  } else if (issueType.includes('plumb') || description.includes('water') || description.includes('leak')) {
    category = isIssue ? IssueType.PLUMBING : ServiceType.REPAIR;
    requiredTechnicianField = TechnicianField.PLUMBING;
  } else {
    category = isIssue ? IssueType.OTHER : ServiceType.OTHER;
    requiredTechnicianField = TechnicianField.GENERAL_MAINTENANCE;
  }

  // Determine priority based on keywords
  let priority: PriorityLevel = PriorityLevel.P3; // Default to medium
  if (description.includes('urgent') || description.includes('emergency')) {
    priority = PriorityLevel.P1;
  } else if (description.includes('important') || description.includes('asap')) {
    priority = PriorityLevel.P2;
  } else if (description.includes('whenever') || description.includes('no rush')) {
    priority = PriorityLevel.P4;
  }

  return {
    hasValidInformation: true,
    isIssue,
    category,
    priority,
    title: isIssue ? `${issueType} Issue` : `${issueType} Service Request`,
    description: callReport.extracted_variables.issue_description,
    requiredTechnicianField
  };
}

function validateInformationSufficiency(
  description: string, 
  issueType: string, 
  summary: string, 
  fullConversation: string
): boolean {
  // Check for minimum content length
  if (fullConversation.length < 10) {
    return false;
  }

  // Check for meaningful content (not just noise or accidental activation)
  const meaningfulWords = [
    'problem', 'issue', 'broken', 'not working', 'need', 'help', 'fix', 'repair',
    'clean', 'service', 'maintenance', 'install', 'replace', 'check', 'look',
    'water', 'electricity', 'light', 'door', 'window', 'toilet', 'shower',
    'heating', 'cooling', 'ac', 'wifi', 'internet', 'plumbing', 'electrical'
  ];

  const combinedText = `${description} ${issueType} ${summary} ${fullConversation}`;
  const hasMeaningfulContent = meaningfulWords.some(word => combinedText.includes(word));

  // Check for typical accidental activation patterns
  const accidentalPatterns = [
    /^(hello|hi|hey|test|testing)?\s*$/i,
    /^(um|uh|hmm|ah)[\s\.]*$/i,
    /background noise/i,
    /silence/i,
    /no response/i,
    /^[\s\.\,\!\?]*$/
  ];

  const seemsAccidental = accidentalPatterns.some(pattern => pattern.test(combinedText.trim()));

  // Must have meaningful content and not seem accidental
  return hasMeaningfulContent && !seemsAccidental && (description.length > 5 || issueType.length > 3);
}

async function findAvailableTechnician(pgCommunityId: string, requiredField: TechnicianField) {
  const technician = await prisma.technician.findFirst({
    where: {
      speciality: requiredField,
      isAvailable: true,
      pgAssignments: {
        some: {
          pgCommunityId: pgCommunityId
        }
      }
    },
    include: {
      _count: {
        select: {
          assignedIssues: {
            where: {
              status: { notIn: ['RESOLVED'] }
            }
          },
          assignedServices: {
            where: {
              status: { notIn: ['COMPLETED', 'REJECTED'] }
            }
          }
        }
      }
    },
    orderBy: [
      // Prioritize technicians with fewer active assignments
      { assignedIssues: { _count: 'asc' } },
      { assignedServices: { _count: 'asc' } }
    ]
  });

  // If no specific technician found, try to find a general maintenance technician
  if (!technician) {
    return await prisma.technician.findFirst({
      where: {
        speciality: TechnicianField.GENERAL_MAINTENANCE,
        isAvailable: true,
        pgAssignments: {
          some: {
            pgCommunityId: pgCommunityId
          }
        }
      }
    });
  }

  return technician;
}

async function createAndAssignIssue(params: {
  userId: string;
  pgCommunityId: string;
  analysisResult: GeminiAnalysisResponse;
  location: string;
  technicianId?: string;
}) {
  const { userId, pgCommunityId, analysisResult, location, technicianId } = params;

  const issue = await prisma.raisedIssue.create({
    data: {
      title: analysisResult.title,
      description: analysisResult.description,
      issueType: analysisResult.category as IssueType,
      priorityLevel: analysisResult.priority,
      location: location,
      status: technicianId ? 'ASSIGNED' : 'PENDING',
      raisedById: userId,
      pgCommunityId: pgCommunityId,
      assignedTechnicianId: technicianId,
      imageUrls: []
    },
    include: {
      assignedTechnician: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          speciality: true
        }
      },
      pgCommunity: {
        select: {
          name: true,
          pgCode: true
        }
      }
    }
  });

  return issue;
}

async function createAndAssignService(params: {
  userId: string;
  pgCommunityId: string;
  analysisResult: GeminiAnalysisResponse;
  location: string;
  technicianId?: string;
}) {
  const { userId, pgCommunityId, analysisResult, location, technicianId } = params;

  const service = await prisma.requestedService.create({
    data: {
      title: analysisResult.title,
      description: analysisResult.description,
      serviceType: analysisResult.category as ServiceType,
      priorityLevel: analysisResult.priority,
      location: location,
      status: 'AWAITING_APPROVAL', // Services need owner approval first
      requestedById: userId,
      pgCommunityId: pgCommunityId,
      assignedTechnicianId: technicianId,
      isApprovedByOwner: false
    },
    include: {
      assignedTechnician: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          speciality: true
        }
      },
      pgCommunity: {
        select: {
          name: true,
          pgCode: true,
          owner: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  return service;
}