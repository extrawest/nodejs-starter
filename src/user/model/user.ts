import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

export const MAX_RANDOM_BITES_CHARS_COUNT = 16;

@Table({ tableName: "users" })
export class User extends Model {
  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryKey
  @AutoIncrement
  @Column({ field: "id" })
  public id: number;

  @AllowNull(false)
  @Column({ field: "email" })
  public email: string;

  @AllowNull(false)
  @Column({ field: "password" })
  public password: string;

  @AllowNull(true)
  @Column({ field: "reset_password_token" })
  public resetPasswordToken: string;

}