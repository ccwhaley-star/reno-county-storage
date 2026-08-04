/* ============================================================
   Reno County Storage — Google Ads landing-page promo system
   ------------------------------------------------------------
   The PROMOS object below is the ONLY thing to edit when offers
   change. Both landing pages (/hutchinson and /south-hutchinson)
   read from it — including each page's cross-sell callout to the
   sister location — so offer text can never drift out of sync.

   Per location:
     offerText      — headline offer, e.g. "75% Off First 2 Months"
     offerPhrase    — lowercase phrase used in the sister page's
                      cross-sell, e.g. "75% off your first 2 months"
     promoCode      — code shown in the banner and promo badges
     expires        — "YYYY-MM-DD". After this date the banner and
                      all promo badges hide automatically.
     discountPct    — 0.5 = 50% off
     discountMonths — how many months the discount applies to
     crossSellPitch — availability pitch shown on the SISTER page's
                      ineligible cards, pointing to this location
     sizes[]        — one entry per pricing card:
                        size, label, sqft, price (number, monthly;
                        null renders as "$TBD"), img, desc, tags[],
                        eligible
       eligible: true  -> promo badge + discounted price
       eligible: false -> regular price, "High demand — join the
                          waitlist" label + cross-sell module
   ============================================================ */

var PROMOS = {
  hutchinson: {
    key: "hutchinson",
    locationName: "Hutchinson",
    page: "/hutchinson",
    addressLine: "2511 E 17th Ave, Hutchinson, KS 67501",
    rentUrl: "https://renocountystorage-hutchinson.storageunitsoftware.com/pages/Rent",
    offerText: "50% Off Your First Month",
    offerPhrase: "50% off your first month",
    promoCode: "HALF17",
    expires: "2026-09-30",
    discountPct: 0.5,
    discountMonths: 1,
    crossSellPitch: "Need this size today? Our Hutchinson location at 2511 E 17th Ave has availability",
    sizes: [
      { size: "5x10",  label: "Large Closet",         sqft: 50,  price: 65,  img: "img/5x10-storage-unit-what-fits.webp",  desc: "Bed frame, couch, and washing machine with room to spare. 5-foot opening for easy access.", tags: ["Available"],                 eligible: true },
      { size: "8x10",  label: "Large Walk-in Closet", sqft: 80,  price: 85,  img: "img/8x10-storage-unit-what-fits.webp",  desc: "Drive-up access with space for bookshelves, bedside tables, and coffee tables.",            tags: ["Only 2 Left"],               eligible: true },
      { size: "10x10", label: "Average Bedroom",      sqft: 100, price: 95,  img: "img/10x10-storage-unit-what-fits.webp", desc: "Space for larger cabinets and several electronic appliances. Secure gated access.",         tags: ["Only 3 Left"],               eligible: true },
      { size: "10x15", label: "Large Bedroom",        sqft: 150, price: 105, img: "img/10x15-storage-unit-what-fits.webp", desc: "Fits a one-bedroom house: dining table, small couch, cabinets, and large appliances.",       tags: ["Available"],                 eligible: true },
      { size: "10x20", label: "Single Car Garage",    sqft: 200, price: 125, img: "img/10x20-storage-unit-what-fits.webp", desc: "Large appliances, furniture, and multiple mattresses — or a small car.",                    tags: ["Vehicle OK", "Available"],   eligible: true },
      { size: "10x25", label: "Large One Car Garage", sqft: 250, price: 145, img: "img/10x25-storage-unit-what-fits.webp", desc: "Several large pieces of furniture, appliances, motorcycles, and ATVs.",                     tags: ["Vehicle OK", "Only 1 Left"], eligible: true },
      { size: "10x30", label: "Full House",           sqft: 300, price: 155, img: "img/10x30-storage-unit-what-fits.webp", desc: "Stores a boat or the contents of a full house.",                                            tags: ["Vehicle OK", "Only 1 Left"], eligible: true }
    ]
  },

  southHutchinson: {
    key: "southHutchinson",
    locationName: "South Hutchinson",
    page: "/south-hutchinson",
    addressLine: "712 N Walnut St, South Hutchinson, KS 67505",
    rentUrl: "https://renocountystorage-southhutch.storageunitsoftware.com/pages/Rent",
    offerText: "75% Off First 2 Months",
    offerPhrase: "75% off your first 2 months",
    promoCode: "SH75",
    expires: "2026-09-30",
    discountPct: 0.75,
    discountMonths: 2,
    crossSellPitch: "This size is in high demand. Our South Hutchinson location may have availability",
    sizes: [
      { size: "5x10",  label: "Large Closet",      sqft: 50,  price: 55,  img: "img/5x10-storage-unit-what-fits.webp",  desc: "Bed frame, couch, and washing machine with room to spare.",      tags: [],                          eligible: false },
      { size: "10x10", label: "Average Bedroom",   sqft: 100, price: 65,  img: "img/10x10-storage-unit-what-fits.webp", desc: "Larger cabinets and several appliances. Secure gate access.",    tags: ["Available"],               eligible: true },
      { size: "10x15", label: "Large Bedroom",     sqft: 150, price: 75,  img: "img/10x15-storage-unit-what-fits.webp", desc: "Fits a one-bedroom house: table, couch, cabinets, appliances.",  tags: ["Available"],               eligible: true },
      { size: "10x20", label: "Single Car Garage", sqft: 200, price: 105, img: "img/10x20-storage-unit-what-fits.webp", desc: "Large appliances, furniture, mattresses, or a small vehicle.",   tags: ["Vehicle OK", "Available"], eligible: true }
    ]
  }
};

