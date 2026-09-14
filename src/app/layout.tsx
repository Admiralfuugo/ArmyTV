import type { Metadata } from "next";
import { ArmTVProvider } from "@/components/armtv-provider";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ArmTv — Vatan. Bilim. Ilhom.", template: "%s | ArmTv" },
  description: "Filmlar, jonli telekanallar, elektron kutubxona, ta’lim va viktorinalar. Vatan, bilim va ilhom bir joyda — ArmTv.",
  applicationName: "ArmTv",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body><ArmTVProvider><AppShell>{children}</AppShell></ArmTVProvider></body></html>;
}
