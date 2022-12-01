import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './service/user.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model/user";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports:[
    AuthModule,
    SequelizeModule.forFeature([
      User
  ])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
