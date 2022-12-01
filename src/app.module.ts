import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        uri: configService.get("POSTGRES_URI"),
        autoLoadModels: true,
        alter: false,
        dialectOptions: {
          useUTC: false
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        minifyAliases: true
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
