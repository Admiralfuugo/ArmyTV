import { notFound } from "next/navigation";
import { CatalogPage, LivePage } from "@/components/media-pages";
import { LibraryPage, CoursesPage, QuizPage, NewsPage } from "@/components/learning-pages";
import { SubscriptionPage } from "@/components/subscription-page";

const sections: Record<string, string> = { filmlar: "Filmlar va seriallar", "jonli-efir": "Jonli TV", bolalar: "Bolalar", kutubxona: "Kutubxona", talim: "Ta’lim", testlar: "Test va viktorinalar", yangiliklar: "Yangiliklar", saqlanganlar: "Saqlanganlar", obuna: "Premium obuna", tarjima: "Tarjima filmlar" };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(sections).map((section) => ({ section })); }
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) { const { section } = await params; return { title: sections[section] || "Sahifa topilmadi" }; }
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  switch(section) {
    case "filmlar": return <CatalogPage/>;
    case "tarjima": return <CatalogPage kind="translated"/>;
    case "bolalar": return <CatalogPage kind="kids"/>;
    case "saqlanganlar": return <CatalogPage kind="saved"/>;
    case "jonli-efir": return <LivePage/>;
    case "kutubxona": return <LibraryPage/>;
    case "talim": return <CoursesPage/>;
    case "testlar": return <QuizPage/>;
    case "yangiliklar": return <NewsPage/>;
    case "obuna": return <SubscriptionPage/>;
    default: notFound();
  }
}
