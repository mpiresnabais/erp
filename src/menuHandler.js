module.exports.procesarMenu = async (msg) => {
  const { from, to, body } = msg;
  var { author } = msg;
  if (!author) author = from;
  var res = {
    msg: null,
    lista: null,
  };
  if (body.toLowerCase() == "&menu") {
    var msgfin =
      `Hola, soy Botcha, un pequeño asistente  \n` +
      `Por ahora puedo armar listas, tal como listas para el supermercado o listas de gente que asiste a un evento, etc.` +
      `\n` +
      `tambien puedo armar encuestas por si o por no.` +
      `\n` +
      `Para dirigirte a mi simplemente comenza tu msg con "&"` +
      `\n` +
      `&mlista -> menu Listas` +
      `\n` +
      `&mencuesta -> menu Encuestas` +
      `\n` +
      `&= -> hago cuentas` +
      `\n` +
      `&clima -> clima actual y pronostico`;
  }
  if (body.toLowerCase() == "&mlista") {
    var msgfin =
      `Para Listas podes decirme: &lista xxxx -> creo la lista xxxx` +
      `\n` +
      `&+ xxxx -> agrego el elemento o persona` +
      `\n` +
      `&- xxxx -> elimino el elemento o persona` +
      `\n` +
      `&verlista -> muestro como va la lista hasta ese momento` +
      `\n` +
      `&finlista -> termino la lista mostrando como quedó` +
      `\n` +
      `Por ahora solo una lista a la vez`;
  }

  if (body.toLowerCase() == "&mencuesta") {
    var msgfin =
      `Para encuesta: &encuesta XXXX duracion mm-> creo la encuesta que terminará en mm minutos, si no pones duracion termina en un minuto` +
      `\n` +
      `&si -> estas votando por si` +
      `\n` +
      `&no -> estas votando por no` +
      `\n` +
      `&finencuesta -> estas terminando la encuesta en ese momento, antes de que llegue el tiempo en minutos que indicaste.` +
      `\n` +
      `En la Encuesta es solo un voto por participante del grupo`;
  }

  res.msg = msgfin;
  return res;
};
