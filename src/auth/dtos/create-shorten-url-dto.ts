import { IsUrl } from "class-validator";

export class CreateShortenUrlDto {
    @IsUrl()
    long_url: string;

}