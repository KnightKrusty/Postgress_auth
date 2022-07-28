import { connect } from "./db";
import express from "express";
import router from "./routes/user-routes";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/./.env" });

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", router);

const start = async () => {
  try {
    await connect().then(() => console.log("DB Connection Successful"));
    app.listen(3000, () => console.log("Listensing on Port 3000"));
  } catch (error) {
    console.log(error);
  }
};

start();
