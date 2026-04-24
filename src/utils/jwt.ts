import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

export class JwtUtil {

  static generate(payload: { id: number; role: string }) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h"
    });
  }

  static verify(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}