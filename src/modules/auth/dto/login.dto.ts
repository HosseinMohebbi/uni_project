import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: i18nValidationMessage('auth-validations.emailIsNotEmpty'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('auth-validations.isEmail'),
    },
  )
  @MaxLength(100, {
    message: i18nValidationMessage('auth-validations.emailMaxLength'),
  })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({
    message: i18nValidationMessage('auth-validations.passwordIsNotEmpty'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('auth-validations.passwordMinLength'),
  })
  password: string;
}
