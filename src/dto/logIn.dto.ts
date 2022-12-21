// @ts-ignore
import { IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  private email: string | undefined;

  @IsString()
  private password: string | undefined;
}