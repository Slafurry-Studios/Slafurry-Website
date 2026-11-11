"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            ease: "easeOut",
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1.0],
        },
    },
};

export default function SecretEasterEgg() {
    return (
        <main className="w-screen h-screen flex flex-col items-center justify-start md:justify-center gap-4 md:gap-6 p-6 md:p-4 relative overflow-hidden bg-white selection:bg-none">

            <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-[380px] sm:w-[680px] md:w-[860px] shrink-0 pt-2 md:pt-10"
            >
                <Image
                    src="/images/phase 2/welcome to our top secret website.png"
                    alt="Welcome to our TOP SECRET Website!"
                    className="w-full h-auto"
                    width={860}
                    height={450}
                    priority
                />
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-start justify-start w-full max-w-5xl z-10 overflow-y-auto max-h-[78vh] pl-0 md:pl-10 py-2 gap-16 md:gap-6 pt-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >

                <motion.div variants={itemVariants}>
                    <a 
                        href="mailto:hello@slafurrystudios.com" 
                        className="w-[360px] sm:w-[580px] md:w-[700px] hover:scale-105 transition-transform block origin-left"
                    >
                        <Image
                            src="/images/phase 2/you can mail us at.png"
                            alt="You can mail us at: hello@slafurrystudios.com"
                            className="w-full h-auto"
                            width={700}
                            height={200}
                        />
                    </a>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col items-start gap-3 md:gap-4">
                    <div className="w-[380px] sm:w-[620px] md:w-[760px]">
                        <Image
                            src="/images/phase 2/play our games here.png"
                            alt="Play our games here!"
                            className="w-full h-auto"
                            width={760}
                            height={200}
                        />
                    </div>
                    <div className="flex items-center gap-12 md:gap-24">
                        <a 
                            href="https://slafurrystudios.itch.io/" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-32 sm:w-44 md:w-52 hover:scale-105 transition-transform block"
                        >
                            <Image
                                src="/images/phase 2/itch io.png"
                                alt="Itch.io"
                                className="w-full h-auto"
                                width={52}
                                height={52}
                            />
                        </a>
                        <a 
                            href="https://github.com/Slafurry-Studios" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-32 sm:w-44 md:w-52 hover:scale-105 transition-transform block"
                        >
                            <Image
                                src="/images/phase 2/github.png"
                                alt="Github"
                                className="w-full h-auto"
                                width={52}
                                height={52}
                            />
                        </a>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col items-start gap-3 md:gap-4">
                    <div className="w-[380px] sm:w-[620px] md:w-[760px]">
                        <Image
                            src="/images/phase 2/by the way this is our socmed.png"
                            alt="By the way, this is our social media. Come take a look!"
                            className="w-full h-auto"
                            width={760}
                            height={200}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 sm:gap-x-20 md:gap-x-24 gap-y-3 sm:gap-y-4">
                        <a 
                            href="https://www.youtube.com/@SlafurryStudios" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-32 sm:w-44 md:w-52 hover:scale-105 transition-transform block"
                        >
                            <Image
                                src="/images/phase 2/youtube.png"
                                alt="Youtube"
                                className="w-full h-auto"
                                width={52}
                                height={52}
                            />
                        </a>
                        <a 
                            href="https://www.linkedin.com/company/slafurry-studios/" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-32 sm:w-44 md:w-52 hover:scale-105 transition-transform block"
                        >
                            <Image
                                src="/images/phase 2/linkedin.png"
                                alt="LinkedIn"
                                className="w-full h-auto"
                                width={52}
                                height={52}
                            />
                        </a>
                        <a 
                            href="https://www.instagram.com/slafurry_studios/" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-32 sm:w-44 md:w-52 hover:scale-105 transition-transform block"
                        >
                            <Image
                                src="/images/phase 2/instagram.png"
                                alt="Instagram"
                                className="w-full h-auto"
                                width={52}
                                height={52}
                            />
                        </a>
                        <a 
                            href="https://www.tiktok.com/@slafurrystudios" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-32 sm:w-44 md:w-52 hover:scale-105 transition-transform block"
                        >
                            <Image
                                src="/images/phase 2/tiktok.png"
                                alt="Tiktok"
                                className="w-full h-auto"
                                width={52}
                                height={52}
                            />
                        </a>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col items-start gap-3 md:gap-4">
                    <div className="w-[380px] sm:w-[680px] md:w-[800px]">
                        <Image
                            src="/images/phase 2/business inquiries.png"
                            alt="Business Inquiries (we add this like we gonna got funding soon)"
                            className="w-full h-auto"
                            width={800}
                            height={200}
                        />
                    </div>
                    <a 
                        href="mailto:business@slafurrystudios.com" 
                        className="w-80 sm:w-[440px] md:w-[500px] hover:scale-105 transition-transform block origin-left"
                    >
                        <Image
                            src="/images/phase 2/business email.png"
                            alt="business@slafurrystudios.com"
                            className="w-full h-auto"
                            width={500}
                            height={100}
                        />
                    </a>
                </motion.div>

            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="absolute bottom-4 left-4 md:bottom-6 md:left-8 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-10 pointer-events-none"
            >
                <Image
                    src="/images/phase 2/zen was here.png"
                    alt="Zen Slafuraga WAS HERE"
                    fill
                    style={{ objectFit: "contain" }}
                />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="absolute bottom-0 right-2 md:right-8 w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 pointer-events-none"
            >
                <Image
                    src="/images/phase 2/sorry font.png"
                    alt="Sorry, we still not found a technology called font"
                    fill
                    style={{ objectFit: "contain", objectPosition: "bottom" }}
                />
            </motion.div>

        </main>
    );
}
