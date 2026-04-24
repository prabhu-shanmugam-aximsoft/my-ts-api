import { JsonController, Get, UseBefore, Body, Post, Req, Res, Param, Put, Delete } from "routing-controllers";
import { UserService } from "../services/UserService";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { UpdateUserDto } from "../dtos/UpdateUserDto";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

@JsonController("/users")
@UseBefore(AuthMiddleware)
export class UserController {

    private service = new UserService();

    @Get("/")
     @UseBefore(RoleMiddleware(["admin"]))
    async getAll(@Req() req: any, @Res() resp: any) {       
        return this.service.getAll();
    }

    @Post("/")
    create(@Body() body: CreateUserDto) {
        return this.service.create(body);
    }

    @Put("/:id")
    async updateUser(
        @Param("id") id: number,
        @Body() body: UpdateUserDto,
        @Req() req: any
    ) {

        // user can update their own profile
        const isSelf = req.user.id === id;

        // admin can update anyone
        const isAdmin = req.user.role === "admin";

        if (!isSelf && !isAdmin) {
            throw new Error("Forbidden");
        }

        if (!isAdmin && body.role) {
            throw new Error("Only admin can change role");
        }

        return this.service.update(id, body);
    }


    @Delete("/:id")
    @UseBefore(RoleMiddleware(["admin"]))
    async deleteUser(
        @Param("id") id: number,
        @Req() req: any
    ) {

        await this.service.delete(id);

        return {
            "message": "User deleted"
        };
    }
}