import { User, UserRoles } from "../entity/User";
import { AppDataSource } from "../db";
import { NextFunction, Request, Response } from "express";

const userRepository = AppDataSource.getRepository(User);

export async function getAll(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const users = await userRepository.find({
      where: request.query,
    });

    return response.status(200).json({
      ok: true,
      users,
    });
  } catch (error) {
    return response.status(401).json({
      error,
    });
  }
}
