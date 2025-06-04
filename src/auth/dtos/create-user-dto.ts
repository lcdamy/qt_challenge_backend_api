import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
     @ApiProperty({ example: "username", description: "The username of the user." })
    username: string;

    @IsEmail()
    @ApiProperty({ example: "email@gmail.com", description: "The email of the user." })
    email: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ example: "password", description: "The password of the user." })
    password: string;

    @ApiProperty({ example: "true", description: "social is true or false" })
    @IsBoolean()
    signupWithSocial?: string;
}