import { ExpressMiddlewareInterface } from "routing-controllers";
import { Request, Response, NextFunction } from 'express';

// Factory function to create middleware with dynamic roles
export const RoleMiddleware = (roles: string[]) => {
  return class implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: NextFunction): void {
      // Assuming you have a user object attached to request by previous auth middleware
      const user = (request as any).user;      
      if (!user || !user.role || !roles.some(role => user.role)) {
        response.status(403).json({ message: 'Forbidden' });
        return;
      }
      next();
    }
  };
};