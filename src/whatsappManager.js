require("./models/Modelos");
const mongoose = require("mongoose");
const { Client, LocalAuth } = require("whatsapp-web.js");
const LogSends = mongoose.model("LogSends");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

var client;
let sessionData;

module.exports.iniciarWhatsappBot = () => {
  client = new Client({
    authStrategy: new LocalAuth({
      clientID: "Cliente1",
      dataPath: "./.wwebjs_auth",
    }),
  });
  client.on("ready", () => {
    console.log("ready!!");
  });
  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("disconnected", async () => {
    console.log(
      "me desconecte del Wapp, seguramente lo estan usando en otro dispisitivo"
    );
    await sleep(10000);
    client.initialize();
  });

  client.on("message_create", async (msg) => {
    const { from } = msg;
  });
};
module.exports.enviarMsg = (to, message) => {
  console.log("********************", to, message);
  try {
    client.sendMessage(to, message);
    const logSends = new LogSends({
      nroWhatsapp: to,
      msg: message,
    });

    logSends.save();
  } catch {}
};
