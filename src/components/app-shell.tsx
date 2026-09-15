"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Bell, BookOpen, Bookmark, Check, ChevronDown, ChevronRight, CircleHelp, Crown, Film, Globe2, GraduationCap, Home, Menu, Newspaper, Search, ShieldCheck, Smile, Sparkles, Trophy, Tv, UserRound, X } from "lucide-react";
import { media, navItems, normalizeSearch } from "@/lib/data";
import { libraryItems, courses } from "@/lib/learning-data";
import { Brand, Modal } from "./ui";
import { useArmTV } from "./armtv-provider";

const navIcons = { home: Home, film: Film, tv: Tv, kids: Smile, book: BookOpen, education: GraduationCap, quiz: Trophy };

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { saved, profile, subscription, openProfile, audioLanguage, setAudioLanguage } = useArmTV();
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/filmlar" && pathname.startsWith("/film/"));

  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "k") { event.preventDefault(); setSearchOpen((old) => !old); } if (event.key === "Escape") { setMenuOpen(false); setLanguageOpen(false); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const nodes = sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button');
    nodes?.[0]?.focus();
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleTab);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", handleTab); previous?.focus(); };
  }, [menuOpen]);

  const normalized = normalizeSearch(query);
  const matches = media.filter((item) => normalizeSearch(`${item.title} ${item.genre} ${item.language}`).includes(normalized));
  const learningMatches = [
    ...libraryItems.map(item => ({ id: `book-${item.id}`, title: item.title, description: `${item.author} · ${item.category}`, href: `/kutubxona/#kitob-${item.id}`, category: "Kitob" })),
    ...courses.map(item => ({ id: `course-${item.id}`, title: item.title, description: item.category, href: `/talim/#kurs-${item.id}`, category: "Kurs" })),
  ].filter(item => normalizeSearch(`${item.title} ${item.description}`).includes(normalized));
  const sectionMatches = navItems.filter((item) => normalizeSearch(item.label).includes(normalized));

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Asosiy kontentga o‘tish</a>
    {menuOpen && <button className="sidebar-backdrop" aria-label="Menyuni yopish" onClick={() => setMenuOpen(false)}/>}
    <aside ref={sidebarRef} role={menuOpen ? "dialog" : undefined} aria-modal={menuOpen || undefined} className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} aria-label="Asosiy navigatsiya">
      <div className="sidebar-brand"><Link href="/" aria-label="ArmyTv bosh sahifa" onClick={() => setMenuOpen(false)}><Brand/></Link><button className="icon-button mobile-sidebar-close" aria-label="Menyuni yopish" onClick={() => setMenuOpen(false)}><X size={22}/></button></div>
      <p className="sidebar-caption">VATAN. BILIM. ILHOM.</p>
      <span className="nav-group-label">KASHF ETING</span>
      <nav className="main-nav">{navItems.map((item) => { const Icon = navIcons[item.icon as keyof typeof navIcons]; return <Link key={item.href} href={item.href} className={`nav-link ${active(item.href) ? "active" : ""}`} aria-current={active(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}><Icon size={20} strokeWidth={1.7}/><span>{item.label}</span>{item.icon === "tv" && <i className="live-dot"/>}{active(item.href) && <span className="nav-active-mark"/>}</Link>; })}</nav>
      <div className="nav-divider"/>
      <span className="nav-group-label">SIZ UCHUN</span>
      <nav className="main-nav secondary-nav"><Link href="/saqlanganlar" onClick={() => setMenuOpen(false)} className={`nav-link ${active("/saqlanganlar") ? "active" : ""}`} aria-current={active("/saqlanganlar") ? "page" : undefined}><Bookmark size={19} strokeWidth={1.7}/><span>Saqlanganlar</span>{saved.length > 0 && <span className="nav-count">{saved.length}</span>}</Link><Link href="/yangiliklar" onClick={() => setMenuOpen(false)} className={`nav-link ${active("/yangiliklar") ? "active" : ""}`} aria-current={active("/yangiliklar") ? "page" : undefined}><Newspaper size={19} strokeWidth={1.7}/><span>Yangiliklar</span></Link></nav>
      <div className="sidebar-bottom"><Link href="/obuna" className="sidebar-premium" onClick={() => setMenuOpen(false)}><Crown size={23}/><span className="premium-kicker">ARMYTV PREMIUM</span><strong>{subscription ? "Chegarasiz imkoniyatlar" : "Ko‘proq imkoniyat."}<br/>{subscription ? "siz bilan." : "Ko‘proq ilhom."}</strong><span className="premium-price">{subscription ? "Demo obuna faol" : "Oyiga 30 000 so‘mdan"}</span><span className="premium-cta">{subscription ? "Obunani ko‘rish" : "Obuna bo‘lish"}<ArrowUpRight size={17}/></span></Link><button className="help-link" onClick={() => { setMenuOpen(false); setHelpOpen(true); }}><CircleHelp size={18}/> Yordam markazi <ArrowUpRight size={14}/></button><div className="sidebar-footnote"><ShieldCheck size={15}/><span>Bir maqsad. Bir platforma.</span></div></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu-button" aria-label="Menyuni ochish" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={23}/></button><span className="topbar-breadcrumb">Kashf eting <ChevronRight size={13}/> <span>{pathname.startsWith("/film/") ? "Film haqida" : [...navItems, {href:"/saqlanganlar",label:"Saqlanganlar"}, {href:"/yangiliklar",label:"Yangiliklar"}, {href:"/obuna",label:"Premium"}, {href:"/tarjima",label:"Tarjima filmlar"}].find((item) => item.href === pathname.replace(/\/$/, "") || (item.href === "/" && pathname === "/"))?.label || "Bosh sahifa"}</span></span></div>
        <div className="topbar-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Qidirish"><Search size={18}/><span>Film, kitob yoki kurs qidirish</span><kbd>⌘ K</kbd></button><div className="language-wrap"><button className="language-trigger" onClick={() => setLanguageOpen((old) => !old)} aria-expanded={languageOpen} aria-label="Audio tilini tanlash"><Globe2 size={17}/><span>{audioLanguage === "O‘zbekcha" ? "O‘zbekcha" : audioLanguage}</span><ChevronDown size={13}/></button>{languageOpen && <><button className="popover-dismiss" aria-label="Til menyusini yopish" onClick={() => setLanguageOpen(false)}/><div className="language-menu"><strong>Afzal audio tili</strong>{["O‘zbekcha", "Русский", "English"].map((language) => <button key={language} onClick={() => { setAudioLanguage(language); setLanguageOpen(false); }}>{language}{audioLanguage === language && <Check size={16}/>}</button>)}<p>Tarjima kontent uchun saqlanadi. Namuna lavhasi ovozsiz.</p></div></>}</div><button className="icon-button notification-button" aria-label="Bildirishnomalar" onClick={() => { setNotificationsOpen(true); setNotificationsRead(true); }}><Bell size={20}/>{!notificationsRead && <i/>}</button><span className="topbar-divider"/><button className={`login-button ${profile ? "is-profile" : ""}`} onClick={openProfile}><UserRound size={17}/><span>{profile ? profile.name.split(" ")[0] : "Kirish"}</span></button></div>
      </header>
      <main id="main-content" className="main-content">{children}</main>
      <footer className="site-footer"><div><Brand small/><p>Vatan, bilim va ilhom bir joyda.</p></div><span>© {new Date().getFullYear()} ArmyTv. Loyiha namoyishi.</span><button onClick={() => setHelpOpen(true)}>Platforma haqida <ArrowUpRight size={13}/></button></footer>
    </div>
    <nav className="mobile-bottom-nav" aria-label="Mobil navigatsiya"><Link href="/" className={active("/") ? "active" : ""}><Home size={20}/><span>Asosiy</span></Link><Link href="/filmlar" className={active("/filmlar") ? "active" : ""}><Film size={20}/><span>Filmlar</span></Link><Link href="/jonli-efir" className={active("/jonli-efir") ? "active" : ""}><Tv size={20}/><span>Jonli TV</span></Link><Link href="/saqlanganlar" className={active("/saqlanganlar") ? "active" : ""}><Bookmark size={20}/><span>Saqlangan</span></Link><button onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}><Menu size={20}/><span>Menyu</span></button></nav>
    {searchOpen && <Modal title="ArmyTv’da qidirish" onClose={() => setSearchOpen(false)} className="search-modal"><div className="search-field"><Search size={21}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nimani izlayapsiz?" aria-label="Qidiruv matni"/>{query && <button className="icon-button" onClick={() => setQuery("")} aria-label="Qidiruvni tozalash"><X size={17}/></button>}</div><div className="search-results"><span className="eyebrow">{normalized ? `${matches.length + sectionMatches.length + learningMatches.length} ta natija` : "TAVSIYA ETILGAN QIDIRUVLAR"}</span>{(normalized ? matches : matches.slice(0, 4)).map((item) => <Link className="search-result" key={item.id} href={`/film/${item.id}`} onClick={() => setSearchOpen(false)}><Image width={78} height={102} src={item.image} alt=""/><div><strong>{item.title}</strong><span>{item.genre} · {item.year}</span></div><ArrowUpRight size={18}/></Link>)}{normalized && learningMatches.map((item) => <Link key={item.id} className="search-learning-result" href={item.href} onClick={() => setSearchOpen(false)}><span>{item.category === "Kitob" ? <BookOpen size={21}/> : <GraduationCap size={21}/>}</span><div><strong>{item.title}</strong><small>{item.description}</small></div><ArrowUpRight size={17}/></Link>)}{normalized && sectionMatches.map((item) => <Link key={item.href} className="search-section-result" href={item.href} onClick={() => setSearchOpen(false)}>{item.label}<ArrowRight size={17}/></Link>)}{normalized && matches.length === 0 && sectionMatches.length === 0 && learningMatches.length === 0 && <div className="empty-state"><Search size={32}/><h3>Hech narsa topilmadi</h3><p>Boshqa nom yoki qisqaroq so‘z bilan qidirib ko‘ring.</p></div>}{!normalized && <div className="search-quick-links"><Link href="/kutubxona" onClick={() => setSearchOpen(false)}><BookOpen size={16}/> Kutubxona</Link><Link href="/talim" onClick={() => setSearchOpen(false)}><GraduationCap size={16}/> Ta’lim kurslari</Link><Link href="/testlar" onClick={() => setSearchOpen(false)}><Trophy size={16}/> Viktorinalar</Link></div>}</div></Modal>}
    {notificationsOpen && <Modal title="Bildirishnomalar" onClose={() => setNotificationsOpen(false)} className="notifications-modal"><div className="notification-item"><span><Sparkles size={22}/></span><div><strong>ArmyTv’ga xush kelibsiz!</strong><p>Filmlar, kitoblar va bilimlar olamini kashf eting.</p><small>Platforma xabari</small></div></div><Link className="notification-item" href="/testlar" onClick={() => setNotificationsOpen(false)}><span><Trophy size={22}/></span><div><strong>Bilimingizni sinab ko‘ring</strong><p>Qisqa viktorinani yakunlang va shaxsiy rekordingizni o‘rnating.</p><small>Test va viktorinalar <ArrowUpRight size={12}/></small></div></Link></Modal>}
    {helpOpen && <Modal title="ArmyTv. haqida" onClose={() => setHelpOpen(false)} className="help-modal"><Brand/><p>ArmyTv. — filmlar, telekanallar, kitoblar va ta’limni birlashtiruvchi media platforma konsepsiyasi.</p><details open><summary>Bu namoyishda nimalar ishlaydi?</summary><p>Kontent qidirish va saralash, sevimlilarni saqlash, namuna lavhasini ko‘rish, kitob o‘qish, darslarni yakunlash va viktorina ishlash.</p></details><details><summary>Ma’lumotlarim qayerda saqlanadi?</summary><p>Demo profil, saqlangan kontent va natijalar ushbu brauzer xotirasida saqlanadi. Boshqa qurilmalarga ko‘chmaydi.</p></details><details><summary>Obuna va jonli efir ishlaydimi?</summary><p>Obuna tanlashni namuna rejimida sinash mumkin; haqiqiy to‘lov olinmaydi. Jonli telekanallar va to‘liq filmlar uchun media manbalari ulanishi kerak.</p></details></Modal>}
  </div>;
}
