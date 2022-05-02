const request = require("request-promise");
module.exports.procesarUtil = async (msg) => {
  const { from, to, body } = msg;
  var { author } = msg;
  if (!author) author = from;
  var res = {
    msg: null,
    lista: null,
  };
  var msgfin = "No tengo esa ciudad";
  if (body.substring(0, 6).toLowerCase().includes("&clima")) {
    ciudadBuscada = body.substring(7, 15).toLowerCase();
    if (!ciudadBuscada) ciudadBuscada = "capital federal";
    await request(
      "https://ws.smn.gob.ar/map_items/weather",
      (err, response, body) => {
        let x = 0;
        if (!err) {
          const ciudades = JSON.parse(body);
          for (var i = 0; i < ciudades.length; i++) {
            //Para obtener el objeto de tu lista
            var ciudad = ciudades[i];
            //Mostramos el objeto en su versión String
            if (ciudad.name) {
              ciudad.name = removeAccents(ciudad.name);
              if (ciudad.name.toLowerCase().includes(ciudadBuscada)) {
                if (x !== 1) {
                  x = 1;
                  msgfin = "Actual-------";
                }
                msgfin =
                  msgfin +
                  `\n` +
                  ciudad.name +
                  `\n` +
                  `Temp: ` +
                  ciudad.weather.temp +
                  ` ` +
                  ciudad.weather.description;
                console.log(JSON.stringify(ciudad));
                //Muestras el valor de la propiedad name para el objeto viaje, del objeto hotel.
                console.log(msgfin);
              }
            }
          }
        }
      }
    );

    await request(
      "https://ws.smn.gob.ar/map_items/forecast/1",
      (err, response, body) => {
        if (!err) {
          const ciudades = JSON.parse(body);
          msgfin = msgfin + `\n Pronostico-------`;

          for (var i = 0; i < ciudades.length; i++) {
            //Para obtener el objeto de tu lista
            var ciudad = ciudades[i];
            if (ciudad.name) {
              ciudad.name = removeAccents(ciudad.name);
              if (ciudad.name.toLowerCase().includes(ciudadBuscada)) {
                msgfin =
                  msgfin +
                  `\n` +
                  ciudad.name +
                  `\n` +
                  `Mañana por la mañana:` +
                  ciudad.weather.morning_temp +
                  ` Grados.` +
                  ciudad.weather.morning_desc +
                  `\n` +
                  `Mañana por la tarde:` +
                  ciudad.weather.afternoon_temp +
                  ` Grados.` +
                  ciudad.weather.afternoon_desc +
                  ` `;
              }
            }
          }
        }
      }
    );
  }
  if (body.substring(0, 2) == "&=") {
    try {
      msgfin = eval(body.substring(2, 90)).toString();
      console.log(msgfin);
    } catch {
      msgfin = "Por favor revisá a formula";
    }
  }
  res.msg = msgfin;
  return res;
};
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
