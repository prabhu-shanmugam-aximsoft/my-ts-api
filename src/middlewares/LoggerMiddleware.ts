import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { logger } from "../utils/logger";
import { Request, Response } from 'express';


@Middleware({ type: "before" })
export class LoggerMiddleware implements ExpressMiddlewareInterface {

  use(req: any, res: Response, next: (err?: any) => any): void {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;

      logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`, {
        ip: req.ip,
        user: req.user || null
      });
    });

    next();
  }
}