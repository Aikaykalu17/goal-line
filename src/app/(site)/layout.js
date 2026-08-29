import Footer from "@/app/components/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <main
        id="main-content"
        className="w-full flex gap-8 flex-col flex-1 mt-18"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
