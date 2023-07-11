import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(
    __dirname,
    "../.env." + (process.env.NODE_ENV || "development")
  ),
});

export default  {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  DB: process.env.MONGO_SERVER_LOCAL
};
