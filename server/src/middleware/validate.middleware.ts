import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod'; 

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input data',
          errors,
        });
      }
      next(error);
    }
  };