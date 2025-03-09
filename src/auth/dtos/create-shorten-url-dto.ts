import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

export class CreateShortenUrlDto {
    @IsString({ message: "The URL must be a string." })
    @IsUrl({}, { message: "The URL must be a valid URL." })
    @ApiProperty({ example: "https://refine.dev/docs/guides-concepts/general-concepts/#hook-concept", description: "The long URL to shorten." })
    long_url: string;
}