var PROMO_FINE_PRINT = "Offer valid at this location only. Cannot be combined with other offers, including military discount. Deposits and reservations at regular rates. New rentals only.";

/* ---------- helpers ---------- */

function promoIsActive(cfg, now) {
  // Promo runs through the end of the expiration day, local time.
  var end = new Date(cfg.expires + "T23:59:59");
  return (now || new Date()) <= end;
}

function promoFormatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function promoMoney(n) {
  var s = n.toFixed(2).replace(/\.00$/, "");
  return "$" + s;
}

function promoDiscounted(price, pct) {
  return promoMoney(price * (1 - pct));
}

function promoSizeHtml(size) {
  return size.replace("x", "&times;");
}

/* Portal link with the Google Ads onclick conversion event, matching
   the original hand-written buttons. gtag_report_conversion is defined
   inline in each page's <head>. */
function promoRentLink(url, cssClass, label) {
  return '<a href="' + url + '" onclick="return gtag_report_conversion(\'' + url + '\');" class="' + cssClass + '">' + label + '</a>';
}

/* ---------- renderers ---------- */

function promoRenderBanner(el, cfg, active) {
  if (!el) return;
  if (!active) { el.style.display = "none"; return; }
  el.innerHTML = "🎉 <span>" + cfg.offerText + "</span> &mdash; Use code " +
    '<span class="promo-code-chip">' + cfg.promoCode + "</span> &middot; Offer ends " + promoFormatDate(cfg.expires);
  el.style.display = "";
}

function promoRenderCard(s, cfg, sister, active, sisterActive, sisterUrl) {
  var showPromo = active && s.eligible;
  var priceHtml;
  if (s.price == null) {
    priceHtml = '<div class="unit-price">$TBD</div><span class="unit-price-mo">/mo</span>';
  } else if (showPromo) {
    var moLabel = cfg.discountMonths === 1 ? "/mo first month" : "/mo for " + cfg.discountMonths + " mo";
    priceHtml = '<div class="unit-price-original">' + promoMoney(s.price) + "</div>" +
      '<div class="unit-price">' + promoDiscounted(s.price, cfg.discountPct) + "</div>" +
      '<span class="unit-price-mo">' + moLabel + "</span>";
  } else {
    priceHtml = '<div class="unit-price">' + promoMoney(s.price) + '</div><span class="unit-price-mo">/mo</span>';
  }

  var badgeHtml = showPromo
    ? '<div class="unit-promo">' + cfg.offerText + " &middot; Code " + cfg.promoCode + "</div>"
    : "";

  var tagsHtml;
  if (!s.eligible) {
    tagsHtml = '<span class="unit-tag unit-tag-urgent">High demand &mdash; join the waitlist</span>';
  } else {
    tagsHtml = s.tags.map(function (t) {
      var cls = t === "Available" ? "unit-tag unit-tag-avail" : (/left|hurry/i.test(t) ? "unit-tag unit-tag-urgent" : "unit-tag");
      return '<span class="' + cls + '">' + t + "</span>";
    }).join("");
  }

  // Cross-sell to the sister location on ineligible cards. The offer
  // clause comes from the sister's own config so it can't drift.
  var crossSellHtml = "";
  if (!s.eligible) {
    var pitch = sister.crossSellPitch + (sisterActive ? " &mdash; " + sister.offerPhrase + "." : ".");
    crossSellHtml = '<div class="unit-crosssell"><a href="' + sisterUrl + '">' + pitch + " &rarr;</a></div>";
  }

  var cta = s.eligible
    ? promoRentLink(cfg.rentUrl, "unit-rent", showPromo ? "Claim Deal" : "Rent This Size")
    : promoRentLink(cfg.rentUrl, "unit-waitlist", "Join the Waitlist");

  return '<div class="unit-card">' +
    '<div class="unit-card-top">' +
      "<div>" +
        '<div class="unit-size">' + promoSizeHtml(s.size) + "</div>" +
        '<div class="unit-label">' + s.label + "</div>" +
        '<div class="unit-sqft">' + s.sqft + " sq ft</div>" +
      "</div>" +
      "<div>" + priceHtml + "</div>" +
    "</div>" +
    '<div class="unit-card-body">' +
      '<img src="' + s.img + '" alt="' + s.size + ' storage unit" class="unit-card-img" loading="lazy" width="100">' +
      badgeHtml +
      '<p class="unit-desc">' + s.desc + "</p>" +
      '<div class="unit-tags">' + tagsHtml + "</div>" +
      crossSellHtml +
      cta +
    "</div>" +
  "</div>";
}

