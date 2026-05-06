import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { ProfileController } from "./controllers/ProfileController";
import { ContactController } from "./controllers/ContactController";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { LoggerMiddleware } from "./middlewares/LoggerMiddleware";

export const app = createExpressServer({
    routePrefix: '/api',
    cors: {
        origin: 'http://localhost:5173', // Restrict to specific origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    controllers: [AuthController, UserController, ContactController, ProfileController],
    middlewares: [LoggerMiddleware,ErrorMiddleware],
    validation: true ,
    defaultErrorHandler: false   
});