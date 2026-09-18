import { useEffect, useMemo, useState } from 'react';

const heroFrames = Array.from({ length: 10 }, (_, i) => `/hero/frame-${String(i + 1).padStart(2, '0')}.webp`);

const topics = [
  ['Obrolan Tanpa Basa-basi', 'Percakapan hangat, tajam, dan lucu tentang perjalanan karier, kegagalan, ambisi, serta sisi manusia di balik figur publik.'],
  ['Cerita Sosial & Kultur', 'Kang Jago membedah fenomena sosial, budaya pop, kebiasaan kota, dan isu keseharian dengan bahasa yang dekat dan mudah dinikmati.'],
  ['Games & Challenge', 'Segmen cepat yang memancing spontanitas tamu: pilihan sulit, rapid questions, adu argumen ringan, dan permainan khas Kang Jago.'],
  ['Panggung Tamu', 'Artis, musisi, YouTuber, kreator, dan selebgram mendapat ruang untuk cerita, perform, reveal proyek, atau menunjukkan sisi yang jarang terlihat.']
];

function App() {
  const [frame, setFrame] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const frameLabels = useMemo(() => heroFrames.map((_, i) => String(i + 1).padStart(2, '0')), []);

  useEffect(() => {
    const updateFrame = () => {
      const hero = document.querySelector('.hero-sequence');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const total = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      setFrame(Math.min(heroFrames.length - 1, Math.floor(progress * heroFrames.length)));
    };
    updateFrame();
    window.addEventListener('scroll', updateFrame, { passive: true });
    window.addEventListener('resize', updateFrame);
    return () => {
      window.removeEventListener('scroll', updateFrame);
      window.removeEventListener('resize', updateFrame);
    };
  }, []);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kang Jago Show home">
          <span className="brand-crown">♛</span>
          <span>KANG JAGO</span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">☰</button>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#about">Tentang</a>
          <a href="#format">Format</a>
          <a href="#schedule">Jadwal</a>
          <a className="nav-cta" href="#watch">YouTube</a>
        </nav>
      </header>

      <section id="top" className="hero-sequence">
        <div className="hero-sticky">
          <div className="hero-fallback" aria-hidden="true" />
          {heroFrames.map((src, i) => (
            <img
              key={src}
              src={src}
              className={`hero-frame ${i === frame ? 'active' : ''}`}
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ))}
          <div className="hero-vignette" />
          <div className="hero-grid" />
          <div className="hero-copy">
            <div className="eyebrow">ORIGINAL ENTERTAINMENT SHOW</div>
            <h1>KANG<br/><span>JAGO</span></h1>
            <p>Preman humoris. Kepala dingin. Mulut tajam. Satu meja untuk cerita besar, obrolan liar, dan tamu yang nggak biasa.</p>
            <div className="hero-actions">
              <a className="btn btn-gold" href="#watch">Tonton di YouTube</a>
              <a className="btn btn-ghost" href="#about">Kenal Kang Jago</a>
            </div>
          </div>
          <div className="frame-counter"><b>{frameLabels[frame]}</b><span>/10</span></div>
          <div className="scroll-hint">SCROLL TO PLAY <i>↓</i></div>
        </div>
      </section>

      <section id="about" className="section intro-section">
        <div className="section-kicker">BUKAN SEKADAR TALKSHOW</div>
        <div className="split">
          <h2>Ketika obrolan serius ketemu energi jalanan.</h2>
          <div className="body-copy">
            <p><strong>Kang Jago Show</strong> adalah program entertainment berbasis talkshow dan komedi yang dipimpin karakter Kang Jago: percaya diri, humoris, kompetitif, tetapi punya radar sosial yang tajam.</p>
            <p>Setiap episode mempertemukan Kang Jago dengan artis, penyanyi, YouTuber, kreator, dan selebgram untuk ngobrol tentang karier, kehidupan, budaya populer, fenomena sosial, sampai cerita yang biasanya tidak muncul di panggung formal.</p>
          </div>
        </div>
      </section>

      <section id="format" className="section format-section">
        <div className="section-head">
          <div>
            <div className="section-kicker">APA YANG DIBAHAS?</div>
            <h2>Format yang lincah. Topik yang dekat.</h2>
          </div>
          <p>Satu episode bisa bergerak dari tawa, cerita personal, debat receh, sampai momen yang unexpectedly jujur.</p>
        </div>
        <div className="topic-grid">
          {topics.map(([title, text], i) => (
            <article className="topic-card" key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marquee" aria-label="Show themes">
        <div>ARTIS • MUSISI • YOUTUBER • KREATOR • KOMEDI • CERITA SOSIAL • POP CULTURE • ARTIS • MUSISI • YOUTUBER • KREATOR •</div>
      </section>

      <section id="schedule" className="section schedule-section">
        <div className="schedule-card">
          <div>
            <div className="section-kicker">JADWAL TAYANG</div>
            <h2>Coming to YouTube.</h2>
          </div>
          <div className="schedule-data">
            <div><small>Hari</small><strong>Segera diumumkan</strong></div>
            <div><small>Jam</small><strong>Segera diumumkan</strong></div>
            <div><small>Platform</small><strong>YouTube</strong></div>
          </div>
        </div>
        <p className="schedule-note">Jadwal resmi dan tautan channel akan diperbarui setelah finalisasi program.</p>
      </section>

      <section id="watch" className="watch-section">
        <div className="watch-glow" />
        <div className="watch-copy">
          <div className="section-kicker">WATCH • CLIPS • BEHIND THE SCENES</div>
          <h2>Satu panggung.<br/>Banyak cerita.</h2>
          <p>Episode penuh, potongan terbaik, momen backstage, dan konten ekstra Kang Jago akan hadir di YouTube.</p>
          <a className="btn btn-gold disabled" href="#schedule" aria-disabled="true">Channel segera hadir</a>
        </div>
        <div className="play-orbit" aria-hidden="true"><span>▶</span></div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-crown">♛</span><span>KANG JAGO</span></a>
        <p>Entertainment • Talkshow • Comedy</p>
        <p className="copyright">© 2026 Kang Jago Show. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;
