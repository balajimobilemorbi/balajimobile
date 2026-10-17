/**
 * Serverless Function: Create Razorpay Order
 * Securely uses RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server side.
 */

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = JSON.parse(event.body || '{}');

    if (!amount || isNaN(amount) || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid order amount' })
      };
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live or test keys are configured with secret
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
          receipt: receipt || `bm_rcpt_${Date.now()}`,
          notes: notes || {}
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: data.error?.description || 'Failed to create Razorpay Order' })
        };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    // Test/Demo fallback when secret is not yet set in environment variables
    const demoOrderId = `order_test_${Date.now()}`;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: demoOrderId,
        entity: 'order',
        amount: Math.round(amount),
        amount_paid: 0,
        amount_due: Math.round(amount),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        status: 'created',
        attempts: 0,
        notes: notes || {},
        created_at: Math.floor(Date.now() / 1000),
        isDemo: true
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error creating Razorpay order: ' + error.message })
    };
  }
};
