const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.resolve(
    __dirname,
    "../.env." + (process.env.NODE_ENV || "development")
  ),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  DB: process.env.MONGO_SERVER_LOCAL
};
