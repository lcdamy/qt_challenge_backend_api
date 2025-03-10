import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class GetRefreshTokenDto {

    @IsEmail()
    @ApiProperty({ example: "email@gmail.com", description: "The email of the user." })
    email: string;
}