function promoRenderQuote(cfg, active) {
  var select = document.getElementById("unit-size");
  if (!select) return;

  var priceRegularEl = document.getElementById("price-regular");
  var priceDisplayEl = document.getElementById("price-display");
  var priceMoEl = document.querySelector(".form-price-mo");

  var defaultIndex = 0;
  select.innerHTML = cfg.sizes.map(function (s, i) {
    if (active && s.eligible && defaultIndex === 0 && !cfg.sizes[defaultIndex].eligible) defaultIndex = i;
    return '<option value="' + i + '">' + s.size + " &mdash; " + s.label + " (" + s.sqft + " sq ft)</option>";
  }).join("");

  function update() {
    var s = cfg.sizes[parseInt(select.value, 10)];
    var showPromo = active && s.eligible && s.price != null;
    if (s.price == null) {
      priceRegularEl.style.display = "none";
      priceDisplayEl.style.color = "var(--orange)";
      priceDisplayEl.textContent = "$TBD";
      priceMoEl.textContent = "per month";
    } else if (showPromo) {
      priceRegularEl.style.display = "";
      priceRegularEl.textContent = promoMoney(s.price) + "/mo";
      priceDisplayEl.style.color = "var(--green)";
      priceDisplayEl.textContent = promoDiscounted(s.price, cfg.discountPct) + "/mo";
      var months = cfg.discountMonths === 1 ? "first month" : "first " + cfg.discountMonths + " months";
      priceMoEl.innerHTML = "for your " + months + " &bull; then " + promoMoney(s.price) + "/mo";
    } else {
      priceRegularEl.style.display = "none";
      priceDisplayEl.style.color = "var(--orange)";
      priceDisplayEl.textContent = promoMoney(s.price) + "/mo";
      priceMoEl.innerHTML = !s.eligible
        ? "per month &bull; high demand &mdash; join the waitlist"
        : "per month";
    }
  }

  select.value = String(defaultIndex);
  select.addEventListener("change", update);
  update();
}

/* ---------- page init ---------- */

function initPromoPage(cfg, sister, opts) {
  opts = opts || {};
  var now = opts.now ? new Date(opts.now) : new Date();
  var active = promoIsActive(cfg, now);
  var sisterActive = promoIsActive(sister, now);
  var sisterUrl = opts.sisterUrl || sister.page;

  // 1. Top banner (auto-hides after cfg.expires)
  promoRenderBanner(document.getElementById("promo-banner"), cfg, active);

  // Hero badge
  var heroBadge = document.getElementById("promo-hero-badge");
  if (heroBadge) {
    if (active) {
      heroBadge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Limited Time &mdash; ' + cfg.offerText;
      heroBadge.style.display = "";
    } else {
      heroBadge.style.display = "none";
    }
  }

  // Hero subtitle: promo sentence + page's own base copy (data-base)
  var heroSub = document.getElementById("promo-hero-sub");
  if (heroSub) {
    var base = heroSub.getAttribute("data-base") || "";
    heroSub.textContent = active
      ? "Get " + cfg.offerPhrase + " on select units with code " + cfg.promoCode + ". " + base
      : base;
  }

  // Quick-quote card headline + sub
  var formTitle = document.getElementById("promo-form-title");
  if (formTitle) formTitle.textContent = active ? "Get " + cfg.offerText : "Check Pricing & Availability";
  var formSub = document.getElementById("promo-form-sub");
  if (formSub) {
    formSub.textContent = active
      ? "Select a size to see pricing. Use code " + cfg.promoCode + " — offer ends " + promoFormatDate(cfg.expires) + "."
      : "Select a size to see current pricing.";
  }

  // 2. Pricing cards render from cfg.sizes
  var grid = document.getElementById("units-grid");
  if (grid) {
    grid.innerHTML = cfg.sizes.map(function (s) {
      return promoRenderCard(s, cfg, sister, active, sisterActive, sisterUrl);
    }).join("");
  }

  // 3. Fine print (shown only while the promo is active)
  var fine = document.getElementById("promo-fineprint");
  if (fine) {
    if (active) { fine.textContent = PROMO_FINE_PRINT; fine.style.display = ""; }
    else fine.style.display = "none";
  }

  // Bottom CTA heading
  var ctaHeading = document.getElementById("promo-cta-heading");
  if (ctaHeading) {
    ctaHeading.innerHTML = active
      ? cfg.offerText + " &mdash; Limited Time"
      : "Rent Your Unit in " + cfg.locationName + " Today";
  }

  // Quick-quote widget
  promoRenderQuote(cfg, active);
}
