import { Injectable, Logger } from "@nestjs/common";
import { MAX_RANDOM_BITES_CHARS_COUNT, User } from "../model/user";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserRequest } from "../dto/create-user.request";
import { ResetUserPasswordRequest } from "../dto/reset-user-password.request";
import { hash } from "argon2";
import { UserAlreadyExist, UserNotFound, UserPasswordDoNotMatch, WrongPasswordOrLogin } from "../user.errors";
import { randomBytes } from "crypto";
import { LoginRequest } from "../dto/login.request";
import { AuthService } from "../../auth/service/auth.service";
import { GetUserResponse } from "../dto/get-user.response";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly authService: AuthService
  ) {
  }

  private readonly logger = new Logger(UserService.name);

  public async setUser(user: CreateUserRequest) {
    if (await this.getUserByEmail(user.email)) {
      throw new UserAlreadyExist();
    }
    const tx = await this.userModel.sequelize.transaction();
    try {
      await this.userModel.create({
        email: user.email,
        password: await hash(user.password)
      }, { transaction: tx });
      await tx.commit();
    } catch (e) {
      this.logger.error("Cannot create user", e);
      await tx.rollback();
    }
  }

  public async resetUserPassword(data: ResetUserPasswordRequest) {
    const user = await this.userModel.findOne({
      where: {
        resetPasswordToken: data.token
      }
    });
    if (!user) {
      throw new UserNotFound();
    }
    if (data.password !== data.confirmPassword) {
      throw new UserPasswordDoNotMatch();
    }
    const tx = await this.userModel.sequelize.transaction();
    try {
      await this.userModel.update({
        password: await hash(data.password),
        resetPasswordToken: null
      }, {
        where: {
          resetPasswordToken: data.token
        },
        transaction: tx
      });
      await tx.commit();
    } catch (e) {
      this.logger.error("Cannot update user", e);
      await tx.rollback();
    }

  }

  public async getResetPasswordToken(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UserNotFound();
    }
    const resetPasswordToken = await randomBytes(MAX_RANDOM_BITES_CHARS_COUNT).toString("hex");
    const tx = await this.userModel.sequelize.transaction();
    try {
      await this.userModel.update({
        resetPasswordToken
      }, {
        where: {
          id: user.id
        },
        transaction: tx
      });
      await tx.commit();
      return { token: resetPasswordToken };

    } catch (e) {
      this.logger.error("Cannot update user", e);
      await tx.rollback();
    }
  }

  public async getUserByEmail(email: string) {
    return await this.userModel.findOne({
      where: {
        email
      }
    });
  }

  public async login(data: LoginRequest) {
    const user: User = await this.getUserByEmail(data.email);
    if (!user) {
      throw new UserNotFound();
    }
    if (!await this.validatePassword(data.password, user.password)) {
      throw new WrongPasswordOrLogin();
    }
    return this.authService.login(user);
  }

  private async validatePassword(password: string, storedPasswordHash: string): Promise<boolean> {
    return await this.authService.comparePasswords(password, storedPasswordHash);
  }

  public async getUserInfoById(userId: number) {
    return new GetUserResponse(
      await this.userModel.findByPk(userId,
        {
          raw: true,
          attributes: [
            "id","email"
          ]
        })
    );
  }
}
