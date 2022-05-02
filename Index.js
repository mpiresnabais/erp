var log4js = require("log4js");
log4js.configure({
  appenders: { app: { type: "file", filename: "bottoba.log" } },
  categories: { default: { appenders: ["app"], level: "info" } },
});
var logger = log4js.getLogger();

logger.level = "debug"; // default level is OFF - which means no logs at all.
logger.info("aca sale la info");

const { iniciarWhatsappBot } = require("./src/whatsappManager");

const mongoose = require("mongoose");

const mongoUri = "mongodb://0.0.0.0:27017/pruebabot";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    /* useCreateIndex: true, */

    useUnifiedTopology: true,
    /*  useFindAndModify: false, */
  })
  .then((db) => console.log("Connected to mongo instance!"))
  .catch((error) => console.log("Error connecting to mongo", error));

mongoose.connection.on("error", (err) => {
  logger.info("Error connecting to mongo", err);
});

iniciarWhatsappBot();
