const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const encuestas = new mongoose.Schema(
  {
    pregunta: {
      type: String,
    },
    grupo: {
      type: String,
    },
    si: {
      type: Number,
    },
    no: {
      type: Number,
    },
    duracion: {
      type: Number,
    },

    diaHoraDesde: {
      type: Number,
    },
    estado: {
      type: String,
    },
    author: {
      type: String,
    },

    votos: [
      {
        usuario: String,
        voto: String,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const listas = new mongoose.Schema(
  {
    nombreLista: {
      type: String,
    },
    grupo: {
      type: String,
    },
    diaHoraDesde: {
      type: Number,
    },
    estado: {
      type: String,
    },
    author: {
      type: String,
    },

    votos: [
      {
        nombre: String,
        authorv: String,
        voy: String,
      },
      { _id: false },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
const log = new mongoose.Schema(
  {
    participant: {
      type: String,
    },
    from: {
      type: String,
    },
    remote: {
      type: String,
    },

    msg: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

mongoose.model("Encuestas", encuestas);
mongoose.model("Listas", listas);
mongoose.model("Log", log);
