import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
