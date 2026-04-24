import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateContactDto {
  @IsNotEmpty()
  full_name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  message!: string;
}