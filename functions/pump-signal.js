// Netlify Function : reçoit Helius Webhook & stocke le dernier token
let latestSignal = null;

export default async (req, res) => {
  if (req.method === 'POST') {
    // Reçu de Helius
    const event = req.body;
    
    // Extraire le mint (ajustez selon payload réel)
    let tokenMint = null;
    
    // Tentative 1 : format commun Helius
    if (event?.events?.[0]?.tokenMint) {
      tokenMint = event.events[0].tokenMint;
    }
    // Tentative 2 : autre format
    else if (event?.parsed?.tokenMint) {
      tokenMint = event.parsed.tokenMint;
    }

    if (tokenMint) {
      latestSignal = {
        mint: tokenMint,
        timestamp: Date.now(),
        raw: event
      };
      console.log("✅ Token détecté:", tokenMint);
    }

    return res.status(200).json({ ok: true });

  } else if (req.method === 'GET') {
    // Frontend demande le signal
    return res.status(200).json(latestSignal || { message: "no_signal" });
    
  } else {
    return res.status(405).end();
  }
};
