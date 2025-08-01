import { z } from 'zod';

export const eventSuggestionValidationSchemas = {
  generateSuggestionsSchema: z.object({
    params: z.object({
      pgId: z.string().min(1, 'PG ID is required')
    }),
    body: z.object({
      eventType: z.enum(['SOCIAL', 'FESTIVAL', 'EDUCATIONAL', 'SPORTS', 'CULTURAL', 'OTHER']).optional(),
      forceFresh: z.boolean().default(false)
    }).optional().default({})
  }),

  getSuggestionsSchema: z.object({
    params: z.object({
      pgId: z.string().min(1, 'PG ID is required')
    }),
    query: z.object({
      status: z.enum(['PENDING', 'APPROVED', 'IMPLEMENTED', 'REJECTED', 'EXPIRED']).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 100, 'Limit must be between 1 and 100').default('10')
    }).optional().default({})
  }),

  broadcastSuggestionSchema: z.object({
    params: z.object({
      suggestionId: z.string().min(1, 'Suggestion ID is required')
    }),
    body: z.object({
      message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
      scheduleFor: z.string().datetime('Invalid schedule date format').optional(),
      channels: z.array(z.enum(['email', 'push', 'sms'])).min(1, 'At least one channel is required').default(['email'])
    }).optional().default({})
  }),

  updateStatusSchema: z.object({
    params: z.object({
      suggestionId: z.string().min(1, 'Suggestion ID is required')
    }),
    body: z.object({
      status: z.enum(['APPROVED', 'REJECTED', 'PENDING'], {
        required_error: 'Status is required',
        invalid_type_error: 'Invalid status value'
      }),
      ownerFeedback: z.string().max(500, 'Feedback cannot exceed 500 characters').optional(),
      ownerRating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional()
    })
  }),

  implementSuggestionSchema: z.object({
    params: z.object({
      suggestionId: z.string().min(1, 'Suggestion ID is required')
    }),
    body: z.object({
      startDate: z.string().datetime('Invalid start date format').optional(),
      endDate: z.string().datetime('Invalid end date format').optional(),
      maxCapacity: z.number().min(1, 'Capacity must be at least 1').optional(),
      estimatedCost: z.number().min(0, 'Cost cannot be negative').optional(),
      facilityId: z.string().optional()
    }).optional().default({}).refine(data => {
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate > startDate;
      }
      return true;
    }, {
      message: 'End date must be after start date',
      path: ['endDate']
    }).refine(data => {
      if (data.startDate) {
        const startDate = new Date(data.startDate);
        return startDate > new Date();
      }
      return true;
    }, {
      message: 'Event date cannot be in the past',
      path: ['startDate']
    })
  }),

  getPgInfoSchema: z.object({
    params: z.object({
      pgId: z.string().min(1, 'PG ID is required')
    })
  })
};