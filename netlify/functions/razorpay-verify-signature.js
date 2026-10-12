/**
 * Serverless Function: Verify Razorpay Payment Signature
 * Computes HMAC SHA256 of (order_id + "|" + payment_id) using RAZORPAY_KEY_SECRET.
 * The Secret is NEVER exposed to the frontend!
 */

const crypto = require('crypto');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body || '{}');

    if (!razorpay_order_id || !razorpay_payment_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ verified: false, message: 'Missing order_id or payment_id' })
      };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isMatch = (generatedSignature === razorpay_signature);

      if (isMatch) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verified: true,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            message: 'Signature verified successfully'
          })
        };
      } else {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verified: false,
            message: 'Invalid payment signature'
          })
        };
      }
    }

    // Test/Demo fallback when secret is not configured
    const isTestValid = Boolean(razorpay_payment_id);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verified: isTestValid,
        mode: 'test',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        message: 'Verified in Test/Demo Mode'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: false, error: 'Server signature verification error: ' + error.message })
    };
  }
};
