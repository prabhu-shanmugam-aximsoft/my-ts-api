import { ExpressMiddlewareInterface } from "routing-controllers";
import { Request, Response } from 'express';

export class RoleMiddleware implements ExpressMiddlewareInterface {
  constructor(private roles: string[]) { }

  use(req: any, res: Response, next: (err?: any) => any): void {
    const user = req.user;

    if (!user || !this.roles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  }
}