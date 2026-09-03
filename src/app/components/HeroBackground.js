import Image from "next/image";

function HeroBackground({
  backgroundImage,
  priority = false,
  className = "",
  imagePosition = "center",
  children,
}) {
  return (
    <div
      className={`relative w-full py-8 aspect-video [@media(orientation:landscape)_and_(max-height:750px)]:h-[80vh] [@media(orientation:landscape)_and_(max-height:500px)]:gap-3 md:h-[40vh] lg:h-[90vh] ${className}`}
    >
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="100vw"
        style={{ objectPosition: imagePosition }}
        className="object-cover -z-10"
      />

      {children}
    </div>
  );
}

export default HeroBackground;
