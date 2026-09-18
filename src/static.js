import './styles.css';
import './hero-overrides.css';

const heroFrames = Array.from({ length: 10 }, (_, i) => `/hero/frame-${String(i + 1).padStart(2, '0')}.png?v=fullres-20260918-2`);

const topics = [
  ['Obrolan Tanpa Basa-basi', 'Percakapan hangat, tajam, dan lucu tentang perjalanan karier, kegagalan, ambisi, serta sisi manusia di balik figur publik.'],
  ['Cerita Sosial & Kultur', 'Kang Jago membedah fenomena sosial, budaya pop, kebiasaan kota, dan isu keseharian dengan bahasa yang dekat dan mudah dinikmati.'],
  ['Games & Challenge', 'Segmen cepat yang memancing spontanitas tamu: pilihan sulit, rapid questions, adu argumen ringan, dan permainan khas Kang Jago.'],
  ['Panggung Tamu', 'Artis, musisi, YouTuber, kreator, dan selebgram mendapat ruang untuk cerita, perform, reveal proyek, atau menunjukkan sisi yang jarang terlihat.']
];

const root = document.getElementById('root');

root.innerHTML = `
  <main>
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Kang Jago Show home"><span class="brand-crown">♛</span><span>KANG JAGO</span></a>
      <button class="menu-toggle" aria-label="Toggle navigation">☰</button>
      <nav class="nav">
        <a href="#about">Tentang</a><a href="#format">Format</a><a href="#schedule">Jadwal</a><a class="nav-cta" href="#watch">YouTube</a>
      </nav>
    </header>

    <section id="top" class="hero-sequence">
      <div class="hero-sticky">
        <div class="hero-fallback" aria-hidden="true"></div>
        <div class="hero-frame-stack" aria-label="Kang Jago hero sequence">
          ${heroFrames.map((src, i) => `<img src="${src}" class="hero-frame${i === 0 ? ' active' : ''}" data-frame="${i}" alt="" loading="eager" decoding="async" fetchpriority="${i < 4 ? 'high' : 'auto'}" draggable="false">`).join('')}
        </div>
        <div class="hero-vignette"></div><div class="hero-grid"></div>
        <div class="hero-copy">
          <div class="eyebrow">ORIGINAL ENTERTAINMENT SHOW</div>
          <h1>KANG JAGO</h1>
          <p>Preman humoris. Kepala dingin. Mulut tajam. Satu meja untuk cerita besar, obrolan liar, dan tamu yang nggak biasa.</p>
          <div class="hero-actions"><a class="btn btn-gold" href="#watch">Tonton di YouTube</a><a class="btn btn-ghost" href="#about">Kenal Kang Jago</a></div>
        </div>
        <div class="frame-counter"><b id="frame-number">01</b><span>/10</span></div>
        <div class="scroll-hint">SCROLL TO PLAY <i>↓</i></div>
      </div>
    </section>

    <section id="about" class="section intro-section">
      <div class="section-kicker">BUKAN SEKADAR TALKSHOW</div>
      <div class="split"><h2>Ketika obrolan serius ketemu energi jalanan.</h2><div class="body-copy"><p><strong>Kang Jago Show</strong> adalah program entertainment berbasis talkshow dan komedi yang dipimpin karakter Kang Jago: percaya diri, humoris, kompetitif, tetapi punya radar sosial yang tajam.</p><p>Setiap episode mempertemukan Kang Jago dengan artis, penyanyi, YouTuber, kreator, dan selebgram untuk ngobrol tentang karier, kehidupan, budaya populer, fenomena sosial, sampai cerita yang biasanya tidak muncul di panggung formal.</p></div></div>
    </section>

    <section id="format" class="section format-section">
      <div class="section-head"><div><div class="section-kicker">APA YANG DIBAHAS?</div><h2>Format yang lincah. Topik yang dekat.</h2></div><p>Satu episode bisa bergerak dari tawa, cerita personal, debat receh, sampai momen yang unexpectedly jujur.</p></div>
      <div class="topic-grid">${topics.map(([title,text], i) => `<article class="topic-card"><span>0${i+1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
    </section>

    <section class="marquee"><div>ARTIS • MUSISI • YOUTUBER • KREATOR • KOMEDI • CERITA SOSIAL • POP CULTURE • ARTIS • MUSISI • YOUTUBER • KREATOR •</div></section>

    <section id="schedule" class="section schedule-section">
      <div class="schedule-card"><div><div class="section-kicker">JADWAL TAYANG • DUMMY</div><h2>Jumat malam, waktunya Kang Jago.</h2></div><div class="schedule-data"><div><small>Hari</small><strong>Setiap Jumat</strong></div><div><small>Jam</small><strong>20.00 WIB</strong></div><div><small>Platform</small><strong>YouTube Premiere</strong></div></div></div>
      <p class="schedule-note">Jadwal di atas masih dummy untuk kebutuhan layout dan akan diganti saat jadwal resmi diumumkan.</p>
    </section>

    <section id="watch" class="watch-section"><div class="watch-glow"></div><div class="watch-copy"><div class="section-kicker">WATCH • CLIPS • BEHIND THE SCENES</div><h2>Satu panggung.<br>Banyak cerita.</h2><p>Episode penuh, potongan terbaik, momen backstage, dan konten ekstra Kang Jago akan hadir di YouTube.</p><a class="btn btn-gold disabled" href="#schedule" aria-disabled="true">Channel segera hadir</a></div><div class="play-orbit" aria-hidden="true"><span>▶</span></div></section>

    <footer><a class="brand footer-brand" href="#top"><span class="brand-crown">♛</span><span>KANG JAGO</span></a><p>Entertainment • Talkshow • Comedy</p><p class="copyright">© 2026 Kang Jago Show. All rights reserved.</p></footer>
  </main>`;

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => nav?.classList.toggle('open'));

const heroFrameElements = Array.from(document.querySelectorAll('.hero-frame'));
const frameNumber = document.getElementById('frame-number');
let activeFrame = 0;
let ticking = false;

// Force every original PNG to start loading immediately. The browser keeps all 10 decoded/warm,
// while CSS only paints the active frame so Safari does not soften ten composited layers at once.
heroFrameElements.forEach((img) => {
  img.loading = 'eager';
  if (img.complete) img.decode?.().catch(() => {});
  else img.addEventListener('load', () => img.decode?.().catch(() => {}), { once: true });
});

function updateFrame() {
  const hero = document.querySelector('.hero-sequence');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  const total = Math.max(hero.offsetHeight - window.innerHeight, 1);
  const progress = Math.min(1, Math.max(0, -rect.top / total));
  const next = Math.min(heroFrames.length - 1, Math.floor(progress * heroFrames.length));
  if (next === activeFrame) return;
  heroFrameElements[activeFrame]?.classList.remove('active');
  heroFrameElements[next]?.classList.add('active');
  activeFrame = next;
  if (frameNumber) frameNumber.textContent = String(next + 1).padStart(2, '0');
}

function onViewportChange() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateFrame();
    ticking = false;
  });
}

window.addEventListener('scroll', onViewportChange, { passive: true });
window.addEventListener('resize', onViewportChange);
updateFrame();
