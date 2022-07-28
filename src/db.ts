import { DataSource } from "typeorm";
import { User } from "./entity/User";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/./.env" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User],
});

export const connect = () => {
  return AppDataSource.initialize();
};
