import { ApiProperty } from "@nestjs/swagger";
import { Length } from "@nestjs/class-validator";

export class ResetUserPasswordRequest {
  constructor(partial?: Partial<ResetUserPasswordRequest>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: "User token, should be unique",
    required: true
  })
  public token: string;

  @Length(8, 40)
  @ApiProperty({
    description: "User password",
    required: true
  })
  public password: string;

  @Length(8, 40)
  @ApiProperty({
    description: "User confirm password",
    required: true
  })
  public confirmPassword: string;
}