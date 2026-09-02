export default function Spinner({
  label = "Loading",
  fullScreen = false,
  variant = "default",
}) {
  const isFullScreen = fullScreen;
  const isInnerPage = variant === "inner-page";

  return (
    <div
      className={
        isFullScreen
          ? "flex min-h-screen w-full items-center justify-center bg-[#f3f4f3]"
          : isInnerPage
            ? "flex w-full min-h-[220px] items-center justify-center rounded-2xl border border-gray-200 bg-white/80 py-8"
            : "flex w-full min-h-[180px] items-center justify-center rounded-xl bg-[#f3f4f3]/60 py-6"
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={
            isFullScreen
              ? "relative h-20 w-20"
              : isInnerPage
                ? "relative h-14 w-14"
                : "relative h-14 w-14"
          }
        >
          <div
            className={
              isFullScreen
                ? "absolute inset-0 rounded-full border-4 border-[#dfeae5]"
                : "absolute inset-0 rounded-full border-3 border-[#dfeae5]"
            }
          />
          <div
            className={
              isFullScreen
                ? "absolute inset-1 rounded-full border-4 border-transparent border-t-[var(--forest)] border-r-[#67c5a4] animate-spin"
                : "absolute inset-1 rounded-full border-3 border-transparent border-t-[var(--forest)] border-r-[#67c5a4] animate-spin"
            }
          />
          <div
            className={
              isFullScreen
                ? "absolute inset-4 rounded-full bg-[#ebf5f0] shadow-[0_0_35px_rgba(11,82,62,0.18)]"
                : "absolute inset-3 rounded-full bg-[#ebf5f0] shadow-[0_0_22px_rgba(11,82,62,0.16)]"
            }
          />
          <div
            className={
              isFullScreen
                ? "absolute inset-7 rounded-full bg-[var(--forest)] opacity-90"
                : "absolute inset-5 rounded-full bg-[var(--forest)] opacity-90"
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={
              isFullScreen
                ? "h-2.5 w-2.5 rounded-full bg-[var(--forest)] animate-bounce [animation-delay:-0.2s]"
                : "h-2 w-2 rounded-full bg-[var(--forest)] animate-bounce [animation-delay:-0.2s]"
            }
          />
          <span
            className={
              isFullScreen
                ? "h-2.5 w-2.5 rounded-full bg-[#5bbd96] animate-bounce [animation-delay:-0.1s]"
                : "h-2 w-2 rounded-full bg-[#5bbd96] animate-bounce [animation-delay:-0.1s]"
            }
          />
          <span
            className={
              isFullScreen
                ? "h-2.5 w-2.5 rounded-full bg-[#8ad5b2] animate-bounce"
                : "h-2 w-2 rounded-full bg-[#8ad5b2] animate-bounce"
            }
          />
        </div>

        <p
          className={
            isFullScreen
              ? "text-sm font-medium tracking-[0.18em] text-gray-500 uppercase"
              : isInnerPage
                ? "text-[10px] font-medium tracking-[0.18em] text-gray-500 uppercase"
                : "text-[10px] font-medium tracking-[0.18em] text-gray-500 uppercase"
          }
        >
          {label}
        </p>
      </div>
    </div>
  );
}
