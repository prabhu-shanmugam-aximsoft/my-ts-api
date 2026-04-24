import { JsonController, Get, UseBefore, Body, Req, Res, Param, Put } from "routing-controllers";
import { UserService } from "../services/UserService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ProfileUpdateDto } from "../dtos/ProfileUpdateDto";

@JsonController("/profile")
@UseBefore(AuthMiddleware)
export class ProfileController {

    private service = new UserService();

    @Get("/")
    async getCurrent(@Req() req: any, @Res() resp: any) {
        return this.service.findByID(req.user.id);
    }

    @Put("/")
    async updateUser(
        @Body() body: ProfileUpdateDto,
        @Req() req: any
    ) {
        return this.service.update(req.user.id, body);
    }


}