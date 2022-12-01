import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserRequest } from "../dto/create-user.request";
import { ResetUserPasswordRequest } from "../dto/reset-user-password.request";
import { getResetPasswordRequest } from "../dto/get-reset-password.request";
import { getResetPasswordResponse } from "../dto/get-reset-password.response";
import { LoginRequest } from "../dto/login.request";
import { LoginResponse } from "../dto/login.response";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserId } from "../../common/decorators";
import { GetUserResponse } from "../dto/get-user.response";

@ApiTags("User API")
@Controller("/api/1.0/user")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ description: "Create user" })
  public async setUser(
    @Body() query: CreateUserRequest
  ) {
    return this.userService.setUser(query);
  }

  @Post("/reset/code")
  @ApiOperation({ description: "Get code for reset user password" })
  @ApiResponse({
    description: "Generated code for reset user password",
    type: getResetPasswordResponse
  })
  public async getResetCode(
    @Body() query: getResetPasswordRequest
  ) {
    return this.userService.getResetPasswordToken(query.email);
  }

  @Post("/reset/password")
  @HttpCode(201)
  @ApiOperation({ description: "Reset user password user" })
  public async resetPassword(
    @Body() query: ResetUserPasswordRequest
  ) {
    return await this.userService.resetUserPassword(query);
  }

  @Post("/login")
  @ApiOperation({ description: "Login" })
  @ApiResponse({
    description: "Return access JWT token",
    type: LoginResponse
  })
  public async login(
    @Body() query: LoginRequest
  ) {
    return await this.userService.login(query);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: "Get user info" })
  @ApiResponse({
    description: "Return user info",
    type: GetUserResponse
  })
  public async me(
    @UserId() userId: number
  ) {
    return this.userService.getUserInfoById(userId);
  }

}
