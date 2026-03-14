// ── READ CARS FROM HTML ──
const cars = Array.from(document.querySelectorAll('#car-data li')).map(li => ({
  brand:        li.dataset.brand,
  model:        li.dataset.model,
  year:         li.dataset.year,
  category:     li.dataset.category,
  fuel:         li.dataset.fuel,
  transmission: li.dataset.transmission,
  seats:        li.dataset.seats,
  price:        li.dataset.price,
  badge:        li.dataset.badge,
  img:          li.dataset.img
}));
 
let filtered = [...cars], idx = 0;
 
function renderSpotlight(c) {
  document.getElementById('splImg').src   = c.img;
  document.getElementById('splImg').alt   = c.brand + ' ' + c.model;
  document.getElementById('splBrand').textContent = c.brand + ' · ' + c.category;
  document.getElementById('splModel').textContent = c.model;
  document.getElementById('splYear').textContent  = c.year + ' Model Year';
  document.getElementById('splPrice').innerHTML   = c.price + '<small>Starting Price</small>';
  document.getElementById('splSpecs').innerHTML   = `
    <div class="spl-spec"><div class="sv">${c.fuel}</div><div class="sk">Fuel Type</div></div>
    <div class="spl-spec"><div class="sv">${c.transmission}</div><div class="sk">Transmission</div></div>
    <div class="spl-spec"><div class="sv">${c.seats}</div><div class="sk">Capacity</div></div>
    <div class="spl-spec"><div class="sv">${c.badge}</div><div class="sk">Status</div></div>`;
  document.getElementById('showCurr').textContent  = idx + 1;
  document.getElementById('showTotal').textContent = filtered.length;
}
 
function renderThumbs() {
  const rail  = document.getElementById('thumbRail');
  rail.innerHTML = '';
  const vis   = Math.min(filtered.length, window.innerWidth < 768 ? 3 : 5);
  const start = Math.max(0, Math.min(idx - Math.floor(vis / 2), filtered.length - vis));
  for (let i = start; i < start + vis && i < filtered.length; i++) {
    const c = filtered[i], ii = i;
    const d = document.createElement('div');
    d.className = 'thumb-card' + (i === idx ? ' active' : '');
    d.innerHTML = `
      <img class="thumb-img" src="${c.img}" alt="${c.model}" loading="lazy">
      <div class="thumb-body">
        <div class="thumb-brand">${c.brand}</div>
        <div class="thumb-model">${c.model} ${c.year}</div>
        <div class="thumb-price">${c.price}</div>
      </div>
      <div class="thumb-bar"></div>`;
    d.onclick = () => { idx = ii; update(); };
    rail.appendChild(d);
  }
}
 
function update() {
  const spl = document.getElementById('spotlight');
  spl.style.opacity = '0'; spl.style.transform = 'translateY(8px)';
  setTimeout(() => {
    renderSpotlight(filtered[idx]);
    renderThumbs();
    spl.style.transition = 'opacity .35s ease, transform .35s ease';
    spl.style.opacity = '1'; spl.style.transform = 'translateY(0)';
  }, 180);
}
 
function filterBrand(brand) {
  filtered = brand === 'All' ? [...cars] : cars.filter(c => c.brand === brand);
  idx = 0;
  document.querySelectorAll('.brand-pill').forEach(p => {
    p.classList.toggle('active', p.textContent.trim() === (brand === 'All' ? 'All Brands' : brand));
  });
  update();
}
 
document.getElementById('showPrev').onclick = () => { if (idx > 0) { idx--; update(); } };
document.getElementById('showNext').onclick = () => { if (idx < filtered.length - 1) { idx++; update(); } };
 
let tsX = 0;
document.getElementById('spotlight').addEventListener('touchstart', e => tsX = e.touches[0].clientX);
document.getElementById('spotlight').addEventListener('touchend',   e => {
  const diff = tsX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { diff > 0 ? document.getElementById('showNext').click() : document.getElementById('showPrev').click(); }
});
 
// ── CALCULATOR ──
document.getElementById('rTerm').oninput = () => document.getElementById('termVal').textContent = document.getElementById('rTerm').value;
document.getElementById('rRate').oninput = () => document.getElementById('rateVal').textContent = parseFloat(document.getElementById('rRate').value).toFixed(1);
function calcLoan() {
  const price = parseFloat(document.getElementById('cPrice').value) || 0;
  const down  = parseFloat(document.getElementById('cDown').value)  || 0;
  const months = parseInt(document.getElementById('rTerm').value);
  const mr = (parseFloat(document.getElementById('rRate').value) / 100) / 12;
  const principal = price - down;
  if (principal <= 0) return;
  const pay   = mr > 0 ? principal * (mr * Math.pow(1+mr,months)) / (Math.pow(1+mr,months)-1) : principal/months;
  const total = pay * months;
  const fmt   = n => '₱' + Math.round(n).toLocaleString('en-PH');
  document.getElementById('rMonthly').innerHTML   = `<span>₱</span>${Math.round(pay).toLocaleString('en-PH')}`;
  document.getElementById('rLoan').textContent    = fmt(principal);
  document.getElementById('rInt').textContent     = fmt(total - principal);
  document.getElementById('rTotal').textContent   = fmt(total);
  document.getElementById('rTerm2').textContent   = months + ' months';
  document.getElementById('rGrid').style.display  = 'grid';
}
 
