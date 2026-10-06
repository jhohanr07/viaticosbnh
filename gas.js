// Proxy serverless: el navegador llama a /api/gas y esta función reenvía la
// petición a Apps Script, añadiendo el secreto (que nunca llega al navegador).
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }
  if (!process.env.GAS_URL || !process.env.GAS_SECRET) {
    return res.status(500).json({ ok: false, error: 'Faltan las variables GAS_URL / GAS_SECRET en Vercel.' });
  }

  try {
    const body = req.body || {};
    const respuesta = await fetch(process.env.GAS_URL, {
      method: 'POST',
      // text/plain evita el preflight CORS que Apps Script no soporta
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: process.env.GAS_SECRET,
        metodo: body.metodo,
        args: body.args || []
      }),
      redirect: 'follow'
    });

    const texto = await respuesta.text();
    try {
      JSON.parse(texto);
    } catch (e) {
      return res.status(502).json({
        ok: false,
        error: 'Apps Script no devolvió JSON. Verifique que la implementación sea "Cualquier persona" y que sea la última versión.'
      });
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(texto);
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Error al contactar el backend: ' + err.message });
  }
};
