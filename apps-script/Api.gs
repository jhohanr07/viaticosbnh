/**
 * ============================================================================
 *  Api.gs  —  NUEVO ARCHIVO para tu proyecto de Apps Script
 *  Convierte el backend en una API JSON que consume el frontend de Vercel.
 *  No necesitas modificar Code.gs: solo agrega este archivo (Archivos > + > Script).
 * ============================================================================
 */

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Solo estos métodos pueden invocarse desde fuera.
function _apiMetodos() {
  return {
    getDatosIniciales: getDatosIniciales,
    calcularVistaPrevia: calcularVistaPrevia,
    enviarSolicitud: enviarSolicitud,
    verificarDisponibilidadVehiculo: verificarDisponibilidadVehiculo
  };
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secreto = PropertiesService.getScriptProperties().getProperty('API_SECRET');
    if (!secreto || body.secret !== secreto) {
      return _json({ ok: false, error: 'No autorizado' });
    }

    const fn = _apiMetodos()[body.metodo];
    if (!fn) return _json({ ok: false, error: 'Método no permitido: ' + body.metodo });

    const data = fn.apply(null, body.args || []);
    return _json({ ok: true, data: data });
  } catch (err) {
    return _json({ ok: false, error: err.message });
  }
}

/**
 * EJECUTAR UNA SOLA VEZ desde el editor: genera el secreto de la API, lo guarda
 * en las Propiedades del script y lo muestra en el Registro de ejecución.
 * Copie ese valor a la variable GAS_SECRET de Vercel.
 */
function generarApiSecret() {
  const secreto = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('API_SECRET', secreto);
  Logger.log('API_SECRET generado (cópielo a GAS_SECRET en Vercel): ' + secreto);
}
