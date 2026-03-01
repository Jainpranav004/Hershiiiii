// Content arrays — update these with your actual files
const photos = [
  { src: 'public/photo1.jpg', caption: '25 years of love, trust, and togetherness' },
  { src: 'public/photo2.jpg', caption: 'A family like ours is life’s most precious blessing' },
  { src: 'public/photo3.jpg', caption: 'Family moments' },
  { src: 'public/photo4.jpg', caption: 'In every happiness of mine, you stands silently behind me' },
  { src: 'public/photo5.jpg', caption: 'My family — my safe place, my biggest support system forever.' },
  { src: 'public/photo6.jpg', caption: 'No matter where life takes me, my heart always belongs to you' },
  { src: 'public/photo7.jpg', caption: 'Blessed to grow up surrounded by your love' },
  { src: 'public/photo8.jpg', caption: 'Golden years ahead' },
  { src: 'public/photo9.jpg', caption: 'Golden years ahead' },
  { src: 'public/photo10.jpg', caption: 'My family — my safe place, my biggest support system forever.' },
  { src: 'public/photo11.jpg', caption: 'Cheers to 25 years of laughter, strength, and unconditional love.' }
];

const videos = [
  { src: 'assets/videos/vid1.mp4', poster: 'assets/posters/vid1.jpg', caption: 'vid1' },
  { src: 'assets/videos/1.mp4', poster: 'assets/posters/1.jpg', caption: 'A short clip' }
];

/* --- Rendering --- */
const photoGrid = document.getElementById('photo-grid');
const videoGrid = document.getElementById('video-grid');

function createPhotoCard(item, idx){
  const c = document.createElement('div'); c.className='card reveal';
  const img = document.createElement('img'); img.src=item.src; img.alt=item.caption||`photo-${idx+1}`;
  const cap = document.createElement('div'); cap.className='caption'; cap.textContent = item.caption||'';
  c.appendChild(img); c.appendChild(cap);
  c.addEventListener('click', ()=> openCarousel(photos, idx));
  return c;
}

function createVideoCard(item, idx){
  const c = document.createElement('div'); c.className='card video-card reveal';
  const v = document.createElement('video'); v.src=item.src; v.poster=item.poster; v.muted=true; v.playsInline=true; v.preload='metadata';
  v.setAttribute('aria-hidden','true');
  const cap = document.createElement('div'); cap.className='caption'; cap.textContent = item.caption||'';
  c.appendChild(v); c.appendChild(cap);

  // Hover autoplay (desktop)
  c.addEventListener('mouseenter', ()=>{ v.currentTime=0; v.play(); c.classList.add('playing'); });
  c.addEventListener('mouseleave', ()=>{ v.pause(); v.currentTime=0; c.classList.remove('playing'); });

  // Tap to play on mobile
  c.addEventListener('click', (e)=>{
    if(window.matchMedia('(hover: none)').matches){
      if(v.paused) { v.play(); c.classList.add('playing'); }
      else { v.pause(); v.currentTime=0; c.classList.remove('playing'); }
    } else {
      // open lightbox on click for desktop
      openLightbox(videos, idx, 'video');
    }
  });

  return c;
}

function renderAll(){
  photoGrid.innerHTML=''; videoGrid.innerHTML='';
  photos.forEach((p,i)=> photoGrid.appendChild(createPhotoCard(p,i)));
  videos.forEach((v,i)=> videoGrid.appendChild(createVideoCard(v,i)));
}

renderAll();

/* --- Lightbox --- */
const lightbox = document.getElementById('lightbox');
const lbMedia = document.getElementById('lb-media');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
let lbArray = null, lbIndex = 0, lbType = 'photo';
let lbForceUnmute = false; // when true, showLB will unmute video autoplay

function openLightbox(array, index, type){
  lbArray = array; lbIndex = index; lbType = type; showLB();
}

function showLB(){
  lbMedia.innerHTML='';
  const item = lbArray[lbIndex];
  if(lbType==='photo'){
    const img = document.createElement('img'); img.src=item.src; img.alt=item.caption||''; lbMedia.appendChild(img);
  } else {
    const v = document.createElement('video'); v.src=item.src; v.controls=true; v.autoplay=true; v.playsInline=true; v.poster=item.poster;
    // default: muted for hover-preview and to avoid autoplay blocking; allow force-unmute
    v.muted = !lbForceUnmute;
    lbMedia.appendChild(v);
    // try to play and clear the flag
    v.play().catch(()=>{});
    lbForceUnmute = false;
  }
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closeLB(){
  lightbox.setAttribute('aria-hidden','true');
  lbMedia.innerHTML='';
  document.body.style.overflow='auto';
}

lbClose.addEventListener('click', closeLB);
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) closeLB(); });
lbPrev.addEventListener('click', ()=>{ lbIndex = (lbIndex -1 + lbArray.length) % lbArray.length; showLB(); });
lbNext.addEventListener('click', ()=>{ lbIndex = (lbIndex +1) % lbArray.length; showLB(); });
document.addEventListener('keydown', (e)=>{
  if(lightbox.getAttribute('aria-hidden')==='false'){
    if(e.key==='Escape') closeLB();
    if(e.key==='ArrowLeft') lbPrev.click();
    if(e.key==='ArrowRight') lbNext.click();
  }
});

/* --- Fullscreen gallery carousel --- */
const galleryCarousel = document.getElementById('gallery-carousel');
const gcMain = document.getElementById('gc-main');
const gcLeft = document.getElementById('gc-left');
const gcRight = document.getElementById('gc-right');
const gcClose = document.getElementById('gc-close');
let gcArray = [], gcIndex = 0;

