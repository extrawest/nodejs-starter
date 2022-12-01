import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, Length } from "@nestjs/class-validator";

export class LoginRequest {
  constructor(partial?: Partial<LoginRequest>) {
    Object.assign(this, partial);
  }
  @IsEmail()
  @IsDefined()
  @ApiProperty({
    description: "User email, should be unique",
    required: true
  })
  public email: string;

  @Length(8, 40)
  @IsDefined()
  @ApiProperty({
    description: "User password, min 8 max 40 chars",
    required: true
  })
  public password: string;

}