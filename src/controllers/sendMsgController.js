require("../models/Modelos");
const mongoose = require("mongoose");
const Llamadas = mongoose.model("Llamadas");
const enviarMsg = require("../whatsappManager");

const sendMsg = async (req, res) => {
  const { nroWhatsapp, msg, user, idKey } = req.body;
  nroSend = nroWhatsapp + "@c.us";
  console.log(nroWhatsapp, msg);
  try {
    const llamadas = new Llamadas({
      nroWhatsapp,
      msg,
    });

    await llamadas.save();
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }

  if (nroSend.length > 9) {
    console.log(nroSend, msg);
    enviarMsg.enviarMsg(nroSend, msg);
    let responseMessage = `Se ha enviado el msg, si no esta comentado el codigo `;

    res.send(responseMessage);
  }
};

/*}  else res.status(422).send({ error: valida });*/

module.exports = { sendMsg };
