module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    res.status(200).json({ message: "no_signal" });
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log("✅ Webhook reçu");
      res.status(200).json({ ok: true });
    });
    return;
  }

  res.status(405).json({ error: "method_not_allowed" });
};
