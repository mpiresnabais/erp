require("../models/Modelos");
const mongoose = require("mongoose");
const Users = mongoose.model("Users");

module.exports.validaautorizacion = async (req, res, next) => {
  const { nroWhatsapp, user, keyGen } = req.body;

  const wuser = await Users.findOne({ user: user });

  if (!wuser)
    return res
      .status(403)
      .json({ message: "usuario Inexistente o sin permisos" });
  else {
    const resto = nroWhatsapp % wuser.idKey;
    console.log("SEEEECUUURIITTYYY", resto, user, keyGen);
    if (keyGen !== resto)
      return res.status(403).json({ message: "keyGen invalida" });
    else next();
  }
};
