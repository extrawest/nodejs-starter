import { HttpException } from "@nestjs/common";

export abstract class Errors extends HttpException {
  protected constructor(
    status: number,
    message: string,
    code:any = false
  ) {
    if(code){
      message +=`: ${code}`;
    }
    super(message, status);
  }
}