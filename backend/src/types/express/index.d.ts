import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email?: string;
        // Add other JWT payload fields here if you want
      };
    }
  }
}
