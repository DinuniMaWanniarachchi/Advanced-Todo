import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email?: string;
        username?: string;
        role?: string;
        // Add other JWT payload fields here if you want
      };
    }
  }
}