require("../models/Modelos");
const mongoose = require("mongoose");
const Encuestas = mongoose.model("Encuestas");

module.exports.procesarMsgEncuesta = async (msg) => {
  const { from, body } = msg;
  remote = msg.id.remote;
  console.log("Handler 7 ", msg);
  var { author } = msg;
  if (!author) author = from;
  var res = {
    msg: null,
    encuesta: null,
    accion: null,
  };

  let encuesta = await Encuestas.findOne({ estado: "Activa", grupo: remote });

  if (
    body.toLowerCase().includes("encuesta") &&
    !body.toLowerCase().includes("finencuesta")
  ) {
    /* Extraigo los datos para crear la encuesta  */
    iniciopregunta = body.toLowerCase().search("encuesta");

    if (body.toLowerCase().includes("durac")) {
      inicioduracion = body.toLowerCase().search("durac");
      pregunta = body.substr(
        iniciopregunta + 9,
        inicioduracion - iniciopregunta - 9
      );
    } else {
      pregunta = body.substr(iniciopregunta + 9, 120);
    }

    let duracion;
    if (body.toLowerCase().includes("durac")) {
      try {
        duracion = body.substr(inicioduracion + 9, inicioduracion + 11);
        console.log(duracion);
      } catch {
        duracion = 1;
      }
    }

    if (!duracion || duracion > 1000) duracion = 1;

    let d = new Date();
    let horaactual = d.getMinutes() + d.getHours() * 100;
    if (!encuesta) {
      /* await Encuestas.deleteMany({}); */
      let encuesta = new Encuestas({
        pregunta: pregunta,
        grupo: remote,
        si: 0,
        no: 0,
        duracion: duracion,
        diaHoraDesde: horaactual,
        author: author,
        estado: "Activa",
      });
      await encuesta.save();
      res.msg = `Encuesta creada, finaliza en ${duracion} minutos `;
      res.encuesta = encuesta;
      res.accion = "timer";
      return res;
    } else {
      res.msg = "Ya hay encuesta en marcha. Pera que termine.";
      return res;
    }
  }

  var res = {
    msg: "",
    encuesta: null,
  };

  if (encuesta) {
    let yavoto = encuesta.votos.find((x) => x.usuario == author);
    console.log(author, yavoto);

    if (body.toLowerCase() == "&si" && encuesta) {
      if (yavoto) {
        res.msg =
          "Epa! Ya habias votado vos, lo descarto, ¿Queres cambiar tu voto? espera el proximo release ";
        return res;
      } else {
        encuesta.si = encuesta.si + 1;
        await encuesta.votos.push({ usuario: author, voto: "si" });
        await encuesta.save();
        res.msg = "ok,ok lo anoto";
        return res;
      }
    }

    if (body.toLowerCase() == "&no" && encuesta) {
      if (yavoto) {
        res.msg =
          "Para hermano que vos ya votaste,, ¿Queres cambiar tu voto? espera el proximo release";
        return res;
      } else {
        encuesta.no = encuesta.no + 1;
        await encuesta.votos.push({ usuario: author, voto: "no" });
        await encuesta.save();
        res.msg = "Anotado";
        return res;
      }
    }
  } else {
    res.msg = "No hay encuesta activa";
    return res;
  }

  if (body.toLowerCase() == "&finencuesta" && encuesta) {
    if (author == encuesta.author) {
      let encuestax = await Encuestas.findOne({
        estado: "Activa",
        grupo: encuesta.grupo,
      });
      encuestax.estado = "Finalizada";
      encuestax.save();
      res.encuesta = encuestax;
      res.accion = "avisar";
      return res;
    }
  } else {
    res.msg = "No hay encuesta activa";
    return res;
  }

  return res;
};

module.exports.finencuesta = async (remote) => {
  let encuesta = await Encuestas.findOne({ estado: "Activa", grupo: remote });
  console.log("handler ", remote);
  console.log("fin encuesta");
  encuesta.estado = "Finalizada";
  encuesta.save();
};
/* `Encuesta finalizada: Resultado Si: ${encuesta.si} , No ${encuesta.no}` */
