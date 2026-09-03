import Image from "next/image";

function SectionBanner({ backgroundImage, children, priority = false }) {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[30vh] flex flex-col justify-start p-8 gap-6">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="100vw"
        className="object-cover -z-10"
      />

      <div className="w-[90%] mx-auto flex flex-col gap-4">{children}</div>
    </div>
  );
}

export default SectionBanner;
