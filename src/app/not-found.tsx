import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() { return <div className="not-found"><Compass size={55}/><span className="eyebrow">404 · SAHIFA TOPILMADI</span><h1>Yangi hikoya sari qaytamiz.</h1><p>Siz izlagan sahifa mavjud emas yoki manzili o‘zgargan.</p><Link className="button button-gold" href="/">Bosh sahifaga qaytish</Link></div>; }
