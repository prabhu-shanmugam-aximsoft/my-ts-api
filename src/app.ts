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
    controllers: [AuthController, UserController, ContactController, ProfileController],
    middlewares: [LoggerMiddleware, ErrorMiddleware],
    validation: true
});