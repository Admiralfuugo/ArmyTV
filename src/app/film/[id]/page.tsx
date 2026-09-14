import { notFound } from "next/navigation";
import { media, getMedia } from "@/lib/data";
import { MovieDetail } from "@/components/media-pages";

export const dynamicParams = false;
export function generateStaticParams() { return media.map(({id}) => ({id})); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return { title: getMedia(id)?.title || "Film topilmadi" }; }
export default async function FilmPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!getMedia(id)) notFound(); return <MovieDetail id={id}/>; }
