import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  public async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
    return await verify(storedPasswordHash, password);
  }

  public async login(user: any) {
    const payload = {id: user.id};
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
