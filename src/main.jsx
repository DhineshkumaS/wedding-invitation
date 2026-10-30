import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays, Clock3, MapPin, Heart, ArrowDown, ExternalLink,
  CalendarPlus, Navigation, Flower2, Volume2, VolumeX
} from "lucide-react";
import "./style.css";

const wedding = {
  groom: "S. Sasikumar",
  groomQualification: "B.Com. (C.A.)",
  bride: "N. Nithya Dharshini",
  brideQualification: "B.B.A.",
  receptionStart: new Date("2026-11-16T07:00:00+05:30"),
  receptionEnd: new Date("2026-11-17T00:00:00+05:30"),
  receptionDateLabel: "16 November 2026",
  receptionDayLabel: "Monday",
  receptionTimeLabel: "7:00 AM - 12:00 AM",
  dateLabel: "16 November 2026",
  dayLabel: "Monday",
  // Local time in India (UTC+05:30)
  start: new Date("2026-11-16T04:30:00+05:30"),
  end: new Date("2026-11-16T06:00:00+05:30"),
  timeLabel: "4:30 AM - 6:00 AM",
  venue: "Renuka Mahal",
  address: "Valparai Main Road, Rangasamuthram",
};

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${wedding.venue}, ${wedding.address}`
)}`;

function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = wedding.start.getTime() - now.getTime();
  if (remaining <= 0) {
    return (
      <div className="countdown-ended">
        <Heart size={17} fill="currentColor" />
        <span>With love, we celebrated our special day</span>
      </div>
    );
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return (
    <div className="countdown" aria-label="Time until the wedding">
      {[
        ["Days", days],
        ["Hours", hours],
        ["Minutes", minutes],
        ["Seconds", seconds],
      ].map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function addToCalendar() {
  const format = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendarEvents = [
    { id: "ceremony", title: "Wedding Ceremony", start: wedding.start, end: wedding.end, location: `${wedding.venue}, ${wedding.address}` },
    { id: "reception", title: "Wedding Reception", start: wedding.receptionStart, end: wedding.receptionEnd },
  ];
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    ...calendarEvents.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event.id}-sasikumar-nithya-dharshini-${event.start.getTime()}@wedding-invitation`,
      `DTSTAMP:${format(new Date())}`,
      `DTSTART:${format(event.start)}`,
      `DTEND:${format(event.end)}`,
      `SUMMARY:${event.title} - S. Sasikumar & N. Nithya Dharshini`,
      ...(event.location ? [`LOCATION:${event.location}`] : []),
      "DESCRIPTION:Your presence and blessings will make our special day memorable.",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding-invitation.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function FloralMark() {
  return (
    <div className="floral-mark" aria-hidden="true">
      <span className="petal p1" /><span className="petal p2" />
      <span className="petal p3" /><span className="petal p4" />
      <span className="petal p5" /><span className="petal p6" />
      <span className="mark-center">ॐ</span>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [openingInvitation, setOpeningInvitation] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef(null);
  const navItems = useMemo(() => [
    ["Our Invitation", "#invitation"],
    ["Our Story", "#story"],
    ["Celebration", "#details"],
    ["Families", "#families"],
    ["RSVP", "#rsvp"],
  ], []);

  function openInvitation() {
    if (openingInvitation) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const music = musicRef.current;
    if (music) {
      music.volume = 0.22;
      music.play().catch(() => setMusicPlaying(false));
    }
    setOpeningInvitation(true);
    window.setTimeout(() => {
      setInvitationOpened(true);
      window.requestAnimationFrame(() => {
        document.getElementById("invitation")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
        });
      });
    }, reducedMotion ? 0 : 450);
  }

  function toggleMusic() {
    const music = musicRef.current;
    if (!music) return;
    if (music.paused) {
      music.volume = 0.22;
      music.play().catch(() => setMusicPlaying(false));
    } else {
      music.pause();
    }
  }

  return (
    <main>
      <div className="topline"><span /> ஸ்ரீ முருகன் துணை <span /></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Wedding home">S <span>&</span> N</a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
      </header>

      <audio ref={musicRef} src="/audio/wedding-piano.mp3" loop preload="auto"
        onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} />
      {invitationOpened && <button type="button" className="music-toggle" onClick={toggleMusic}
        aria-label={musicPlaying ? "Pause background music" : "Play background music"}
        title={musicPlaying ? "Pause music" : "Play music"}>
        {musicPlaying ? <Volume2 size={19} /> : <VolumeX size={19} />}
      </button>}

      {!invitationOpened && <section className={`hero${openingInvitation ? " is-opening" : ""}`} id="home">
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="eyebrow"><span className="tiny-diamond">✦</span> WITH THE BLESSINGS OF OUR FAMILIES <span className="tiny-diamond">✦</span></p>
          <FloralMark />
          <p className="script-kicker">Together with our families</p>
          <h1><span>{wedding.groom}</span><em>and</em><span>{wedding.bride}</span></h1>
          <div className="gold-rule"><span>✦</span></div>
          <p className="hero-date">16 <span>·</span> NOVEMBER <span>·</span> 2026</p>
          <p className="hero-invite">joyfully invite you to share in the beginning<br className="desktop-break" /> of our forever.</p>
          <button type="button" className="scroll-cue" onClick={openInvitation} disabled={openingInvitation}>Open Invitation <ArrowDown size={15} /></button>
        </div>
        <div className="corner corner-tl" /><div className="corner corner-tr" />
        <div className="corner corner-bl" /><div className="corner corner-br" />
      </section>}

      {invitationOpened && <>
      <section className="invitation section-light" id="invitation">
        <div className="section-ornament">❧ <span>✦</span> ❧</div>
        <h2>Wedding <i>Invitation</i></h2>
        <p className="invitation-copy">
          With the blessings of our parents and elders, we cordially invite you
          and your family to join us on the joyous occasion of our marriage.
        </p>
        <div className="couple-card">
          <div className="person">
            <span className="person-label">THE GROOM</span>
            <h3>{wedding.groom}</h3>
            <p className="qualification">{wedding.groomQualification}</p>
          </div>
          <div className="ampersand">&</div>
          <div className="person">
            <span className="person-label">THE BRIDE</span>
            <h3>{wedding.bride}</h3>
            <p className="qualification">{wedding.brideQualification}</p>
          </div>
        </div>
        <p className="blessing">Your presence and blessings will make our special day even more memorable.</p>
        <div className="section-ornament bottom-ornament">❧ <span>✦</span> ❧</div>
      </section>

      <section className="story-section" id="story">
        <p className="eyebrow">TWO HEARTS, ONE PROMISE</p>
        <h2>A new chapter <i>begins</i></h2>
        <p className="story-copy">
          With the blessings of our families, we begin our life together.
          We would be honoured to have you beside us as we celebrate this
          special day and the memories still to come.
        </p>
        <div className="story-flourish" aria-hidden="true">&#10087; <span>&#10022;</span> &#10087;</div>
      </section>

      <section className="countdown-section">
        <div className="countdown-flower" aria-hidden="true">✳</div>
        <p className="eyebrow">UNTIL WE SAY “I DO”</p>
        <h2>Counting down to <i>forever</i></h2>
        <Countdown />
        <div className="gold-rule"><span>♡</span></div>
        <p className="countdown-note">Two hearts, one beautiful journey.</p>
      </section>

      <section className="details-section" id="details">
        <div className="details-heading">
          <p className="eyebrow">SAVE THE DATES</p>
          <h2>Two days to <i>celebrate</i></h2>
          <p>Join us for the morning ceremony and reception.</p>
        </div>
        <div className="details-grid">
          <article className="detail-card">
            <div className="detail-icon"><Clock3 size={23} strokeWidth={1.5} /></div>
            <p className="detail-label">MARRIAGE CEREMONY</p>
            <h3>{wedding.dateLabel}</h3>
            <p>{wedding.dayLabel}<br />{wedding.timeLabel}</p>
          </article>
          <article className="detail-card">
            <div className="detail-icon"><CalendarDays size={23} strokeWidth={1.5} /></div>
            <p className="detail-label">RECEPTION</p>
            <h3>{wedding.receptionDateLabel}</h3>
            <p>{wedding.receptionDayLabel}<br />{wedding.receptionTimeLabel}</p>
          </article>
          <article className="detail-card" id="venue">
            <div className="detail-icon"><MapPin size={23} strokeWidth={1.5} /></div>
            <p className="detail-label">THE VENUE</p>
            <h3>Renuka Mahal</h3>
            <p>Valparai Main Road,<br />Rangasamuthram</p>
          </article>
        </div>
        <div className="detail-actions">
          <a className="button button-gold" href={mapUrl} target="_blank" rel="noreferrer">
            <Navigation size={16} /> Get directions <ExternalLink size={14} />
          </a>
          <button className="button button-outline" onClick={addToCalendar}>
            <CalendarPlus size={16} /> Add to calendar
          </button>
        </div>
      </section>

      <section className="families-section" id="families">
        <div className="families-heading">
          <p className="eyebrow">WITH LOVE AND BLESSINGS</p>
          <h2>Our <i>families</i></h2>
          <p>Two families come together to celebrate a beautiful beginning.</p>
        </div>
        <div className="families-grid">
          <article className="family-card">
            <span className="family-flourish" aria-hidden="true">&#10087;</span>
            <p className="detail-label">THE GROOM'S FAMILY</p>
            <h3>S. Sasikumar</h3>
            <p>With grateful hearts, our families invite you to bless this joyful union.</p>
          </article>
          <div className="families-ampersand" aria-hidden="true">&amp;</div>
          <article className="family-card">
            <span className="family-flourish" aria-hidden="true">&#10087;</span>
            <p className="detail-label">THE BRIDE'S FAMILY</p>
            <h3>N. Nithya Dharshini</h3>
            <p>Your presence will make this special day even more memorable.</p>
          </article>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-ornament" aria-hidden="true">&#10022;</div>
        <p className="eyebrow">WE HOPE YOU CAN JOIN US</p>
        <h2>Celebrate with <i>us</i></h2>
        <p>Join us with your family for the wedding ceremony. Your presence and blessings mean the world to us.</p>
        <div className="detail-actions">
          <a className="button button-gold" href={mapUrl} target="_blank" rel="noreferrer">
            <Navigation size={16} /> View venue <ExternalLink size={14} />
          </a>
          <button className="button button-outline" onClick={addToCalendar}>
            <CalendarPlus size={16} /> Save the date
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-flourish">✦ ❧ ✦</div>
        <p className="script-kicker">With love and gratitude</p>
        <h2>{wedding.groom} <span>&</span> {wedding.bride}</h2>
        <p className="footer-message">Your presence is the greatest gift.<br />We look forward to celebrating with you.</p>
        <div className="footer-date">16 · 11 · 2026</div>
        <div className="footer-bottom">MADE WITH <Heart size={12} fill="currentColor" /> FOR OUR SPECIAL DAY</div>
      </footer>
      </>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
