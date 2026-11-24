const admin = require('firebase-admin');
const express = require('express');
const path = require('path');

/**
 * FCM Test Server
 * This server uses the Firebase Admin SDK to send push notifications.
 * It provides a simple HTTP endpoint that can be triggered via CURL.
 */

const app = express();
app.use(express.json());

// Path to your service account key file
const serviceAccountPath = path.join(__dirname, '../../mobile-app-base-d29df-firebase-adminsdk-fbsvc-93001cd328.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const PORT = 8787;

app.post('/send', async (req, res) => {
  const { token, data, notification } = req.body;

  if (!token) {
    console.error('[FCM-TEST] Error: No token provided in request');
    return res.status(400).json({ error: 'Device token is required' });
  }

  // FCM message object
  // Note: For "data-only" messages (which Notifee often handles), 
  // we omit the 'notification' block and only use 'data'.
  const message = {
    token: token,
    data: data || {},
  };

  // If you want to include a standard system notification block:
  if (notification) {
    message.notification = notification;
  }

  console.log('[FCM-TEST] Attempting to send message to token:', token);
  console.log('[FCM-TEST] Payload:', JSON.stringify(message.data, null, 2));

  try {
    const response = await admin.messaging().send(message);
    console.log('[FCM-TEST] Successfully sent message:', response);
    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error('[FCM-TEST] Error sending message:', error.code, error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n[FCM-TEST] ==========================================`);
  console.log(`[FCM-TEST] Initialized with project: ${serviceAccount.project_id}`);
  console.log(`[FCM-TEST] Server listening on http://localhost:${PORT}`);
  console.log(`[FCM-TEST] ==========================================\n`);
  
  console.log(`To test a notification, use the following CURL command:\n`);
  console.log(`curl -X POST http://localhost:${PORT}/send \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{`);
  console.log(`    "token": "<DEVICE_FCM_TOKEN>",`);
  console.log(`    "data": {`);
  console.log(`      "title": "Noukha Dev",`);
  console.log(`      "description": "Testing Notifee push notifications",`);
  console.log(`      "notificationType": "profile",`);
  console.log(`      "payload": "{\\"userId\\":\\"328271\\"}"`);
  console.log(`    }`);
  console.log(`  }'\n`);
});
