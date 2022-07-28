import {
  IsEmail,
  isMobilePhone,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MinLength,
  MIN_LENGTH,
} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import bcrypt from "bcrypt";

export enum UserRoles {
  MEMBER = "member",
  TRAINER = "trainer",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?!.*?[=?<>()'"\/\&]).{8,20}$/)
  password: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.MEMBER })
  role: UserRoles;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column()
  @IsPhoneNumber("IN")
  mobile: string;

  async hashPassword() {
    return (this.password = await bcrypt.hash(this.password, 12));
  }

  async comparePasswithHashPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
