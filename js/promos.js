/* ============================================================
   Shared promo system for the Google Ads landing pages
   (/hutchinson and /south-hutchinson).

   PROMOS below is the ONLY thing you edit to update offers:
     - offerText / promoCode / expires   → the offer itself
     - discountRate / discountMonths     → used to compute sale prices
     - sizes[].eligible                  → true  = promo badge + Claim Deal
                                           false = regular price + waitlist
                                                   label + cross-sell to the
                                                   sister location
   When today's date is past `expires`, the banner, badges, and
   discounted prices disappear automatically and the page falls
   back to regular pricing.
   ============================================================ */

const PROMOS = {

  hutchinson: {
    key: 'hutchinson',
    page: '/hutchinson',
    locationName: 'Hutchinson',
    addressShort: '2511 E 17th Ave',
    portalUrl: 'https://renocountystorage-hutchinson.storageunitsoftware.com/pages/Rent',
    offerText: '50% Off Your First Month',
    promoCode: 'HALF17',
    expires: '2026-09-30',
    discountRate: 0.5,
    discountMonths: 1,
    /* Intro used on THIS page's ineligible cards, pointing at the sister
       location. {location} {address} {offer} are filled from the sister's
       config so the quoted offer can never drift out of sync. */
    crossSellTemplate: 'This size is in high demand. Our {location} location may have availability &mdash; <strong>{offer}</strong>.',
    sizes: [
      { size: '5x10',  label: 'Large Closet',         sqft: 50,  price: '$65/mo',  eligible: true, desc: 'Bed frame, couch, and washing machine with room to spare. Easy 5-foot opening.', tags: [{ text: 'Insulated', cls: '' }, { text: '24/7 Camera', cls: '' }, { text: 'Available', cls: 'unit-tag-avail' }] },
      { size: '8x10',  label: 'Large Walk-in Closet', sqft: 80,  price: '$85/mo',  eligible: true, desc: 'Space for bookshelves, bedside tables, and coffee tables. Drive-up access.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Insulated', cls: '' }, { text: 'Only 2 Left', cls: 'unit-tag-urgent' }] },
      { size: '10x10', label: 'Average Bedroom',      sqft: 100, price: '$95/mo',  eligible: true, desc: 'Larger cabinets and several appliances. Fenced lot with secure gate.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Secure Gate', cls: '' }, { text: 'Only 3 Left', cls: 'unit-tag-urgent' }] },
      { size: '10x15', label: 'Large Bedroom',        sqft: 150, price: '$105/mo', eligible: true, desc: 'Fits a one-bedroom house: dining table, couch, cabinets, large appliances.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Insulated', cls: '' }, { text: 'Available', cls: 'unit-tag-avail' }] },
      { size: '10x20', label: 'Single Car Garage',    sqft: 200, price: '$125/mo', eligible: true, desc: 'Large appliances, furniture, multiple mattresses, or a small car.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Vehicle OK', cls: '' }, { text: 'Available', cls: 'unit-tag-avail' }] },
      { size: '10x25', label: 'Large One Car Garage', sqft: 250, price: '$145/mo', eligible: true, desc: 'Several large pieces of furniture, appliances, motorcycles, and ATVs.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'ATV / Cycle', cls: '' }, { text: 'Only 1 Left', cls: 'unit-tag-urgent' }] },
      { size: '10x30', label: 'Full House',           sqft: 300, price: '$155/mo', eligible: true, desc: 'A boat or the contents of a full house with drive-up access.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Boat OK', cls: '' }, { text: 'Only 1 Left', cls: 'unit-tag-urgent' }] }
    ]
  },

  southHutchinson: {
    key: 'southHutchinson',
    page: '/south-hutchinson',
    locationName: 'South Hutchinson',
    addressShort: '712 N Walnut St',
    portalUrl: 'https://renocountystorage-southhutch.storageunitsoftware.com/pages/Rent',
    offerText: '50% Off Your First 2 Months',
    promoCode: 'SH50',
    expires: '2026-09-30',
    discountRate: 0.5,
    discountMonths: 2,
    crossSellTemplate: 'Need this size today? Our {location} location at {address} has availability &mdash; <strong>{offer}</strong>.',
    sizes: [
      { size: '5x10',  label: 'Large Closet',         sqft: 50,  price: '$55/mo',  eligible: true,  desc: 'Bed frame, couch, and washing machine with room to spare.', tags: [{ text: 'Insulated', cls: '' }, { text: '24/7 Camera', cls: '' }, { text: 'Only 3 Left', cls: 'unit-tag-urgent' }] },
      { size: '10x10', label: 'Average Bedroom',      sqft: 100, price: '$65/mo',  eligible: true,  desc: 'Larger cabinets and several appliances. Secure gate access.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Secure Gate', cls: '' }, { text: 'Available', cls: 'unit-tag-avail' }] },
      { size: '10x15', label: 'Large Bedroom',        sqft: 150, price: '$75/mo',  eligible: true,  desc: 'Fits a one-bedroom house: table, couch, cabinets, appliances.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Insulated', cls: '' }, { text: 'Available', cls: 'unit-tag-avail' }] },
      { size: '10x20', label: 'Single Car Garage',    sqft: 200, price: '$105/mo', eligible: true,  desc: 'Large appliances, furniture, mattresses, or a small vehicle.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Vehicle OK', cls: '' }, { text: 'Available', cls: 'unit-tag-avail' }] },
      { size: '15x30', label: 'Large House',          sqft: 450, price: '$190/mo', eligible: false, desc: 'RV, boat, or full large-house contents with drive-up access.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'RV / Boat', cls: '' }, { text: 'Waitlist', cls: 'unit-tag-urgent' }] },
      { size: '15x40', label: 'Small Warehouse',      sqft: 600, price: '$250/mo', eligible: false, desc: 'Contractor storage: equipment, inventory, or a full workshop.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Commercial', cls: '' }, { text: 'Only 1 Left', cls: 'unit-tag-urgent' }] },
      { size: '20x40', label: 'Industrial Warehouse', sqft: 800, price: '$350/mo', eligible: false, desc: 'Large-scale commercial and industrial storage, fully monitored.', tags: [{ text: 'Drive-Up', cls: '' }, { text: 'Industrial', cls: '' }, { text: 'Waitlist', cls: 'unit-tag-urgent' }] }
    ]
  }
};

