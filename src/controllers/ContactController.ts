import { JsonController, Post, Body, Get, UseBefore, Req, Res, QueryParam, Param, Delete } from "routing-controllers";
import { ContactService } from "../services/ContactService";
import { CreateContactDto } from "../dtos/CreateContactDto";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";


@JsonController("/contact")
@UseBefore(AuthMiddleware)
export class ContactController {
    private service = new ContactService();

    @Post("/")
    async create(@Body() body: CreateContactDto) {
        await this.service.create(body);
        return {
            message: "Submission saved"
        };
    }

    @Get("/")
    @UseBefore(AuthMiddleware)
    @UseBefore(RoleMiddleware(["admin"]))
    getAll(@Req() req: any, @Res() resp: any, @QueryParam("limit") limit: number = 50,
        @QueryParam("offset") offset: number = 0) {


        if (limit < 1 || limit > 100) {
            throw new resp.status(400).json("Limit must be between 1 and 100");
        }

        if (offset < 0) {
            throw new resp.status(400).json("Offset must be >= 0");
        }

        return this.service.getAll(limit, offset);
    }


    // Matches GET /users/:id (e.g., /users/5)
    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.service.findById(id);
    }

    @Delete("/:id")
    @UseBefore(RoleMiddleware(["admin"]))
    async delete(
        @Param("id") id: number,
        @Req() req: any
    ) {

        await this.service.delete(id);

        return {
            "message": "User deleted"
        };
    }


}