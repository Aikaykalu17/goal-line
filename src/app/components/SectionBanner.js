function SectionBanner({ backgroundImage, children }) {
  return (
    <div
      className="w-full h-[40vh] md:h-[50vh] lg:h-[30vh] flex flex-col justify-start p-8 gap-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[90%] mx-auto flex flex-col gap-4">{children}</div>
    </div>
  );
}
export default SectionBanner;
