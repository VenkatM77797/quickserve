import {IsEmail,IsNotEmpty,IsString,MinLength,Matches,} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "Name must be at least 3 characters" })
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9]).*$/, {
    message: "Password must contain 1 uppercase letter and 1 number",
  })
  password!: string;
}