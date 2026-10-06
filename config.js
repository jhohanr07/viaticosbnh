// Entrega al navegador la API key de Google Maps (restringida por referrer).
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({ mapsApiKey: process.env.MAPS_BROWSER_KEY || '' });
};
