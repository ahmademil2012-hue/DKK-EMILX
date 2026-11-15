const webpush = require('web-push');

// VAPID KEYS KAMU SUDAH DIPASANG DI SINI
const publicVapidKey = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEldsdpeRsrSBJynghuCmxGXt2ed9m3EfvFcPhVtNqO7goOv0k59QIALvrP8XC78OevSQGg_Ahb9H_p46iClAcgg';
const privateVapidKey = 'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgs1NC3aELVZZIV_2mmUF8BoCrim6MzhcEnW4cciKx5NmhRANCAASV2x2l5GytIEnKeCG4KbEZe3Z532bcR-8Vw-FW02o7uCg6_STn1AgAu-s_xcLvw569JAaD8CFv0f-njqIKUByC';

webpush.setVapidDetails('mailto:admin@dkkemilx.com', publicVapidKey, privateVapidKey);

let subscriptions = [];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const action = req.query.action;

    if (action === 'subscribe') {
      subscriptions.push(req.body);
      return res.status(201).json({ message: 'Subscribed!' });
    }

    if (action === 'send') {
      const { title, body } = req.body;
      const payload = JSON.stringify({ title, body });

      subscriptions.forEach(sub => {
        webpush.sendNotification(sub, payload).catch(err => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
          }
        });
      });
      return res.status(200).json({ message: 'Terkirim!' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
