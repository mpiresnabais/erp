require("../models/Modelos");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const session_path = "./src/session.json";
const fs = require("fs");
const { procesarMenu } = require("./menuHandler");
const { procesarMsgLista } = require("./listasHandler");
const { procesarMsgEncuesta, finencuesta } = require("./encuestasHandler");
const mongoose = require("mongoose");
const { procesarUtil } = require("./utilHandler");
const Encuestas = mongoose.model("Encuestas");
const Log = mongoose.model("Log");
var client;
let sessionData;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

    if (from == "5491155701153@c.us") tratarmsg(msg);
  });

  client.on("message", async (msg) => {
    tratarmsg(msg);
  });

  async function tratarmsg(msg) {
    const { from, to, body, mentionedIds, author } = msg;
    msgstr = JSON.stringify(msg);
    remote = msg.id.remote;
    participant = msg.id.participant;
    let log = new Log({
      msg: msgstr,
      participant: participant,
      from: from,
      remote: remote,
    });
    await log.save();
    console.log(participant, " ", from, " ", remote, " ", body);

    /* var res = { msg: msg, encuesta: "" }; */

    switch (true) {
      case body.substring(0, 10).toLowerCase().includes("&encuesta"):
      case body.substring(0, 3).toLowerCase() == "&si":
      case body.substring(0, 3).toLowerCase() == "&no":
      case body.substring(0, 14).toLowerCase() == "&finencuesta":
        res = await procesarMsgEncuesta(msg);

        if (res.msg) {
          msg.reply(res.msg);
        }

        if (res.encuesta && res.accion == "timer") {
          final(res.encuesta);
        }

        if (res.encuesta && res.accion == "avisar") {
          console.log("AAAAAAA", res);
          client.sendMessage(
            res.encuesta.grupo,
            `Encuesta sobre: ${res.encuesta.pregunta} finalizada por usuario. Por si: ${res.encuesta.si} votos. Por no: ${res.encuesta.no} votos.`
          );
        }

        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        break;
        console.log(body.substring(0, 2));
      case body.substring(0, 6).toLowerCase().includes("&lista"):
      case body.substring(0, 2).toLowerCase() == "&+":
      case body.substring(0, 2).toLowerCase() == "&-":
      case body.substring(0, 9).toLowerCase() == "&finlista":
      case body.substring(0, 9).toLowerCase() == "&verlista":
        if (body.length >= 3) {
          resLista = await procesarMsgLista(msg);

          if (resLista.msg) {
            msg.reply(resLista.msg);
          }
        }
        break;
      case body.substring(0, 6).toLowerCase().includes("&menu"):
      case body.substring(0, 8).toLowerCase().includes("&mlista"):
      case body.substring(0, 12).toLowerCase().includes("&mencuesta"):
        resLista = await procesarMenu(msg);

        if (resLista.msg) {
          msg.reply(resLista.msg);
        }
        break;
      case body.substring(0, 6).toLowerCase().includes("&="):
      case body.substring(0, 6).toLowerCase().includes("&clima"):
        resLista = await procesarUtil(msg);
        if (resLista.msg) {
          msg.reply(resLista.msg);
        }
    }
    /*enviarMsg(from, "Hola");*/
  }
};
async function final(res) {
  console.log("Taking a break..  res:", res);
  await sleep(res.duracion * 60000);
  try {
    encuesta = await Encuestas.findOne({
      estado: "Activa",
      grupo: res.grupo,
    });
    console.log("la encontro? ", encuesta);

    if (encuesta) {
      console.log(
        "aca",
        encuesta.grupo,
        `${encuesta.pregunta},${encuesta.si}`,
        res
      );
      var msgfin = `Encuesta sobre: ${encuesta.pregunta} finalizada por tiempo. Por si: ${encuesta.si} votos. Por no: ${encuesta.no} votos. \n`;
      var z = 0;
      for (var i = 0; i < encuesta.votos.length; i++) {
        if (encuesta.votos[i].voto == "si") {
          z++;
          if (z == 1) msgfin = msgfin + ` Por si: \n`;
          arroba = encuesta.votos[i].usuario.search("@");
          aut = encuesta.votos[i].usuario.substring(arroba - 8, arroba);
          msgfin = msgfin + ` ` + z + `-` + aut + `\n`;
        }
      }
      z = 0;

      for (var i = 0; i < encuesta.votos.length; i++) {
        if (encuesta.votos[i].voto == "no") {
          z++;
          if (z == 1) msgfin = msgfin + ` Por no: \n`;
          arroba = encuesta.votos[i].usuario.search("@");
          aut = encuesta.votos[i].usuario.substring(arroba - 8, arroba);
          msgfin = msgfin + ` ` + z + `-` + aut + `\n`;
        }
      }
      client.sendMessage(encuesta.grupo, msgfin);
      finencuesta(encuesta.grupo);
    }
  } catch (e) {
    console.log(e);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports.enviarMsgVisita = (to, message) => {
  console.log("********************", to, message);

  /* client.initialize(); */
  client.sendMessage(to, message);
  if (message.mimetype == "image/jpg") {
    qrcode.generate(message.filename, {
      small: true,
    });
  }
};

async function reiniciar() {
  encActivas = await Encuestas.find({
    estado: "Activa",
  });
  try {
    encActivas.forEach(tratoEncActivas);
  } catch {}

  function tratoEncActivas(element) {
    console.log(element.diaHoraDesde, element.duracion);
    if (element.duracion >= 60) {
      horas = Math.trunc(element.duracion / 60) * 100;
      min = element.duracion % 60;
      console.log("yh y m", horas, min);
      fin = element.diaHoraDesde + horas + min;
    } else {
      fin = element.diaHoraDesde + element.duracion;
    }
    console.log("new duration", fin);
    let d = new Date();
    let horaactual = d.getMinutes() + d.getHours() * 100;
    falta = fin - horaactual;
    console.log("falta", falta);
    if (falta > 0) {
      element.duracion = falta;
      final(element);
    } else {
      element.duracion = 1;
      final(element);
    }
  }
}