function buildCarousel(array){
  gcArray = array;
  // populate thumbs
  gcLeft.innerHTML = '';
  gcRight.innerHTML = '';
  array.forEach((it,i)=>{
    const t = document.createElement('img'); t.src = it.src; t.alt = it.caption||''; t.dataset.index = i;
    t.addEventListener('click', ()=> showCarousel(i));
    // split thumbs roughly half left/right
    if(i < Math.ceil(array.length/2)) gcLeft.appendChild(t); else gcRight.appendChild(t);
  });
}

function openCarousel(array, index){
  if(!array || array.length===0) return;
  gcArray = array; gcIndex = index || 0;
  buildCarousel(array);
  showCarousel(gcIndex);
  galleryCarousel.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function showCarousel(i){
  gcIndex = (i + gcArray.length) % gcArray.length;
  gcMain.innerHTML = '';
  const img = document.createElement('img'); img.src = gcArray[gcIndex].src; img.alt = gcArray[gcIndex].caption||'';
  gcMain.appendChild(img);
  // set active thumb styles
  document.querySelectorAll('#gc-left img,#gc-right img').forEach(el=>el.classList.remove('active'));
  const activeThumb = document.querySelector('#gc-left img[data-index="'+gcIndex+'"], #gc-right img[data-index="'+gcIndex+'"]');
  if(activeThumb) activeThumb.classList.add('active');
}

function closeCarousel(){
  galleryCarousel.setAttribute('aria-hidden','true');
  gcMain.innerHTML = '';
  document.body.style.overflow='auto';
}

// next/prev via click on main image
gcMain.addEventListener('click', ()=>{ showCarousel(gcIndex+1); });
gcClose.addEventListener('click', closeCarousel);
galleryCarousel.addEventListener('click', (e)=>{ if(e.target===galleryCarousel) closeCarousel(); });
document.addEventListener('keydown', (e)=>{
  if(galleryCarousel.getAttribute('aria-hidden')==='false'){
    if(e.key==='Escape') closeCarousel();
    if(e.key==='ArrowLeft') showCarousel(gcIndex-1);
    if(e.key==='ArrowRight') showCarousel(gcIndex+1);
  }
});

// hook nav "Photos" link to open carousel instead of scroll
const galleryNav = document.getElementById('open-gallery');
if(galleryNav) galleryNav.addEventListener('click', (ev)=>{ ev.preventDefault(); openCarousel(photos,0); });

// hero CTA (no explicit hook) — links behave as regular anchors

/* --- Reveal on scroll --- */
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('is-visible'); obs.unobserve(en.target); } });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* --- Particles (simple hearts & circles) --- */
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W, H, particles=[];
  function resize(){ W=canvas.width=canvas.clientWidth; H=canvas.height=canvas.clientHeight; }
  window.addEventListener('resize', resize); resize();

  function rand(min,max){return Math.random()*(max-min)+min}
  function make(){ if(particles.length<40) particles.push({x:rand(0,W),y:H+20,r:rand(6,18),vy:rand(0.3,1.2),alpha:rand(0.2,0.9),type:Math.random()>0.7?'heart':'dot'}) }
  function drawHeart(x,y,r,alpha){ ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle='rgba(247,214,218,0.9)'; ctx.translate(x,y); ctx.beginPath(); ctx.moveTo(0,-r/2); ctx.bezierCurveTo(r,-r/2,r,r/3,0,r); ctx.bezierCurveTo(-r,r/3,-r,-r/2,0,-r/2); ctx.fill(); ctx.restore(); }
  function render(){ ctx.clearRect(0,0,W,H); make(); particles.forEach((p,i)=>{ p.y -= p.vy; p.x += Math.sin(p.y/40 + i)/10; p.alpha -= 0.001; if(p.alpha<=0||p.y<-40) particles.splice(i,1);
    if(p.type==='heart') drawHeart(p.x,p.y,p.r,p.alpha); else { ctx.save(); ctx.globalAlpha=p.alpha; ctx.fillStyle='rgba(233,222,248,0.9)'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r/2,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  }); requestAnimationFrame(render); }
  render();
}

/* --- Music toggle --- */
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
musicBtn.addEventListener('click', ()=>{
  if(bgMusic.paused){ bgMusic.play().catch(()=>{}); musicBtn.textContent='Pause Music'; musicBtn.setAttribute('aria-pressed','true'); }
  else { bgMusic.pause(); musicBtn.textContent='Play Music'; musicBtn.setAttribute('aria-pressed','false'); }
});

/* Ensure audio is allowed — if user hasn't interacted, play will be blocked; user can click music button */

/* --- Smooth scroll for anchor links (native behavior OK) --- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    // skip gallery nav (we open fullscreen carousel instead)
    if(a.id === 'open-gallery') return;
    const href = a.getAttribute('href'); if(href.length>1){ e.preventDefault(); document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

// Play single video clip from the hero CTA
const playVideoCta = document.getElementById('play-video-cta');
if(playVideoCta) playVideoCta.addEventListener('click', (ev)=>{ ev.preventDefault(); lbForceUnmute = true; openLightbox(videos,0,'video'); });

/* Small accessibility: focus visible for keyboard users */
document.addEventListener('keyup', (e)=>{ if(e.key==='Tab') document.body.classList.add('show-focus'); });

