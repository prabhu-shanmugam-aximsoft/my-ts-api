import { JsonController, Post, Body } from "routing-controllers";
import { UserService } from "../services/UserService";
import { HashUtil } from "../utils/hash";
import { JwtUtil } from "../utils/jwt";
import { RegisterDto, LoginDto } from "../dtos/RegisterDto";

@JsonController("")
export class AuthController {
    private userService = new UserService();

    @Post("/signup")
    async register(@Body() body: RegisterDto) {
       
        const user = await this.userService.create(body);

        const token = JwtUtil.generate({
            id: user.id,
            role: user.role,
        });

        return {
            "message": "User registered",
            "token": token,
            "role": user.role
        };

    }

    @Post("/login")
    async login(@Body() body: LoginDto) {

        const user = await this.userService.findByEmail(body.email);
        if (!user || !(await HashUtil.compare(body.password, user.password))) {
            throw new Error("Invalid credentials");   // same message for both failures
        }

        const token = JwtUtil.generate({
            id: user.id,
            role: user.role,
        });

        return { token, role: user.role };
    }
}