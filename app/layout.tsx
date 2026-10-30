import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: "LingoSphere - Ko'p Tilli Til O'rganish Platformasi",
  description: "20 ta jahon tili, har bir tilda 1,000+ o'quv so'zi, Web Speech API ovozli talaffuz va ovozni tekshirish, alifbo, grammatika, dark rejim va interaktiv testlar. O'zbek, Rus va Ingliz tillari bepul.",
  openGraph: {
    title: "LingoSphere - Ko'p Tilli Til O'rganish Platformasi",
    description: "20 ta jahon tili, har bir tilda 1,000+ o'quv so'zi, Web Speech API ovozli talaffuz va ovozni tekshirish, alifbo, grammatika, dark rejim va interaktiv testlar. O'zbek, Rus va Ingliz tillari bepul.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LingoSphere - Ko'p Tilli Til O'rganish Platformasi",
    description: "20 ta jahon tili, har bir tilda 1,000+ o'quv so'zi, Web Speech API ovozli talaffuz va ovozni tekshirish, alifbo, grammatika, dark rejim va interaktiv testlar. O'zbek, Rus va Ingliz tillari bepul.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Unbounded (sarlavhalar) va Manrope (matn): ikkalasi ham lotin + kirill */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@500;600;700&display=swap&subset=cyrillic,latin-ext"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
