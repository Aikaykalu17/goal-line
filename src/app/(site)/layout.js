import Footer from "@/app/components/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <div className="w-full flex flex-col flex-1 gap-12">{children}</div>
      <Footer />
    </>
  );
}
