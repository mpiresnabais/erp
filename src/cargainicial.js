require("./models/Modelos");
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const mongoUri = "mongodb://0.0.0.0:27017/erp1";
const util = require("util");
const sleep = util.promisify(setTimeout);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  /* useCreateIndex: true, */
  useUnifiedTopology: true,
  /*  useFindAndModify: false, */
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

async function poblar(callback) {
  await Users.deleteMany({});

  console.log("borre todo");

  let user = new Users({
    user: "user1",
    idKey: "1234",
  });
  await user.save();
  console.log("creo el user", user);

  return callback();
}
poblar(() => {
  mongoose.connection.close();
});
