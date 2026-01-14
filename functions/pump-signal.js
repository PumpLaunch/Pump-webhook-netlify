let latestSignal = null;

export default async (request, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    if (request.method === 'POST') {
      const event = await request.json();
      let tokenMint = null;

      // Extraction robuste du mint
      if (event?.events?.[0]?.tokenMint) tokenMint = event.events[0].tokenMint;
      else if (event?.parsed?.tokenMint) tokenMint = event.parsed.tokenMint;
      else if (event?.accounts?.[2]) tokenMint = event.accounts[2];

      if (tokenMint) {
        latestSignal = { mint: tokenMint, timestamp: Date.now() };
        console.log("✅ Token détecté:", tokenMint);
        return new Response(JSON.stringify({ ok: true }), { headers });
      }
      return new Response(JSON.stringify({ error: "no_mint" }), { status: 400, headers });

    } else if (request.method === 'GET') {
      return new Response(JSON.stringify(latestSignal || { message: "no_signal" }), { headers });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers });
};
