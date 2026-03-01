// Standalone gallery page script
const photosPage = [
  { src: 'public/photo14.jpg', caption: 'Twenty-five years of laughter, understanding, sacrifices, and a love that continued to grow stronger with time.' },
  { src: 'public/photo13.jpg', caption: 'From strangers to soulmates — a journey worth celebrating.' },
  { src: 'public/photo12.jpg', caption: 'Two strangers once promised to walk together, unknowingly beginning a journey that would turn into a lifetime memories.' },
  { src: 'public/photo15.jpg', caption: 'From shared dreams to shared responsibilities, your togetherness created a home filled with warmth and happiness.' },
  { src: 'public/photo1.jpg', caption: 'A lifetime of standing beside each other, sharing dreams, overcoming challenges, and turning moments into cherished memories.' },
  { src: 'public/photo2.jpg', caption: 'A family like ours is life’s most precious blessing' },
  { src: 'public/photo3.jpg', caption: 'You gave me roots to stay grounded and wings to chase my dreams fearlessly.' },
  { src: 'public/photo4.jpg', caption: 'Years passed, love stayed.' },
  { src: 'public/photo5.jpg', caption: 'My family — my safe place, my biggest support system forever.' },
  { src: 'public/photo6.jpg', caption: 'No matter where life takes me, my heart always belongs to you' },
  { src: 'public/photo7.jpg', caption: 'Blessed to grow up surrounded by your love' },
  { src: 'public/photo8.jpg', caption: 'Roots of love, branches of memories.' },
  { src: 'public/photo9.jpg', caption: 'In every phase of life, your love has been my constant support, silently guiding me and giving me strength when I needed it the most.' },
  { src: 'public/photo10.jpg', caption: 'In a world that constantly changes, my family remains my comfort, my strength, and my forever home.' },
  { src: 'public/photo11.jpg', caption: 'Every picture holds a thousand unspoken thank-yous.' },
  { src: 'public/photo16.jpg', caption: 'Cheers to 25 years of laughter, strength, and unconditional love.' }
];

const gpLeft = document.getElementById('gp-left');
const gpRight = document.getElementById('gp-right');
const gpMain = document.getElementById('gp-main');
let gpIndex = 0;

function buildPage(){
  gpLeft.innerHTML = ''; gpRight.innerHTML = '';
  photosPage.forEach((p,i)=>{
    const t = document.createElement('img');
    t.src = p.src; t.alt = p.caption || '';
    t.dataset.index = i;
    t.className = 'gp-thumb';
    t.addEventListener('click', ()=> showPhoto(i));
    if(i < Math.ceil(photosPage.length/2)) gpLeft.appendChild(t); else gpRight.appendChild(t);
  });
}

function showPhoto(i){
  gpIndex = (i + photosPage.length) % photosPage.length;
  gpMain.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'gp-main-wrap';
  const img = document.createElement('img'); img.src = photosPage[gpIndex].src; img.alt = photosPage[gpIndex].caption||'';
  img.className = 'gp-main-img';
  wrap.appendChild(img);
  const cap = document.createElement('div'); cap.className = 'gp-main-caption'; cap.textContent = photosPage[gpIndex].caption||'';
  gpMain.appendChild(wrap);
  gpMain.appendChild(cap);
  updateActive();
}

function updateActive(){
  document.querySelectorAll('.gp-thumb').forEach(t=> t.classList.remove('active'));
  const sel = document.querySelector('.gp-thumb[data-index="'+gpIndex+'"]');
  if(sel) sel.classList.add('active');
}

// next on main click
gpMain.addEventListener('click', ()=> showPhoto(gpIndex+1));

// keyboard nav
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft') showPhoto(gpIndex-1);
  if(e.key === 'ArrowRight') showPhoto(gpIndex+1);
});

buildPage();
showPhoto(0);
