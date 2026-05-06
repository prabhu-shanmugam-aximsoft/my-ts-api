import {
    ExpressErrorMiddlewareInterface,
    Middleware
} from "routing-controllers";
import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from 'express';


@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {

    error(error: any, req: Request, res: Response, next: NextFunction) {

        logger.error(`${req.method} ${req.url} - ${error.message}`, {
            stack: error.stack,
            user: req.user || null
        });

        const status = error.httpCode || 500;

        const clientMessage = status >= 501 ? "Internal Server Error" : error.message;

        res.status(status).json({
            success: false,
            message: clientMessage
        });       

    }
}