import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get("JWT_SECRET"),
        signOptions: { expiresIn: "10000s" }
      })
    })
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, ConfigService],
  exports: [AuthService],
})
export class AuthModule {
}
