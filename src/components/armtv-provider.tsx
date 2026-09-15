"use client";

import { assetPath } from "@/lib/asset-path";

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";
import { Bookmark, Check, CheckCircle2, Info, Play, ShieldCheck } from "lucide-react";
import { getMedia } from "@/lib/data";
import { Modal, useStoredState } from "./ui";

type Profile = { name: string; phone: string } | null;
type Subscription = { plan: "monthly" | "yearly"; activatedAt: string } | null;
type Progress = Record<string, number>;
type Context = {
  saved: string[]; toggleSaved: (id: string) => void;
  playMedia: (id: string) => void; notify: (message: string) => void;
  profile: Profile; setProfile: (value: Profile) => void;
  openProfile: () => void; subscription: Subscription;
  setSubscription: (value: Subscription) => void;
  audioLanguage: string; setAudioLanguage: (value: string) => void;
  progress: Progress;
};
const ArmTVContext = createContext<Context | null>(null);
const emptySaved: string[] = [];
const emptyProgress: Progress = {};
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const isProfile = (value: unknown): value is Profile => value === null || (typeof value === "object" && value !== null && typeof (value as Profile)?.name === "string" && typeof (value as Profile)?.phone === "string");
const isSubscription = (value: unknown): value is Subscription => value === null || (typeof value === "object" && value !== null && ["monthly", "yearly"].includes(String((value as Subscription)?.plan)) && typeof (value as Subscription)?.activatedAt === "string");
const isString = (value: unknown): value is string => typeof value === "string";
const isProgress = (value: unknown): value is Progress => typeof value === "object" && value !== null && !Array.isArray(value) && Object.values(value).every((item) => typeof item === "number" && Number.isFinite(item) && item >= 0);

export function useArmTV() {
  const context = useContext(ArmTVContext);
  if (!context) throw new Error("ArmTVProvider kerak");
  return context;
}

export function ArmTVProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useStoredState<string[]>("armtv-saved", emptySaved, isStringArray);
  const [profile, setProfile] = useStoredState<Profile>("armtv-profile", null, isProfile);
  const [subscription, setSubscription] = useStoredState<Subscription>("armtv-subscription", null, isSubscription);
  const [audioLanguage, setAudioLanguage] = useStoredState("armtv-audio-language", "O‘zbekcha", isString);
  const [progress, setProgress] = useStoredState<Progress>("armtv-progress", emptyProgress, isProgress);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSave = useRef(0);
  const video = useRef<HTMLVideoElement>(null);
  const playing = playingId ? getMedia(playingId) : null;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function notify(message: string) {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3500);
  }

  function toggleSaved(id: string) {
    setSaved((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]);
    notify(saved.includes(id) ? "Saqlanganlardan olib tashlandi" : "Saqlanganlarga qo‘shildi");
  }

  return <ArmTVContext.Provider value={{ saved, toggleSaved, playMedia: (id) => { lastSave.current = 0; setPlayingId(id); }, notify, profile, setProfile, openProfile: () => setProfileOpen(true), subscription, setSubscription, audioLanguage, setAudioLanguage, progress }}>
    {children}
    {toast && <div className="toast" role="status"><CheckCircle2 size={19}/>{toast}</div>}
    {playing && <Modal title={playing.title} onClose={() => setPlayingId(null)} className="player-modal">
      <div className="player-frame">
        <video ref={video} key={playing.id} controls autoPlay playsInline preload="metadata" poster={playing.image} aria-label={`${playing.title} — namuna lavhasi`}
          onLoadedMetadata={(event) => { const savedTime = progress[playing.id]; if (savedTime && savedTime < event.currentTarget.duration - 1) event.currentTarget.currentTime = savedTime; }}
          onTimeUpdate={(event) => { const current = Math.floor(event.currentTarget.currentTime); if (Math.abs(current - lastSave.current) >= 2) { lastSave.current = current; setProgress((old) => ({ ...old, [playing.id]: current })); } }}
          onEnded={() => { setProgress((old) => ({ ...old, [playing.id]: 0 })); }}>
          <source src={assetPath("/media/armtv-preview.mp4")} type="video/mp4"/>
          Brauzeringiz video pleyerni qo‘llab-quvvatlamaydi.
        </video>
        <span className="player-demo-label">NAMUNA LAVHASI</span>
      </div>
      <div className="player-info"><div><span className="eyebrow"><Play size={12}/> ARMYTV PLEYER</span><h3>{playing.title}</h3><p>{playing.year} <span>·</span> {playing.genre} <span>·</span> {playing.age}</p></div>
        <button className="button button-secondary" onClick={() => toggleSaved(playing.id)}>{saved.includes(playing.id) ? <Check size={17}/> : <Bookmark size={17}/>} {saved.includes(playing.id) ? "Saqlandi" : "Saqlash"}</button>
      </div>
      <p className="demo-note"><Info size={16}/> Bu pleyer uchun yaratilgan qisqa namuna. Filmning asl videosi va ovoz yo‘laklari hali ulanmagan.</p>
    </Modal>}
    {profileOpen && <Modal title={profile ? "Mening profilim" : "ArmyTv’ga xush kelibsiz"} onClose={() => { setProfileOpen(false); setFormError(""); }} className="profile-modal">
      {profile ? <div className="profile-content"><div className="profile-avatar">{profile.name.slice(0, 1).toUpperCase()}</div><h3>{profile.name}</h3><p>{profile.phone}</p><div className="profile-stats"><div><strong>{saved.length}</strong><span>Saqlangan kontent</span></div><div><strong>{subscription ? "Premium" : "Bepul"}</strong><span>Demo profil</span></div></div><p className="demo-note"><ShieldCheck size={17}/> Profil ma’lumotlari faqat ushbu brauzerda saqlanadi.</p><button className="button button-secondary full-width" onClick={() => { setProfile(null); setProfileOpen(false); notify("Profildan chiqdingiz"); }}>Profildan chiqish</button></div>
      : <form className="profile-form" onSubmit={(event) => { event.preventDefault(); const digits = phone.replace(/\D/g, ""); if (name.trim().length < 2) { setFormError("Ismingizni kiriting (kamida 2 harf)."); return; } if (!/^998\d{9}$/.test(digits) && !/^\d{9}$/.test(digits)) { setFormError("Telefon raqamini to‘g‘ri kiriting: +998 90 123 45 67"); return; } setProfile({ name: name.trim(), phone: digits.startsWith("998") ? `+${digits}` : `+998${digits}` }); setProfileOpen(false); setFormError(""); notify("Demo profilingiz tayyor. Xush kelibsiz!"); }}>
        <div className="profile-welcome-icon"><ShieldCheck size={31}/></div><p>Sevimli kontentingiz, bilim va ilhom — barchasi bir joyda.</p>
        <label>Ismingiz<input autoComplete="given-name" placeholder="Ismingizni kiriting" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={50}/></label>
        <label>Telefon raqamingiz<input type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={phone} onChange={(event) => setPhone(event.target.value)} required maxLength={20}/></label>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button className="button button-gold full-width" type="submit">Demo profil yaratish</button>
        <p className="form-hint">Bu namuna profil. SMS yuborilmaydi va ma’lumotlaringiz serverga jo‘natilmaydi.</p>
      </form>}
    </Modal>}
  </ArmTVContext.Provider>;
}
