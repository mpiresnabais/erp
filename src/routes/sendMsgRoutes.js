const { validaautorizacion } = require("../middleweares/security");

const express = require("express");
const mongoose = require("mongoose");
var ExpressBrute = require("express-brute");

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

const router = express.Router();
const sendMsgController = require("../controllers/sendMsgController");
/**
 * @swagger
 * components:
 *  schemas:
 *    sendMsg:
 *      type: object
 *      required:
 *        - nroWhatsapp
 *        - msg
 *        - user
 *        - keyGen
 *
 *      properties:
 *        nroWhatsapp:
 *          type: string
 *          description: Nro de wapp, normalmente 13 posiciones comenzando con el codigo de pais y con el 9 para Argentina
 *          example: "5491155701123"
 *        msg:
 *          type: string
 *          description: Msg a enviar
 *          example: "Su saldo es  $ 3.400"
 *        user:
 *          type: string
 *          description: Usuario habilitado para enviar msg
 *          example: "Carlitos"
 *        keyGen:
 *          type: numbre
 *          description: Clave generada segun algoritmo
 *          example: "123"
 *  requestBodies:
 *    sendMsg:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/sendMsg'
 *      description: Envio de msg
 *      required: true
 *  securitySchemes:
 *    petstore_auth:
 *      type: oauth2
 *      flows:
 *        implicit:
 *          authorizationUrl: 'http://petstore.swagger.io/oauth/dialog'
 *          scopes:
 *            'write:pets': modify pets in your account
 *            'read:pets': read your pets
 *    api_key:
 *      type: apiKey
 *      name: api_key
 *      in: header
 */
/**
 * @swagger
 *
 * /sendMsg:
 *   post:
 *     tags:
 *       - sengMsg
 *     summary: Enviar msg - push
 *     operationId: sendMsg
 *     responses:
 *       '405':
 *         description: Invalid input
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: json
 *               example: {"Mesage": "Msg enviado"}
 *     requestBody:
 *       $ref: '#/components/requestBodies/sendMsg'
 */

router.post(
  "/sendMsg",
  bruteforce.prevent,
  validaautorizacion,
  sendMsgController.sendMsg
);

module.exports = router;
