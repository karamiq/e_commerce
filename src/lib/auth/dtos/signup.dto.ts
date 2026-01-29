import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SignupDto {
    @ApiProperty({
        description: 'Display name of the user',
        minLength: 3,
        maxLength: 32,
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(32)
    name: string;

    @ApiProperty({
        description: 'User email used for authentication and communication',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password used for authentication',
        minLength: 8,
        maxLength: 32,
        example: 'P@ssw0rd1',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}