import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
  constructor(partial?: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    description: "JWT access token"
  })
  public accessToken: string;
}