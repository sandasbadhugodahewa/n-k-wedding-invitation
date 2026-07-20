const WEDDING_DATE = new Date('2026-09-03T15:00:00');

// ---------- petal generator ----------
function petalSVG(color){
  return `<svg viewBox="0 0 20 20"><path d="M10 1 C15 1 19 5 19 10 C19 15 15 19 10 19 C5 19 1 15 1 10 C1 5 5 1 10 1 Z" fill="${color}" opacity="0.8"/></svg>`;
}
function spawnPetals(containerId, count, colorList){
  const el = document.getElementById(containerId);
  if(!el) return;
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='petal';
    const size = 6 + Math.random()*8;
    p.style.width = size+'px';
    p.style.height = size+'px';
    p.style.left = (Math.random()*100)+'%';
    const dur = 9 + Math.random()*10;
    p.style.animationDuration = dur+'s';
    p.style.animationDelay = (Math.random()*dur)+'s';
    const color = colorList[Math.floor(Math.random()*colorList.length)];
    p.innerHTML = petalSVG(color);
    el.appendChild(p);
  }
}
spawnPetals('cover-petals', 14, ['#D9B87B','#B8873F','#F6EBDA']);
spawnPetals('hero-petals', 8, ['#B8873F','#D9B87B']);
spawnPetals('cd-petals', 10, ['#D9B87B','#7A2E2E']);
spawnPetals('close-petals', 14, ['#D9B87B','#B8873F','#F6EBDA']);

// ---------- cover open ----------
document.getElementById('openBtn').addEventListener('click', ()=>{
  document.getElementById('cover').classList.add('hide');
  document.body.style.overflow='auto';
  triggerReveal();
});
document.body.style.overflow='hidden';

// ---------- scroll reveal ----------
function triggerReveal(){
  const els = document.querySelectorAll('.reveal, .reveal-scale, .stagger');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
      }
    });
  }, {threshold:0.2});
  els.forEach(el=>io.observe(el));
}

// ---------- countdown ----------
function updateCountdown(){
  const now = new Date();
  let diff = WEDDING_DATE - now;
  if(diff < 0) diff = 0;
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff/(1000*60*60))%24);
  const m = Math.floor((diff/(1000*60))%60);
  const s = Math.floor((diff/1000)%60);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- gallery lightbox ----------
document.querySelectorAll('.g-item img').forEach(img=>{
  img.addEventListener('click', ()=>{
    document.getElementById('lbImg').src = img.dataset.full;
    document.getElementById('lightbox').classList.add('show');
  });
});
document.getElementById('closeLb').addEventListener('click', ()=>{
  document.getElementById('lightbox').classList.remove('show');
});
document.getElementById('lightbox').addEventListener('click', (e)=>{
  if(e.target.id==='lightbox') document.getElementById('lightbox').classList.remove('show');
});

// ---------- RSVP interactions ----------
const attendYes = document.getElementById('attendYes');
const attendNo = document.getElementById('attendNo');
attendYes.addEventListener('click', ()=>{attendYes.classList.add('active'); attendNo.classList.remove('active');});
attendNo.addEventListener('click', ()=>{attendNo.classList.add('active'); attendYes.classList.remove('active');});

let guestCount = 1;
document.getElementById('guestPlus').addEventListener('click', ()=>{
  guestCount = Math.min(guestCount+1, 10);
  document.getElementById('guestNum').textContent = guestCount;
});
document.getElementById('guestMinus').addEventListener('click', ()=>{
  guestCount = Math.max(guestCount-1, 1);
  document.getElementById('guestNum').textContent = guestCount;
});

document.getElementById('sendRsvp').addEventListener('click', ()=>{
  const name = document.getElementById('rsvpName').value || 'Guest';
  const attending = attendYes.classList.contains('active') ? 'Joyfully accepts' : 'Regretfully declines';
  const msg = document.getElementById('rsvpMsg').value || '';
  const lines = [
    "RSVP for Nethmi & Kavindu's Wedding",
    "",
    `Name: ${name}`,
    `Attending: ${attending}`,
    `Guests: ${guestCount}`,
    `Message: ${msg}`
  ];
  const text = encodeURIComponent(lines.join('\n'));
  const phone = '94753166931'; // <-- replace with the couple's real WhatsApp number
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
});

// ---------- calendar + maps links (placeholders, edit with real venue) ----------
function icsLink(title, start, end, location){
  const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const ics = `BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(title)}%0ADTSTART:${fmt(start)}%0ADTEND:${fmt(end)}%0ALOCATION:${encodeURIComponent(location)}%0AEND:VEVENT%0AEND:VCALENDAR`;
  return `data:text/calendar;charset=utf8,${ics}`;
}
const ceremonyStart = new Date('2026-09-03T15:00:00');
const ceremonyEnd = new Date('2026-09-03T17:00:00');
const receptionStart = new Date('2026-09-03T17:30:00');
const receptionEnd = new Date('2026-09-03T22:00:00');

document.getElementById('calCeremony').href = icsLink('Nethmi & Kavindu — Ceremony', ceremonyStart, ceremonyEnd, 'National Basilica of Our Lady of Lanka, Tewatta, Ragama, Sri Lanka');
document.getElementById('calCeremony').setAttribute('download','ceremony.ics');
document.getElementById('calReception').href = icsLink('Nethmi & Kavindu — Reception', receptionStart, receptionEnd, 'Hotel Green Court, Homagama, Sri Lanka');
document.getElementById('calReception').setAttribute('download','reception.ics');

document.getElementById('mapCeremony').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('National Basilica of Our Lady of Lanka, Tewatta, Ragama, Sri Lanka');
document.getElementById('mapCeremony').target = '_blank';
document.getElementById('mapReception').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Hotel Green Court, Homagama, Sri Lanka');
document.getElementById('mapReception').target = '_blank';

// ---------- nav active state ----------
const navLinks = document.querySelectorAll('.nav-btn');
const navSections = ['hero','gallery','details','rsvp'];
window.addEventListener('scroll', ()=>{
  let current = 'hero';
  navSections.forEach(id=>{
    const el = document.getElementById(id);
    if(el && window.scrollY + 140 >= el.offsetTop) current = id;
  });
  navLinks.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
});