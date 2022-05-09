const express = require("express");
const path = require("path");
/*const morgan = require("morgan");*/
const sendMsgRoutes = require("./src/routes/sendMsgRoutes");

const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      description: "API Envio de Msg de Wapp para ERP\n",
      version: "1.0.1",
      title: "erpMsg",
      termsOfService: "http://swagger.io/terms/",
      contact: {
        email: "marcelo.pires@gestionit.com.ar",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    servers: [
      {
        description: "Solo para local",
        url: "http://localhost:3011",
      },
      {
        url: "https://xxx.xx.xx",
      },
    ],
    tags: [
      {
        name: "API Envio de Msg de Wapp para ERP\n",
        description: " ",
        externalDocs: {
          description: "Find out more",
          url: " ",
        },
      },
    ],
  },
  apis: [`${path.join(__dirname, "./src/routes/sendMsgRoutes.js")}`],
};

app.use(express.json());
app.use(express.static(path.join(__dirname + "public")));
app.use(sendMsgRoutes);
app.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);
module.exports = { app };
