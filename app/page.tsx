import Image from "next/image";
import centerImg from "@/public/images/text.png";
import bottomRightImg from "@/public/images/gato.png";

export default async function Home() {
    return (
        <main className="w-screen h-screen flex relative overflow-hidden">
            
            <div className="absolute inset-0 flex justify-center items-center">
                <div className="relative w-[800px] h-[500px] max-w-[90vw] max-h-[90vh]">
                    <Image 
                        src={centerImg}
                        alt="Main text"
                        fill
                        style={{ objectFit: "contain" }}
                        priority
                        placeholder="blur"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 right-4 md:right-16 w-64 h-64"> 
                <Image 
                    src={bottomRightImg}
                    alt="Gato"
                    fill
                    style={{ objectFit: "contain" }}
                />
            </div>

        </main>
    );
}