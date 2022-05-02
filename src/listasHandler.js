require("../models/Modelos");
const mongoose = require("mongoose");
const Listas = mongoose.model("Listas");

module.exports.procesarMsgLista = async (msg) => {
  const { from, body } = msg;
  remote = msg.id.remote;
  var { author } = msg;
  if (!author) author = from;
  var resLista = {
    msg: null,
    lista: null,
  };

  let lista = await Listas.findOne({ estado: "Activa", grupo: remote });

  if (body.toLowerCase().includes("&lista")) {
    /* Extraigo los datos para crear la encuesta  */
    nombreLista = body.substr(6, 128);
    if (nombreLista == undefined || nombreLista == null) {
      nombreLista = "Sin nombre";
    }
    console.log(nombreLista);
    let d = new Date();
    let horaactual = d.getMinutes() + d.getHours() * 100;
    if (!lista) {
      /* await Encuestas.deleteMany({}); */
      let lista = new Listas({
        nombreLista: nombreLista.split(" ").join(""),
        grupo: remote,
        author: author,
        diaHoraDesde: horaactual,
        estado: "Activa",
      });
      await lista.save();
      arroba = lista.author.search("@");
      aut = lista.author.substring(arroba - 8, arroba);
      resLista.msg = `Lista ${nombreLista} creada por ${aut} `;
      resLista.lista = lista;
      return resLista;
    } else {
      resLista.msg = "Ya hay una lista en marcha. Aguantá.";
      return resLista;
    }
  }

  var resLista = {
    msg: "",
    lista: null,
    accion: null,
  };

  if (lista) {
    var nombre = body.substr(2, 25).split(" ").join("");
    nombre = nombre[0].toUpperCase() + nombre.slice(1);

    let yaesta = lista.votos.find((x) => x.nombre == nombre && x.voy == "si");
    console.log(author, yaesta);

    if (body.substring(0, 2).toLowerCase() == "&+" && lista) {
      if (yaesta) {
        resLista.msg =
          "Epa! Ese elemento ya esta, si queres borrarlo envia &- ";
        return resLista;
      } else {
        await lista.votos.push({ nombre: nombre, authorv: author, voy: "si" });
        await lista.save();
        resLista.msg = "ok,ok lo anoto";
        resLista.lista = lista;
        return resLista;
      }
    }

    if (body.substring(0, 2).toLowerCase() == "&-" && lista) {
      console.log("ssss", yaesta);
      if (!yaesta) {
        resLista.msg = "No encuentro lo que queres eliminar";
        return resLista;
      } else {
        for (var i = 0; i < lista.votos.length; i++)
          if (
            lista.votos[i].nombre == yaesta.nombre &&
            lista.votos[i].voy == "si"
          )
            break;
        if (i < lista.votos.length) lista.votos[i].voy = "no";

        lista.save();
      }
      resLista.msg = `Listo, acabo de borrar ${nombre}`;
      return resLista;
    }

    if (body.substring(0, 9).toLowerCase() == "&finlista" && lista) {
      var msgfin = `Lista ` + lista.nombreLista + ` finalizada` + `\n`;
      var z = 0;
      for (var i = 0; i < lista.votos.length; i++) {
        if (lista.votos[i].voy == "si") {
          z++;
          arroba = lista.votos[i].authorv.search("@");
          aut = lista.votos[i].authorv.substring(arroba - 4, arroba);
          msgfin =
            msgfin +
            ` ` +
            z +
            `-` +
            lista.votos[i].nombre +
            "(" +
            aut +
            ")" +
            `\n`;
        }
      }
      lista.estado = "Finalizada";
      lista.save();
      resLista.msg = msgfin;
      resLista.accion = "fin";
      return resLista;
    }
    if (body.substring(0, 9).toLowerCase() == "&verlista" && lista) {
      var msgfin = `Por ahora en ` + lista.nombreLista + `\n`;
      var z = 0;
      for (var i = 0; i < lista.votos.length; i++) {
        if (lista.votos[i].voy == "si") {
          z++;
          arroba = lista.votos[i].authorv.search("@");
          aut = lista.votos[i].authorv.substring(arroba - 4, arroba);
          msgfin =
            msgfin +
            ` ` +
            z +
            `-` +
            lista.votos[i].nombre +
            "(" +
            aut +
            ")" +
            `\n`;
        }
      }
      resLista.msg = msgfin;
      resLista.accion = "ver";
      return resLista;
    }
  } else {
    resLista.msg = "No hay lista activa";
    return resLista;
  }
  return resLista;
};
