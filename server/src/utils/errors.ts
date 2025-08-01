export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * @param message The error message, which will be sent to the client.
   * @param statusCode The HTTP status code to be sent with the response.
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    this.isOperational = true;

    // Error.captureStackTrace(this, this.constructor);
  }
}