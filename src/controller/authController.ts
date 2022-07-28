import { NextFunction, Request, Response } from "express";
import { User, UserRoles } from "../entity/User";
import { AppDataSource } from "../db";
import { validate } from "class-validator";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const userRepository = AppDataSource.getRepository(User);

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN as string,
  });

const createSendToken = (
  user: User,
  statusCode: number,
  response: Response
) => {
  const token = signToken(user.uid);

  const cookieOptions = {
    httpOnly: true,
    maxAge:
      new Date().getMilliseconds() +
      parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) *
        24 *
        60 *
        60 *
        1000,
  };

  // @ts-ignore
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  response.cookie("jwt", token, cookieOptions);

  //@ts-ignore
  user.password = undefined;
  //@ts-ignore
  user.id = undefined;
  //@ts-ignore
  user.uid = undefined;

  response.status(statusCode).json({
    status: "Logged in successfully",
    token,
    data: user,
  });
};

export async function login(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { email, password, role } = request.body;

    const user = await userRepository.findOne({
      select: { password: true, email: true, role: true },
      where: [{ email }],
    });

    if (!user || user.role !== role) {
      return response.status(401).json({
        error: "email or password is wrong",
      });
    }

    const comparePass = await user.comparePasswithHashPassword(password);

    if (comparePass) {
      createSendToken(user, 200, response);
    } else {
      return response.status(401).json({
        status: "email or password is wrong",
      });
    }
  } catch (error) {
    return response.status(501).json({
      error,
    });
  }
}

export async function signup(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email, mobile, password, firstName, lastName, role } = request.body;

    const user = new User();
    user.email = email;
    user.mobile = mobile;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;

    if (role === "admin") {
      user.role = UserRoles.ADMIN;
    } else if (role === "trainer") [(user.role = UserRoles.TRAINER)];

    const validationError = await validate(user);

    if (validationError.length > 0) {
      return response.status(501).json(validationError);
    }

    const lookforuser = await userRepository.find({
      where: [{ email }, { mobile }],
    });

    if (lookforuser.length > 0) {
      return response.status(401).json({
        status: 501,
        error: "user already exise with this email or mobile numser",
      });
    }

    user.password = await user.hashPassword();
    user.uid = crypto.randomUUID();

    const createdUser = await userRepository.insert(user);

    return response.status(200).json({
      status: 201,
      ok: true,
    });
  } catch (error) {
    return response.status(501).json({
      error,
    });
  }
}

export async function protect(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  try {
    let token: string | undefined;

    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer")
    ) {
      console.log(request.headers.authorization.split(" "));
      token = request.headers.authorization.split(" ")[1];
    } else if (request.cookies.jwt) {
      token = request.cookies.jwt;
    }

    if (!token) {
      return response.status(501).json({
        status: "denied",
        error: "You are not authorized to get access",
      });
    }

    //@ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //@ts-ignore
    const user = await userRepository.findOne({ where: { uid: decoded.id } });

    // @ts-ignore
    request.user = user;
    next();
  } catch (error) {
    return response.status(501).json({
      ok: false,
      message: error,
    });
  }
}

export async function me(
  request: Request,
  response: Response,
  next: NextFunction
) {
  return response.status(200).json({
    ok: true,
    //@ts-ignore
    user: request.user,
  });
}
