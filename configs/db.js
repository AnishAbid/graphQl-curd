//require mongoose module
var mongoose = require("mongoose");
const config = require("./index");
//require database URL from properties file
var dbURL = config.DB;


//export this function and imported by server.js
module.exports = function () {
  return new Promise((resolve) => {
    mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", function () {
      console.log("Mongoose default connection is open to ", dbURL);
      resolve(true);
    });

    mongoose.connection.on("error", function (err) {
      console.log(
        "Mongoose default connection has occured " + err + " error");
      resolve(false);
    });

    mongoose.connection.on("disconnected", function () {
      console.log("Mongoose default connection is disconnected");
      resolve(false);
    });

    process.on("SIGINT", function () {
      mongoose.connection.close(function () {
        console.log(
          "Mongoose default connection is disconnected due to application termination"
          )
        process.exit(0);
      });
      resolve(false);
    });
  });
};
