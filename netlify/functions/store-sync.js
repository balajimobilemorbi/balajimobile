// netlify/functions/store-sync.js
// Dedicated Netlify Serverless Relay for balajimobile.store
// Eliminates 429 Rate-Limits & CORS errors across all devices worldwide.

let inMemoryStore = null;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      if (body && Array.isArray(body.products) && body.products.length > 0) {
        inMemoryStore = {
          ...body,
          updatedAt: new Date().toISOString()
        };
        console.log(`✅ [STORE-SYNC RELAY] Received new store payload with ${body.products.length} products`);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, updatedAt: inMemoryStore.updatedAt, count: body.products.length })
        };
      }
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid payload' }) };
    }

    // GET Request - Return active in-memory payload if exists
    if (inMemoryStore) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(inMemoryStore)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, empty: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Sync server error', message: err.message })
    };
  }
};