const PROMO_FINE_PRINT = 'Offer valid at this location only. Cannot be combined with other offers, including military discount. Deposits and reservations at regular rates. New rentals only.';

/* Google Ads conversion label for lead-form submissions (separate from the
   portal-click label). Leave empty until the "phone lead" conversion action
   is created in Google Ads, then paste its label here. */
const PROMO_LEAD_CONVERSION_LABEL = '';

/* ── helpers ─────────────────────────────────────────────── */

function promoIsActive(promo) {
  var p = promo.expires.split('-');
  var end = new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59);
  return new Date() <= end;
}

function promoPriceNumber(price) {
  return parseFloat(String(price).replace(/[^0-9.]/g, ''));
}

function promoMoney(n) {
  return '$' + n.toFixed(2).replace(/\.00$/, '');
}

function promoExpiresText(promo) {
  var p = promo.expires.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2])
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function promoExpiresShort(promo) {
  var p = promo.expires.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2])
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function promoDurationText(promo) {
  return promo.discountMonths === 1
    ? 'for your first month'
    : 'for your first ' + promo.discountMonths + ' months';
}

function promoMinPrice(promo) {
  return Math.min.apply(null, promo.sizes.map(function (s) { return promoPriceNumber(s.price); }));
}

function promoCrossSellHtml(promo, sister) {
  var offerClause = promoIsActive(sister) ? sister.offerText : '';
  var text = promo.crossSellTemplate
    .replace('{location}', sister.locationName)
    .replace('{address}', sister.addressShort)
    .replace('{offer}', offerClause);
  if (!offerClause) {
    // Sister promo expired: drop the dangling offer clause.
    text = text.replace(/ &mdash; <strong><\/strong>/, '');
  }
  return '<div class="cross-sell">' + text +
    ' <a href="' + sister.page + '">See ' + sister.locationName + ' deals &rarr;</a></div>';
}

/* ── page renderer ───────────────────────────────────────── */

