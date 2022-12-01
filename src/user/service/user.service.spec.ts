import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { MAX_RANDOM_BITES_CHARS_COUNT, User } from "../model/user";
import { getModelToken } from "@nestjs/sequelize";
import { UserAlreadyExist, UserNotFound } from "../user.errors";
import { ResetUserPasswordRequest } from "../dto/reset-user-password.request";
import { AuthService } from "../../auth/service/auth.service";
import { JwtService } from "@nestjs/jwt";
import crypto from "crypto";

describe("UserService", () => {
  let service: UserService;
  let authService: AuthService
  let jwtService: JwtService
  let userModelMock;
  let tx;
  let txMock;
  const hashMock = {
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValueOnce('encrypt 123'),
  };
  beforeEach(async () => {
    tx = {
      commit: jest.fn(),
      rollback: jest.fn()
    };
    txMock = jest.fn().mockImplementation(() => tx);
    userModelMock = {
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      sequelize: { transaction: txMock }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        JwtService,
        { provide: getModelToken(User), useValue: userModelMock }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });
  describe("set user method", () => {
    it("should create user", async () => {
      userModelMock.findOne.mockResolvedValue(false);
      userModelMock.create.mockResolvedValue({
        id: 1,
        email: "test@test.com",
        password: "12345678"
      } as User);
      await service.setUser({
        email: "test@test.com",
        password: "test"
      });
      expect(userModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(userModelMock.create).toHaveBeenCalledTimes(1);
    });

    it("should be error user exist", async () => {
      userModelMock.findOne.mockResolvedValue(true);
      userModelMock.create.mockImplementation(() => {
        new UserAlreadyExist();
      });
      await expect(service.setUser({
        email: "test@test.com",
        password: "test"
      })).rejects.toThrowError();
      expect(userModelMock.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe("resetUserPassword method", () => {
    it("should set new user password", async () => {
      userModelMock.findOne.mockResolvedValue({
        id: 1,
        email: "test@test.com",
        resetPasswordToken: "test"
      });

      userModelMock.update.mockResolvedValue({
        resetPasswordToken: "test"
      });
      const requestMock = new ResetUserPasswordRequest({
        token: "test",
        password: "test1234",
        confirmPassword: "test1234"
      });
      await service.resetUserPassword(requestMock);
      expect(userModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(userModelMock.findOne).toHaveBeenCalledWith({
        where: {
          resetPasswordToken: "test"
        }
      });
      expect(userModelMock.update).toHaveBeenCalledTimes(1);
    });

    it("should be error password do not match", async () => {
      userModelMock.update.mockResolvedValue({
        resetPasswordToken: "test"
      });
      const requestMock = new ResetUserPasswordRequest({
        token: "test",
        password: "test123",
        confirmPassword: "test1234"
      });
      await expect(service.resetUserPassword(requestMock)).rejects.toThrowError();
    });
  });

  describe("getResetPasswordToken method", () => {
    it("should get reset password token", async () => {
      userModelMock.findOne.mockResolvedValue({
        id: 1,
        email: "test@test.com",
        resetPasswordToken: ""
      });
      userModelMock.update.mockResolvedValue({
        id: 1,
        resetPasswordToken: ""
      });
      await service.getResetPasswordToken("test@test.com")
      expect(userModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(userModelMock.update).toHaveBeenCalledTimes(1);
    });
    it("should get error", async () => {
      userModelMock.findOne.mockImplementation(() => {
        new UserNotFound();
      });
      await expect(service.getResetPasswordToken("test1@test.com")).rejects.toThrowError(new UserNotFound());
      expect(userModelMock.findOne).toHaveBeenCalledTimes(1);
    });

  });

});
