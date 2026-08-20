import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import Cursor from "@/components/motion/Cursor";
import MotionRoot from "@/components/motion/MotionRoot";
import Preloader from "@/components/motion/Preloader";
import ScrollProgress from "@/components/motion/ScrollProgress";
import SmoothScroll from "@/components/motion/SmoothScroll";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
  themeColor: "#08070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
      Lenis stamps `lenis lenis-smooth` onto the root element as soon as it
      initialises, which React sees as an attribute it did not write. The
      warning is suppressed for this one element only — nothing about the
      root's markup is actually generated differently on the two sides.
    */
    <html
      lang="en"
      className={`${archivo.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SmoothScroll>
          <Preloader />
          <Cursor />
          <ScrollProgress />

          <a className="skip-link" href="#top">
            Skip to content
          </a>

          <SiteNav />
          {children}
          <MotionRoot />
        </SmoothScroll>
      </body>
    </html>
  );
}
