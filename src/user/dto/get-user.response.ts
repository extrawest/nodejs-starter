import { ApiProperty } from "@nestjs/swagger";

export class GetUserResponse {
  constructor(partial?: Partial<GetUserResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: "User id,"
  })
  public id: number;

  @ApiProperty({
    description: "User email,"
  })
  public email: string;
}