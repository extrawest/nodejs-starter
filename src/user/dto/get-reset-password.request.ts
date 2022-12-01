import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail } from "@nestjs/class-validator";

export class getResetPasswordRequest {
  constructor(partial?: Partial<getResetPasswordRequest>) {
    Object.assign(this, partial);
  }
  @IsEmail()
  @IsDefined()
  @ApiProperty({
    description: "User email, should be unique",
    required: true
  })
  public email: string;

}