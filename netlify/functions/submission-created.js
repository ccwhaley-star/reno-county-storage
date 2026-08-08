// Netlify event-triggered function: runs automatically on every Netlify
// Forms submission (the filename `submission-created` is the trigger).
// Routes landing-page callback leads into Quo so the team gets them
// without anything running locally:
//   1. Instant auto-text to the lead from the Reno County Storage number
//      (creates the conversation thread the team works from).
//   2. Optional alert text to staff numbers (LEAD_ALERT_TO).
//
// Required Netlify env var:  QUO_API_KEY   (Quo workspace API key)
// Optional:                  QUO_FROM_NUMBER (default +16206627336)
//                            LEAD_ALERT_TO   (comma-separated E.164 staff numbers)

const QUO_API = 'https://api.openphone.com/v1'; // Quo (formerly OpenPhone) public API

function toE164(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  if (String(raw).trim().startsWith('+') && digits.length >= 11) return '+' + digits;
  return null;
}

async function sendText(apiKey, from, to, content) {
  const res = await fetch(QUO_API + '/messages', {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], content })
  });
  if (!res.ok) {
    console.error('Quo send failed', res.status, await res.text().catch(() => ''));
  }
  return res.ok;
}

exports.handler = async function (event) {
  let payload;
  try {
    payload = JSON.parse(event.body || '{}').payload;
  } catch (e) {
    return { statusCode: 200, body: 'bad payload' };
  }
  if (!payload || payload.form_name !== 'callback-request') {
    return { statusCode: 200, body: 'ignored' };
  }

  const d = payload.data || {};
  const leadName = (d.name || 'Unknown').trim();
  const leadPhoneRaw = (d.phone || '').trim();
  const leadPhone = toE164(leadPhoneRaw);
  const location = d.location || 'unknown location';
  const size = (d['unit-size'] || '').trim();
  const promo = (d.promo || '').trim();

  const apiKey = process.env.QUO_API_KEY;
  if (!apiKey) {
    // Lead is still stored in Netlify Forms; just no Quo routing yet.
    console.error('QUO_API_KEY not set — callback lead received but not routed to Quo:', leadName, leadPhoneRaw);
    return { statusCode: 200, body: 'no api key' };
  }

  const from = process.env.QUO_FROM_NUMBER || '+16206627336';

  // 1. Auto-text the lead — confirms the request and opens the thread the
  //    team calls back from. Skipped if the number doesn't normalize.
  if (leadPhone) {
    const promoLine = promo && promo !== 'none'
      ? ' Your discount code ' + promo + ' is locked in.'
      : '';
    await sendText(apiKey, from, leadPhone,
      'Got your request, ' + leadName.split(' ')[0] + '! This is Reno County Storage — ' +
      'we\'ll call you shortly about your unit at our ' + location + ' facility.' + promoLine +
      ' You can also reply here anytime.');
  } else {
    console.error('Lead phone did not normalize to E.164:', leadPhoneRaw);
  }

  // 2. Alert texts to staff, if configured.
  const alertTo = (process.env.LEAD_ALERT_TO || '')
    .split(',').map(function (n) { return toE164(n); }).filter(Boolean);
  if (alertTo.length) {
    const alert = 'New callback lead: ' + leadName + ', ' + leadPhoneRaw +
      (size ? ', wants ' + size : '') + ' — ' + location +
      (promo && promo !== 'none' ? ' (code ' + promo + ')' : '') +
      '. Work it from the Reno County Storage inbox.';
    for (const n of alertTo) {
      await sendText(apiKey, from, n, alert);
    }
  }

  return { statusCode: 200, body: 'ok' };
};
