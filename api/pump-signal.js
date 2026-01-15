let latestSignal = null;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const event = JSON.parse(body);
          let tokenMint = null;

          if (event?.events?.[0]?.tokenMint) tokenMint = event.events[0].tokenMint;
          else if (event?.parsed?.tokenMint) tokenMint = event.parsed.tokenMint;
          else if (event?.accounts?.[2]) tokenMint = event.accounts[2];

          if (tokenMint) {
            latestSignal = { mint: tokenMint, timestamp: Date.now() };
            console.log("✅ Token détecté:", tokenMint);
            res.status(200).json({ ok: true });
          } else {
            res.status(400).json({ error: "no_mint" });
          }
        } catch (parseErr) {
          res.status(400).json({ error: "invalid_json" });
        }
      });
      return;
    }

    if (req.method === 'GET') {
      res.status(200).json(latestSignal || { message: "no_signal" });
      return;
    }

    res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ error: "internal_error" });
  }
};