function initPromoPage(pageKey, sisterKey) {
  var promo = PROMOS[pageKey];
  var sister = PROMOS[sisterKey];
  var active = promoIsActive(promo);

  function el(id) { return document.getElementById(id); }

  // 1. Top promo banner — hidden entirely once expired.
  if (el('promo-banner')) {
    if (active) {
      el('promo-banner').innerHTML =
        '<span>&#127881; ' + promo.offerText + '</span> &mdash; Use code <strong>' +
        promo.promoCode + '</strong> &bull; <span class="bar-long">Offer ends ' +
        promoExpiresText(promo) + '</span><span class="bar-short">Ends ' +
        promoExpiresShort(promo) + '</span>';
    } else {
      el('promo-banner').style.display = 'none';
    }
  }

  // Hero badge, headline price, and subheadline
  if (el('promo-hero-badge')) {
    if (active) {
      el('promo-hero-badge').innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Limited Time &mdash; ' + promo.offerText;
    } else {
      el('promo-hero-badge').innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Move In Today';
    }
  }
  if (el('promo-from-price')) {
    if (active) {
      // Sale floor: cheapest promo-eligible size at the discounted rate.
      var eligiblePrices = promo.sizes.filter(function (s) { return s.eligible; })
        .map(function (s) { return promoPriceNumber(s.price); });
      if (eligiblePrices.length) {
        var floor = Math.min.apply(null, eligiblePrices) * (1 - promo.discountRate);
        el('promo-from-price').textContent = 'from ' + promoMoney(floor) + '/mo ' +
          (promo.discountMonths === 1 ? 'your first month' : 'your first ' + promo.discountMonths + ' months');
      } else {
        el('promo-from-price').textContent = 'from $' + promoMinPrice(promo) + '/mo';
      }
    } else {
      el('promo-from-price').textContent = 'from $' + promoMinPrice(promo) + '/mo';
    }
  }
  if (el('promo-hero-sub')) {
    el('promo-hero-sub').textContent = active
      ? 'Get ' + promo.offerText.toLowerCase() + ' on select units with code ' + promo.promoCode + '. Drive-up access, free lock included, no hidden fees. Rent online and move in today.'
      : 'Drive-up access, 24/7 security cameras, free lock included. No long-term contracts, no hidden fees. Rent online and move in today.';
  }

  // Quick-quote card
  if (el('promo-form-title')) {
    el('promo-form-title').textContent = active ? 'Get ' + promo.offerText : 'Get Your Unit';
  }
  var select = el('unit-size');
  if (select) {
    select.innerHTML = promo.sizes.map(function (s, i) {
      return '<option value="' + i + '">' + s.size.replace('x', '×') + ' — ' +
        s.label + ' (' + s.sqft + ' sq ft)</option>';
    }).join('');

    var updateQuote = function () {
      var s = promo.sizes[+select.value];
      var regular = promoPriceNumber(s.price);
      var regEl = el('price-regular');
      var dispEl = el('price-display');
      var moEl = document.querySelector('.form-price-mo');
      if (active && s.eligible) {
        regEl.style.display = '';
        regEl.textContent = '$' + regular + '/mo';
        dispEl.style.color = 'var(--green)';
        dispEl.textContent = promoMoney(regular * (1 - promo.discountRate)) + '/mo';
        moEl.innerHTML = promoDurationText(promo) + ' &bull; then $' + regular + '/mo &bull; code ' + promo.promoCode;
      } else {
        regEl.style.display = 'none';
        dispEl.style.color = 'var(--orange)';
        dispEl.textContent = '$' + regular + '/mo';
        moEl.innerHTML = (active && !s.eligible)
          ? 'per month &bull; high demand &mdash; join the waitlist'
          : 'per month &bull; no contracts';
      }
    };
    select.addEventListener('change', updateQuote);
    updateQuote();
  }

  // 2. Pricing cards, rendered from the sizes array.
  var grid = el('units-grid');
  if (grid) {
    grid.innerHTML = promo.sizes.map(function (s) {
      var regular = promoPriceNumber(s.price);
      var promoted = active && s.eligible;
      var priceHtml = promoted
        ? '<div class="unit-price-original">$' + regular + '</div><div class="unit-price unit-price-sale">' +
          promoMoney(regular * (1 - promo.discountRate)) + '</div><span class="unit-price-mo">/mo for ' +
          promo.discountMonths + ' mo</span>'
        : '<div class="unit-price">$' + regular + '</div><span class="unit-price-mo">/month</span>';

      var badgeHtml = promoted
        ? '<div class="unit-promo">' + promo.offerText + ' &bull; Code ' + promo.promoCode + '</div>'
        : (active && !s.eligible
          ? '<div class="unit-waitlist-label">High demand &mdash; join the waitlist</div>'
          : '');

      var tagsHtml = s.tags.map(function (t) {
        return '<span class="unit-tag ' + t.cls + '">' + t.text + '</span>';
      }).join('');

      var crossSellHtml = (active && !s.eligible) ? promoCrossSellHtml(promo, sister) : '';

      var ctaHtml = (active && !s.eligible)
        ? '<a href="' + promo.portalUrl + '" onclick="return gtag_report_conversion(\'' + promo.portalUrl + '\');" class="unit-waitlist">Join Waitlist</a>'
        : '<a href="' + promo.portalUrl + '" onclick="return gtag_report_conversion(\'' + promo.portalUrl + '\');" class="unit-rent">' + (promoted ? 'Claim Deal' : 'Rent Now') + '</a>';

      return '<div class="unit-card">' +
        '<div class="unit-card-top">' +
          '<div><div class="unit-size">' + s.size.replace('x', '&times;') + '</div>' +
          '<div class="unit-label">' + s.label + '</div>' +
          '<div class="unit-sqft">' + s.sqft + ' sq ft</div></div>' +
          '<div>' + priceHtml + '</div>' +
        '</div>' +
        '<div class="unit-card-body">' +
          badgeHtml +
          '<p class="unit-desc">' + s.desc + '</p>' +
          '<div class="unit-tags">' + tagsHtml + '</div>' +
          crossSellHtml +
          ctaHtml +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 3. Fine print — shown only while the promo is live.
  if (el('promo-fine-print')) {
    if (active) {
      el('promo-fine-print').textContent = PROMO_FINE_PRINT;
    } else {
      el('promo-fine-print').style.display = 'none';
    }
  }

  // Final CTA banner heading
  if (el('promo-cta-heading')) {
    el('promo-cta-heading').textContent = active
      ? promo.offerText + ' — Limited Time'
      : 'Ready to Reserve Your Unit?';
  }
}

/* ── lead-capture popup ──────────────────────────────────────
   Exit-intent on desktop, 45s dwell fallback everywhere.
   Suppressed once dismissed this session, permanently after a
   submission, and never shown to visitors who already clicked
   through to the rental portal. Submits to Netlify Forms via
   AJAX (form must exist in the static HTML for detection). */

function initLeadPopup(pageKey) {
  var promo = PROMOS[pageKey];
  var modal = document.getElementById('lead-modal');
  if (!modal) return;
  var active = promoIsActive(promo);
  var KEY = 'rcs-lead-popup';

  // Offer copy pulls from the same config as the rest of the page.
  var offerEl = document.getElementById('lead-offer-text');
  var subEl = document.getElementById('lead-offer-sub');
  if (offerEl) offerEl.textContent = active ? promo.offerText : 'Move-In Special';
  if (subEl) {
    subEl.textContent = active
      ? 'with code ' + promo.promoCode + ' — ends ' + promoExpiresText(promo)
      : 'at the ' + promo.locationName + ' location';
  }
  var promoField = document.getElementById('lead-promo-field');
  if (promoField) promoField.value = active ? promo.promoCode : 'none';
  var sizeSelect = document.getElementById('lead-size-select');
  if (sizeSelect) {
    promo.sizes.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.size;
      opt.textContent = s.size.replace('x', '×') + ' — ' + s.price;
      sizeSelect.appendChild(opt);
    });
  }

  var shown = false;
  var suppressed = false;
  try {
    suppressed = localStorage.getItem(KEY + '-done') === '1' ||
      sessionStorage.getItem(KEY + '-dismissed') === '1';
  } catch (e) {}

  // Anyone already heading to the portal doesn't need a popup.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href*="storageunitsoftware"]');
    if (a) suppressed = true;
  }, true);

  function show() {
    if (shown || suppressed) return;
    shown = true;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function hide(remember) {
    modal.hidden = true;
    document.body.style.overflow = '';
    suppressed = true;
    if (remember) {
      try { sessionStorage.setItem(KEY + '-dismissed', '1'); } catch (e) {}
    }
  }

  // Triggers
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0) show();
  });
  setTimeout(show, 45000);

  // Dismissals
  modal.querySelectorAll('[data-lead-dismiss]').forEach(function (elm) {
    elm.addEventListener('click', function () { hide(true); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) hide(true);
  });

  // Submission → Netlify Forms via AJAX, then success state.
  var form = document.getElementById('lead-form');
  var successEl = document.getElementById('lead-success');
  var submitBtn = document.getElementById('lead-submit-btn');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).then(function (res) {
        if (!res.ok) throw new Error('form post failed: ' + res.status);
        form.style.display = 'none';
        if (successEl) successEl.hidden = false;
        try { localStorage.setItem(KEY + '-done', '1'); } catch (e) {}
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { location: promo.locationName });
          if (PROMO_LEAD_CONVERSION_LABEL) {
            gtag('event', 'conversion', { send_to: PROMO_LEAD_CONVERSION_LABEL });
          }
        }
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Claim My Discount →'; }
        var note = document.getElementById('lead-error');
        if (note) note.hidden = false;
      });
    });
  }
}
