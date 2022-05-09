const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const llamadas = new mongoose.Schema(
  {
    nroWhatsapp: {
      type: String,
    },
    msg: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const logSends = new mongoose.Schema(
  {
    nroWhatsapp: {
      type: String,
    },
    msg: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const users = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    idKey: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
mongoose.model("Llamadas", llamadas);
mongoose.model("LogSends", logSends);
mongoose.model("Users", users);
