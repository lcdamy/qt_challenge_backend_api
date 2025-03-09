import { IsString, IsUrl } from "class-validator";

export class CreateShortenUrlDto {
    @IsString({ message: "The URL must be a string." })
    @IsUrl({}, { message: "The URL must be a valid URL." })
    long_url: string;
}