// ── NAVBAR ──
window.addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60));
 
// ── MOBILE MENU ──
function toggleMob() {
  const m = document.getElementById('mobMenu');
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
  document.getElementById('hIcon').className = m.style.display === 'block' ? 'fas fa-times' : 'fas fa-bars';
}
function closeMob() { document.getElementById('mobMenu').style.display = 'none'; document.getElementById('hIcon').className = 'fas fa-bars'; }
 
// ── CONTACT ──
function submitCF() {
  const n = document.getElementById('cfName').value.trim();
  const e = document.getElementById('cfEmail').value.trim();
  const m = document.getElementById('cfMsg').value.trim();
  const el = document.getElementById('cf-msg');
  if (!n || !e || !m) { el.style.display='block'; el.style.color='#ff5566'; el.textContent='⚠ Please fill in all required fields.'; return; }
  el.style.display='block'; el.style.color='#4ce09a'; el.textContent='✅ Message sent! Alex will respond shortly.';
  ['cfName','cfEmail','cfPhone','cfMsg','cfBrand'].forEach(id => document.getElementById(id).value = '');
}
 
// ── COUNTER ──
const cObs = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  document.querySelectorAll('[data-count]').forEach(el => {
    const t = parseInt(el.dataset.count), step = t/50; let cur = 0;
    const timer = setInterval(() => { cur+=step; if(cur>=t){cur=t;clearInterval(timer);} el.textContent=Math.floor(cur)+(t>100?'+':''); }, 30);
  });
  cObs.disconnect();
}, { threshold: .5 });
const st = document.querySelector('.hero-stats'); if (st) cObs.observe(st);
 
// ── SCROLL REVEAL ──
const rObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';} });
}, { threshold: .1 });
document.querySelectorAll('.tcard, .g-item, .calc-box').forEach(el => {
  el.style.opacity='0'; el.style.transform='translateY(22px)';
  el.style.transition='opacity .55s ease, transform .55s ease';
  rObs.observe(el);
});
 
// ── CHATBOT ──
const bR = {
  suv:       "Great pick! I have SUVs — Toyota Fortuner, Honda CR-V, Ford Everest, Mitsubishi Montero Sport, and Lexus RX. Which brand interests you?",
  sedan:     "For sedans, check out the BMW 3 Series, Mercedes C-Class, or Honda Civic. Want specs on any of these?",
  brand:     "I carry Toyota, Honda, Ford, Mitsubishi, Nissan, BMW, Mercedes-Benz, and Lexus. Any brand catch your eye?",
  financing: "Use the calculator on this page to estimate monthly payments, or contact Alex for bank pre-approval and personalized rates.",
  price:     "Prices start from ₱1.5M to ₱4.5M+. What's your budget range?",
  def:       "For the fastest response, Viber Alex at +63 912 345 6789 or fill out the contact form. 😊"
};
function getBR(t) {
  t = t.toLowerCase();
  if (t.includes('suv')||t.includes('fortuner')||t.includes('everest')) return bR.suv;
  if (t.includes('sedan')||t.includes('civic')||t.includes('bmw'))      return bR.sedan;
  if (t.includes('brand'))                                               return bR.brand;
  if (t.includes('financ')||t.includes('loan')||t.includes('monthly'))  return bR.financing;
  if (t.includes('price')||t.includes('cost')||t.includes('much'))      return bR.price;
  return bR.def;
}
function toggleChat() {
  const w = document.getElementById('chatWin');
  const open = w.classList.toggle('open');
  document.getElementById('chatIco').className = open ? 'fas fa-times' : 'fas fa-comments';
  document.querySelector('.chat-notif').style.display = open ? 'none' : 'flex';
}
function addMsg(txt, who) {
  const msgs = document.getElementById('chatMsgs');
  const d = document.createElement('div'); d.className = `cmsg ${who}`;
  d.innerHTML = `<div class="cmsg-bub">${txt}</div>`;
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
}
function sendChat() {
  const inp = document.getElementById('chatInp'); const txt = inp.value.trim();
  if (!txt) return;
  addMsg(txt, 'user'); inp.value = ''; document.getElementById('cqBtns').innerHTML = '';
  setTimeout(() => addMsg(getBR(txt), 'bot'), 650);
}
function cqReply(t) { document.getElementById('chatInp').value = t; sendChat(); }
 
// ── INIT ──
renderSpotlight(cars[0]);
renderThumbs();