import { ExpressMiddlewareInterface } from "routing-controllers";
import { JwtUtil } from "../utils/jwt";
import { Request, Response } from 'express';

export class AuthMiddleware implements ExpressMiddlewareInterface {

  use(req: any, res: Response, next: (err?: any) => any): void {

    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
          
      const user = JwtUtil.verify(token);
      req.user = user ;
      next();
    } catch {
      res.status(401).json({ message: "Invalid Token" });
      return;
    }
  }
}