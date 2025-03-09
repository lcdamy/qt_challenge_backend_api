import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {

    @IsString()
    @ApiProperty({ example: "e34332bc-28be-49b4-9a7e-db673704b00e", description: "The refresh token." })
    token: string;
}