"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Globe2, Heart, MonitorPlay, Play, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, Tv, X } from "lucide-react";
import { getMedia, media, normalizeSearch, typeLabels, type Media } from "@/lib/data";
import { useArmTV } from "@/components/armtv-provider";
import "./media-pages.css";

export function MediaCard({ item, compact = false }: { item: Media; compact?: boolean }) {
  const { saved, toggleSaved } = useArmTV();
  const isSaved = saved.includes(item.id);
  return (
    <article className={`catalog-card${compact ? " catalog-card-compact" : ""}`}>
      <div className="catalog-card-artwork">
        <Link href={`/film/${item.id}`} aria-label={`${item.title} haqida`} className="catalog-card-link">
          {/* Local artwork is deliberately rendered at its native poster ratio. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} loading="lazy" />
          <span className="catalog-card-shade" />
          <span className="catalog-card-play"><Play size={20} fill="currentColor" /></span>
        </Link>
        <span className="catalog-card-rating"><Star size={10} fill="currentColor" />{item.rating}</span>
        <span className="catalog-card-age">{item.age}</span>
        <button className={`catalog-card-save${isSaved ? " is-saved" : ""}`} onClick={() => toggleSaved(item.id)} aria-label={isSaved ? `${item.title}ni saqlanganlardan olib tashlash` : `${item.title}ni saqlash`} aria-pressed={isSaved}>
          {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
      <Link href={`/film/${item.id}`} className="catalog-card-title">{item.title}</Link>
      <p className="catalog-card-meta">{item.year}<span>•</span>{typeLabels[item.type]}</p>
    </article>
  );
}

const catalogTitles = {
  all: ["Filmlar va seriallar", "Yaxshi hikoyalar shu yerdan boshlanadi."],
  translated: ["Tarjima filmlar", "Dunyo kinosi — o‘z tilingizda."],
  kids: ["Bolalar olami", "Kichik tomoshabinlar uchun katta sarguzashtlar."],
  saved: ["Saqlanganlar", "Sevimli hikoyalaringiz doim yoningizda."],
};

export function CatalogPage({ kind = "all" }: { kind?: "all" | "translated" | "kids" | "saved" }) {
  const { saved } = useArmTV();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("popular");
  const [age, setAge] = useState("all");
  const [language, setLanguage] = useState("all");
  const baseItems = media.filter((item) => kind === "saved" ? saved.includes(item.id) : kind === "kids" ? item.type === "kids" : kind === "translated" ? item.translated : item.type !== "kids");
  const genres = [...new Set(baseItems.map((item) => item.genre))];
  const years = [...new Set(baseItems.map((item) => item.year))].sort((a, b) => b - a);
  const filtered = baseItems.filter((item) =>
    (category === "all" || item.type === category) &&
    (genre === "all" || item.genre === genre) &&
    (year === "all" || item.year.toString() === year) &&
    (age === "all" || item.age === age) &&
    (language === "all" || item.language.includes(language)) &&
    normalizeSearch(`${item.title} ${item.genre} ${item.year}`).includes(normalizeSearch(query))
    ).sort((a, b) => sort === "newest" ? b.year - a.year : sort === "name" ? a.title.localeCompare(b.title) : Number(b.rating) - Number(a.rating));
  const clear = () => { setCategory("all"); setGenre("all"); setYear("all"); setAge("all"); setQuery(""); setLanguage("all"); };
  const hasFilters = category !== "all" || genre !== "all" || year !== "all" || age !== "all" || language !== "all" || query !== "";

  return <div className={`catalog-page catalog-kind-${kind}`}>
    <div className="catalog-heading"><div><p className="eyebrow">{kind === "kids" ? "O‘RGANAMIZ. KULAMIZ. ULG‘AYAMIZ." : "ARMTV KOLLEKSIYASI"}</p><h1>{catalogTitles[kind][0]}</h1><p>{catalogTitles[kind][1]}</p></div>{kind === "all" && <Link href="/tarjima" className="button button-secondary catalog-translated-link"><Globe2 size={16}/>Tarjima filmlar<ArrowRight size={15}/></Link>}{kind === "saved" && <span className="catalog-count"><Bookmark size={16} />{saved.length} ta saqlangan</span>}</div>

    {kind === "kids" && <section className="catalog-kids-banner"><div className="catalog-kids-content"><span className="catalog-kids-label"><Sparkles size={14} />QIZIQARLI VA FOYDALI</span><h2>Tasavvurga<br />qanot bering!</h2><p>Sevimli qahramonlar, yangi kashfiyotlar<br />va mehrga to‘la hikoyalar.</p><button className="button button-gold" onClick={() => document.getElementById("catalog-results")?.scrollIntoView({ behavior: "smooth" })}>Sarguzashtni boshlash<ArrowRight size={16} /></button></div><div className="catalog-kids-illustration" aria-hidden="true"><span className="catalog-kids-orbit" /><Star className="catalog-kids-star one" size={40} fill="currentColor" /><Star className="catalog-kids-star two" size={22} fill="currentColor" /><Image src="/images/kids-1.jpg" alt="" width={155} height={235} /><span className="catalog-kids-planet">✦</span></div><span className="catalog-kids-safe"><ShieldCheck size={14} />Bolalar uchun saralangan</span></section>}

    {kind === "translated" && <div className="catalog-language-note"><Globe2 size={20} /><p><strong>Yangi olamlar. Tanish til.</strong><span>O‘zbek, rus va original tildagi filmlar to‘plami.</span></p></div>}

    <div className="catalog-tabs" role="group" aria-label={kind === "kids" ? "Yosh bo‘yicha" : "Kontent turi"}>
      {(kind === "kids" ? [{ value: "all", label: "Barchasi" }, { value: "0+", label: "0+ yosh" }, { value: "6+", label: "6+ yosh" }] : [{ value: "all", label: "Barchasi" }, { value: "film", label: "Filmlar" }, { value: "serial", label: "Seriallar" }, { value: "documentary", label: "Hujjatli filmlar" }]).map((tab) => <button key={tab.value} className={(kind === "kids" ? age : category) === tab.value ? "active" : ""} aria-pressed={(kind === "kids" ? age : category) === tab.value} onClick={() => kind === "kids" ? setAge(tab.value) : setCategory(tab.value)}>{tab.label}</button>)}
    </div>

    <div className="catalog-filters"><div className="catalog-select-wrap"><SlidersHorizontal size={15} /><select aria-label="Janr" value={genre} onChange={(event) => setGenre(event.target.value)}><option value="all">Barcha janrlar</option>{genres.map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={13} /></div><div className="catalog-select-wrap"><select aria-label="Chiqarilgan yil" value={year} onChange={(event) => setYear(event.target.value)}><option value="all">Barcha yillar</option>{years.map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={13} /></div>{kind === "translated" && <div className="catalog-select-wrap"><select aria-label="Audio tili" value={language} onChange={(event) => setLanguage(event.target.value)}><option value="all">Barcha tillar</option><option>O‘zbekcha</option><option>Русский</option><option>English</option></select><ChevronDown size={13} /></div>}<label className="catalog-search"><Search size={17} /><input placeholder="Nomi bo‘yicha qidirish" aria-label="Katalogdan qidirish" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button onClick={() => setQuery("")} aria-label="Qidiruvni tozalash"><X size={15} /></button>}</label></div>

    <div className="catalog-results-heading" id="catalog-results"><p><strong>{filtered.length}</strong> ta {kind === "kids" ? "sarguzasht" : "film va serial"}</p><label>Saralash:<select aria-label="Saralash" value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Reyting bo‘yicha</option><option value="newest">Eng yangilari</option><option value="name">Nomi bo‘yicha</option></select><ChevronDown size={13} /></label></div>
    {filtered.length ? <div className="catalog-grid">{filtered.map((item) => <MediaCard key={item.id} item={item} />)}</div> : <div className="empty-state catalog-empty">{kind === "saved" && !hasFilters ? <Bookmark size={38} /> : <Search size={38} />}<h2>{kind === "saved" && !hasFilters ? "Sevimlilaringizni shu yerda jamlang" : "Hozircha hech narsa topilmadi"}</h2><p>{kind === "saved" && !hasFilters ? "Film kartochkasidagi saqlash belgisini bosing. Tanlangan filmlar shu yerda ko‘rinadi." : "Boshqa nom bilan qidiring yoki filtrlarni o‘zgartiring."}</p>{hasFilters ? <button className="button button-secondary" onClick={clear}>Filtrlarni tozalash</button> : <Link className="button button-gold" href="/filmlar">Filmlarni kashf etish<ArrowRight size={16} /></Link>}</div>}
    {!!filtered.length && <p className="catalog-bottom-note">Siz uchun saralangan hikoyalar. Yangi to‘plamlar bilan boyitib boriladi.</p>}
  </div>;
}

const channels = [
  { name: "O‘zbekiston", short: "O‘Z", color: "#37b29a", genre: "Milliy telekanal", program: "Vatan — yagona", next: "Axborot", description: "Yurtimiz hayoti, madaniyati va qadriyatlari haqida." },
  { name: "Yoshlar", short: "Y", color: "#ec7b30", genre: "Yoshlar telekanali", program: "Yangi kun", next: "Yoshlar vaqti", description: "Yoshlar uchun yangi g‘oyalar va qiziqarli ko‘rsatuvlar." },
  { name: "Sport", short: "S", color: "#57a467", genre: "Sport telekanali", program: "Sport yangiliklari", next: "Futbol olami", description: "Sport olami, tahlillar va musobaqalar." },
  { name: "Madaniyat va ma’rifat", short: "M", color: "#bb8bdf", genre: "Madaniyat telekanali", program: "San’at sehri", next: "Adabiyot olami", description: "San’at, adabiyot va milliy meros olamiga sayohat." },
  { name: "Dunyo bo‘ylab", short: "D", color: "#5ab1da", genre: "Sayohat telekanali", program: "O‘zbekiston bo‘ylab", next: "Tabiat sirlari", description: "Dunyo go‘zalligi va yangi manzillarni kashf eting." },
  { name: "Bolajon", short: "B", color: "#e4b044", genre: "Bolalar telekanali", program: "Ertaklar olami", next: "Quvnoq dars", description: "Kichik tomoshabinlar uchun quvnoq va foydali ko‘rsatuvlar." },
];
const guideDays = [{ label: "Kecha", value: -1 }, { label: "Bugun", value: 0 }, { label: "Ertaga", value: 1 }];

export function LivePage() {
  const [selected, setSelected] = useState(0);
  const [day, setDay] = useState(0);
  const [guideSelection, setGuideSelection] = useState(2);
  const [previewOpen, setPreviewOpen] = useState(false);
  const channel = channels[selected];
  const programNames = ["Tonggi dastur", day === 1 ? "Yangi tong" : "Kun manzarasi", channel.program, channel.next, day === -1 ? "Kechagi suhbat" : "Oqshom suhbatlari", "Badiiy film"];
  const guideTimes = ["08:00", "10:30", "12:00", "13:30", "18:00", "20:30"];

  return <div className="live-page"><div className="catalog-heading"><div><p className="eyebrow">BIR EKRANDA — BUTUN OLAM</p><h1>Jonli TV<span className="live-heading-dot" /></h1><p>Sevimli telekanallaringiz, istalgan vaqtda.</p></div><span className="live-demo-badge">DEMO</span></div>
    <section className="live-viewer"><div className="live-preview"><div className="live-preview-top"><span className="live-preview-channel"><span style={{ color: channel.color }}>{channel.short}</span>{channel.name}</span><span className="live-preview-quality">HD</span></div><div className="live-preview-content"><div className="live-preview-icon"><Tv size={38} strokeWidth={1.3} /></div><h2>{previewOpen ? "Efir ulanishi tayyorlanmoqda" : "Televideniye, siz bilan birga"}</h2><p>{previewOpen ? `${channel.name} uchun jonli efir manbasi hali ulanmagan. Quyida namuna dasturlar jadvali bilan tanishing.` : "Bu sahifa interfeys namunasidir. Jonli efir manbasi hali ulanmagan."}</p><button className="button button-gold" onClick={() => setPreviewOpen(!previewOpen)}><MonitorPlay size={17} />{previewOpen ? "Ko‘rinishga qaytish" : "Efir haqida"}</button></div><div className="live-preview-bottom"><span className="live-preview-volume"><Tv size={16} />Jonli TV</span><span>Jonli efir ulanmagan</span><span>16:9</span></div></div><aside className="live-now"><span className="live-demo-label">NAMUNA DASTURI</span><h2>{channel.program}</h2><p>{channel.description}</p><div className="live-now-time"><Clock3 size={15} />12:00 — 13:30<span>90 daqiqa</span></div><div className="live-now-divider" /><span className="live-next-label">KEYINGI DASTUR</span><h3>{channel.next}</h3><p className="live-next-time">13:30 — 14:00</p></aside></section>
    <section className="live-channels"><div className="live-section-heading"><h2>Telekanallar</h2><span>{channels.length} ta kanal</span></div><div className="live-channel-grid">{channels.map((item, index) => <button key={item.name} aria-pressed={selected === index} className={`live-channel${selected === index ? " active" : ""}`} onClick={() => { setSelected(index); setPreviewOpen(false); setGuideSelection(2); }}><div className="live-channel-logo" style={{ color: item.color }}><span>{item.short}</span>{selected === index && <span className="live-channel-selected"><Check size={11} /></span>}</div><strong>{item.name}</strong><span>{item.genre}</span></button>)}</div></section>
    <section className="live-guide"><div className="live-section-heading"><div><h2>Dasturlar jadvali</h2><p>{channel.name} · Namuna jadval</p></div><div className="live-day-tabs" role="group" aria-label="Jadval kuni"><button className="live-day-arrow" aria-label="Oldingi kun" onClick={() => setDay(Math.max(-1, day - 1))} disabled={day === -1}><ChevronLeft size={15} /></button>{guideDays.map((item) => <button key={item.value} aria-pressed={item.value === day} className={day === item.value ? "active" : ""} onClick={() => { setDay(item.value); setGuideSelection(2); }}>{item.label}</button>)}<button className="live-day-arrow" aria-label="Keyingi kun" onClick={() => setDay(Math.min(1, day + 1))} disabled={day === 1}><ChevronRight size={15} /></button></div></div><div className="live-guide-list">{programNames.map((name, index) => <button className={`live-program${guideSelection === index ? " selected" : ""}`} key={`${day}-${index}`} onClick={() => setGuideSelection(index)} aria-expanded={guideSelection === index}><span className="live-program-time">{guideTimes[index]}</span><div><strong>{name}</strong><span>{index === 5 ? "Badiiy film" : index === 2 ? channel.genre : "Teleko‘rsatuv"}{guideSelection === index ? " · Namuna dasturi, video arxiv ulanmagan" : ""}</span></div>{index === 2 && <span className="live-program-tag">TANLANGAN KANAL</span>}<ChevronRight size={17} /></button>)}</div><p className="live-guide-note">Jadvaldagi vaqt va dasturlar namuna uchun keltirilgan. Haqiqiy efir jadvali xizmat ulanganda ko‘rsatiladi.</p></section>
  </div>;
}

export function MovieDetail({ id }: { id: string }) {
  const item = getMedia(id);
  const { saved, toggleSaved, playMedia, notify, audioLanguage, setAudioLanguage } = useArmTV();
  const language = item?.language.split(" · ").includes(audioLanguage) ? audioLanguage : item?.language.split(" · ")[0] || "O‘zbekcha";
  const [activeTab, setActiveTab] = useState("about");
  const [episode, setEpisode] = useState(1);
  if (!item) return <div className="empty-state detail-not-found"><MonitorPlay size={36} /><h1>Film topilmadi</h1><p>To‘plamdagi boshqa hikoyalar bilan tanishing.</p><Link href="/filmlar" className="button button-gold">Katalogga qaytish</Link></div>;
  const isSaved = saved.includes(id);
  const related = media.filter((entry) => entry.id !== id && (item.type === "kids" ? entry.type === "kids" : entry.type !== "kids")).slice(0, 6);
  const languages = item.language.split(" · ");
  const episodes = item.id === "chegarachi" ? 12 : 8;

  return <div className="detail-page"><section className={`detail-hero${item.type === "kids" ? " detail-hero-kids" : ""}`}><div className="detail-hero-art" style={{ backgroundImage: `url('${item.image}')` }} /><div className="detail-hero-shade" /><Link href={item.type === "kids" ? "/bolalar" : "/filmlar"} className="detail-back"><ArrowLeft size={16} />Katalogga qaytish</Link><div className="detail-hero-content"><span className="detail-exclusive"><span />ARMTV {item.translated ? "TARJIMA" : "KOLLEKSIYA"}</span><p className="detail-hero-genre">{item.genre}</p><h1>{item.title}</h1><p className="detail-tagline">{item.subtitle}</p><div className="detail-meta"><span className="detail-rating"><Star size={14} fill="currentColor" />{item.rating}</span><span>{item.year}</span><span>{typeLabels[item.type]}</span><span>{item.duration}</span><span className="detail-age">{item.age}</span><span className="detail-hd">HD</span></div><p className="detail-description">{item.description}</p><div className="detail-actions"><button className="button button-gold" onClick={() => playMedia(id)}><Play size={18} fill="currentColor" />Tomosha qilish</button><button className={`button button-secondary${isSaved ? " detail-is-saved" : ""}`} onClick={() => toggleSaved(id)} aria-pressed={isSaved}>{isSaved ? <Check size={17} /> : <Bookmark size={17} />}{isSaved ? "Saqlangan" : "Saqlash"}</button></div><div className="detail-audio"><Globe2 size={14} /><label htmlFor="detail-language">Audio tili</label><select id="detail-language" value={language} onChange={(event) => { setAudioLanguage(event.target.value); notify(`${event.target.value} tili tanlandi. Bu demo — filmning asl ovoz yo‘laklari hali ulanmagan.`); }}>{languages.map((entry) => <option key={entry}>{entry}</option>)}</select><ChevronDown size={12} /></div></div></section>
    <div className="detail-lower"><div className="detail-tabs" role="tablist" aria-label="Film haqida ma’lumot"><button id="detail-about-tab" role="tab" aria-controls="detail-about-panel" aria-selected={activeTab === "about"} onClick={() => setActiveTab("about")} className={activeTab === "about" ? "active" : ""}>Film haqida</button>{item.type === "serial" && <button id="detail-episodes-tab" role="tab" aria-controls="detail-episodes-panel" aria-selected={activeTab === "episodes"} onClick={() => setActiveTab("episodes")} className={activeTab === "episodes" ? "active" : ""}>Qismlar<span>{episodes}</span></button>}</div>{activeTab === "about" ? <section className="detail-about" id="detail-about-panel" role="tabpanel" aria-labelledby="detail-about-tab"><div><h2>Har bir hikoyada bir olam</h2><p>{item.description}</p><p className="detail-demo-note"><MonitorPlay size={15} />Namuna kontent. Filmning asl videosi hali ulanmagan.</p></div><dl><div><dt>Janr</dt><dd>{item.genre}</dd></div><div><dt>Chiqarilgan yil</dt><dd>{item.year}</dd></div><div><dt>Audio tili</dt><dd>{language}</dd></div><div><dt>Yosh chegarasi</dt><dd>{item.age}</dd></div></dl></section> : <section className="detail-episodes" id="detail-episodes-panel" role="tabpanel" aria-labelledby="detail-episodes-tab"><div className="detail-episodes-heading"><h2>1-fasl</h2><span>{episodes} qism · {episode}-qism tanlandi</span></div><div className="detail-episode-grid">{Array.from({ length: episodes }, (_, index) => index + 1).map((number) => <button key={number} className={`detail-episode${episode === number ? " active" : ""}`} onClick={() => setEpisode(number)} aria-pressed={episode === number}><span className="detail-episode-thumbnail" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.6), rgba(0,0,0,.2)), url('${item.image}')` }}><Play size={23} fill="currentColor" /><span>{number.toString().padStart(2, "0")}</span></span><strong>{number}-qism</strong><span>{item.id === "chegarachi" ? "45" : "42"} daqiqa</span></button>)}</div><button className="button button-gold" onClick={() => { notify(`${episode}-qism tanlandi. Qismning asl videosi hali ulanmagan.`); playMedia(id); }}><Play size={16} fill="currentColor" />{episode}-qismni ochish</button></section>}
    <section className="detail-related"><div className="detail-related-heading"><h2>Sizga ham yoqishi mumkin</h2><Link href={item.type === "kids" ? "/bolalar" : "/filmlar"}>Barchasi<ArrowRight size={16} /></Link></div><div className="catalog-grid">{related.map((entry) => <MediaCard key={entry.id} item={entry} />)}</div></section><div className="detail-footer-note"><Heart size={15} />Yaxshi hikoyalarni birga tomosha qilamiz.</div></div>
  </div>;
}
