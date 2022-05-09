const { app } = require("./app");

const { iniciarWhatsappBot } = require("./src/whatsappManager");

const mongoose = require("mongoose");

const mongoUri = "mongodb://0.0.0.0:27017/erp1";

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
app.get("/", (req, res) => {
  res.send(`Working`);
});

app.listen(3011, () => {
  console.log("Listening on 3011");
});

iniciarWhatsappBot();
