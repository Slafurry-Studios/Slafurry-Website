import { Bebas_Neue, Poppins } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

const bebas = Bebas_Neue({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-bebas'
});

const poppins = Poppins({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-poppins'
});

const FALLBACK = {
    title: "SLAFURRY STUDIOS",
    description: "The joke went too far. Now we are going professional.",
    siteUrl: "https://slafurrystudios.com",
    ogImage: "/images/og-preview.png",
    twitterImage: "/images/og-preview.png",
    googleVerifyId: "",
}

export async function generateMetadata(): Promise<Metadata> {
    //   const meta = await prisma.siteMetadata.findUnique({ where: { id: 1 } })

    // const title = meta?.title || FALLBACK.title
    // const description = meta?.description || FALLBACK.description
    // const siteUrl = meta?.siteUrl || FALLBACK.siteUrl
    // const ogImage = meta?.ogImage || FALLBACK.ogImage
    // const twitterImage = meta?.twitterImage || FALLBACK.twitterImage
    // const googleVerifyId = meta?.googleVerifyId || FALLBACK.googleVerifyId

    const title = FALLBACK.title
    const description = FALLBACK.description
    const siteUrl = FALLBACK.siteUrl
    const ogImage = FALLBACK.ogImage
    const twitterImage = FALLBACK.twitterImage
    const googleVerifyId = FALLBACK.googleVerifyId

    return {
        title,
        description,
        verification: {
            google: googleVerifyId,
        },
        openGraph: {
            title,
            description,
            url: siteUrl,
            siteName: "Slafurry Studios",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: "Slafurry Studios",
                },
            ],
            locale: "id_ID",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [twitterImage],
        },
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${bebas.variable} ${poppins.variable} scroll-smooth`}>
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <body className="bg-white text-primary font-poppins">
                {children}
                <Analytics />
            </body>
        </html>
    );
}