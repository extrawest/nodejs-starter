import { ApiProperty } from "@nestjs/swagger";

export class getResetPasswordResponse {
  constructor(partial?: Partial<getResetPasswordResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: "Token for recovery password",
    required: true
  })
  public token: string;
}