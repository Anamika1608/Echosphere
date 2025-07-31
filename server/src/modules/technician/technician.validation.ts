import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Enum for technician specialities
const TechnicianFieldEnum = z.enum([
  'PLUMBING',
  'ELECTRICAL',
  'CLEANING',
  'MAINTENANCE',
  'SECURITY',
  'GARDENING',
  'PAINTING',
  'CARPENTRY',
  'GENERAL'
]);

export const createTechnicianSchema = z.object({
    
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    phoneNumber: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
    speciality: TechnicianFieldEnum,
    isAvailable: z.boolean().optional(),
    pgCommunityId: z.string()
      .uuid('Invalid PG community ID format')
});

export const assignTechnicianSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid technician ID format')
  }),
  body: z.object({
    pgCommunityIds: z.array(
      z.string().uuid('Invalid PG community ID format')
    ).min(1, 'At least one PG community ID is required')
  })
});

export const updateTechnicianAvailabilitySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid technician ID format')
  }),
  body: z.object({
    isAvailable: z.boolean()
  })
});

export const getTechnicianByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ID format')
  })
});

export const getTechniciansForPgSchema = z.object({
  params: z.object({
    pgCommunityId: z.string().uuid('Invalid PG community ID format')
  }),
  query: z.object({
    speciality: TechnicianFieldEnum.optional()
  }).optional()
});

export const getAvailableTechniciansSchema = z.object({
  params: z.object({
    pgCommunityId: z.string().uuid('Invalid PG community ID format')
  })
});

export const updateTechnicianSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid technician ID format')
  }),
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim()
      .optional(),
    phoneNumber: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
      .optional(),
    speciality: TechnicianFieldEnum.optional(),
    isAvailable: z.boolean().optional()
  })
});

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};