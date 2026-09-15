import type { Metadata } from "next";
import { ArmTVProvider } from "@/components/armtv-provider";
import { AppShell } from "@/components/app-shell";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  title: { default: "ArmyTv. — Vatan. Bilim. Ilhom.", template: "%s | ArmyTv." },
  description: "Filmlar, jonli telekanallar, elektron kutubxona, ta’lim va viktorinalar. Vatan, bilim va ilhom bir joyda — ArmyTv.",
  applicationName: "ArmyTv.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" data-theme="dark" suppressHydrationWarning>
      <head><script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body><ArmTVProvider><AppShell>{children}</AppShell></ArmTVProvider></body>
    </html>
  );
}
