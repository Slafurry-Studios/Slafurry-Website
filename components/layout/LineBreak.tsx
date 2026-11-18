import Image from "next/image";

export function LineBreak() {
  return (
    <Image
      src="/Linebreak.png"
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      className="-mx-4 md:-mx-8 my-8 block h-1 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] max-w-none [image-rendering:pixelated]"
    />
  );
}
