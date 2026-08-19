import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Intro from "@/components/motion/Intro";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SmoothScroll from "@/components/motion/SmoothScroll";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  display: "swap",
});

const description =
  "Kavin Nandha M K — cloud and DevOps engineer in Coimbatore. Bare-metal k3s serving 1,000+ concurrent users, a self-hosted Cloudflare Zero Trust edge, and the CI/CD that ships to both.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kavinweb.info"),
  title: "Kavin Nandha M K — Cloud / DevOps engineer",
  description,
  keywords: [
    "Kavin Nandha",
    "DevOps engineer",
    "Cloud engineer",
    "Kubernetes",
    "k3s",
    "Cloudflare Zero Trust",
    "Coimbatore",
  ],
  authors: [{ name: "Kavin Nandha M K", url: "https://kavinweb.info" }],
  openGraph: {
    type: "website",
    url: "https://kavinweb.info",
    title: "Kavin Nandha M K — Cloud / DevOps engineer",
    description,
    siteName: "Kavin Nandha M K",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavin Nandha M K — Cloud / DevOps engineer",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3f2f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        {/*
          Every scroll-driven entrance ships its resting state as an inline
          `opacity: 0` in the prerendered HTML. If the JavaScript never runs,
          that HTML would render an empty page — so without a script engine we
          force everything visible and drop the curtain outright.
        */}
        <noscript>
          <style>{`
            [data-motion] { opacity: 1 !important; transform: none !important; }
            [data-motion="mask"] span { transform: none !important; }
            .scroll-word { opacity: 1 !important; }
            .intro, .progress-track { display: none !important; }
            .count-anim { display: none !important; }
            .count-true {
              position: static !important; width: auto !important; height: auto !important;
              margin: 0 !important; clip-path: none !important; white-space: normal !important;
            }
          `}</style>
        </noscript>

        <Intro />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
