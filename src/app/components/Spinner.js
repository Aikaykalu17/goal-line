export default function Spinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f3]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#dfeae5]" />
          <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-var(--forest) border-r-[#67c5a4] animate-spin" />
          <div className="absolute inset-4 rounded-full bg-[#ebf5f0] shadow-[0_0_35px_rgba(11,82,62,0.18)]" />
          <div className="absolute inset-7 rounded-full bg-var(--forest) opacity-90" />
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-var(--forest) animate-bounce [animation-delay:-0.2s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#5bbd96] animate-bounce [animation-delay:-0.1s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8ad5b2] animate-bounce" />
        </div>

        <p className="text-sm font-medium tracking-[0.18em] text-gray-500 uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
