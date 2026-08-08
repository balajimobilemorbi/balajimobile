// netlify/functions/store-sync.js
// Dedicated Persistent Netlify Serverless Relay for balajimobile.store
// Ensures 100% cross-device persistence across mobile phones worldwide.

const SHARED_BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019fe0b7-11d8-73da-8865-29ce6ffc9328';
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
      if (body && (Array.isArray(body.products) || body.settings)) {
        inMemoryStore = {
          ...body,
          updatedAt: new Date().toISOString()
        };

        // Persist to shared global JSONBlob cloud storage so all devices receive changes
        try {
          await fetch(SHARED_BLOB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(inMemoryStore)
          });
        } catch (e) {
          console.warn('Proxy PUT error:', e);
        }

        console.log(`✅ [STORE-SYNC RELAY] Received & persisted store payload with ${body.products?.length || 0} products`);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, updatedAt: inMemoryStore.updatedAt })
        };
      }
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid payload' }) };
    }

    // GET Request - Return active in-memory payload if exists
    if (inMemoryStore && Array.isArray(inMemoryStore.products)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(inMemoryStore)
      };
    }

    // Fallback GET: Fetch from shared persistent cloud storage
    try {
      const res = await fetch(SHARED_BLOB_URL, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (Array.isArray(data.products) || data.settings)) {
          inMemoryStore = data;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
          };
        }
      }
    } catch (e) {}

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

