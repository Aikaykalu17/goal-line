function HighlightsCard({ icon: Icon, title, description }) {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-xl border-(--border)/40 bg-(--bg)/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1
                    landscape:sm:flex-row landscape:sm:items-center landscape:sm:gap-4
                    md:flex-col md:items-start"
    >
      <div className="shrink-0 rounded-xl p-3 bg-(--primary-dark)/10">
        <Icon
          size={28}
          color="var(--primary-dark)"
          aria-hidden="true"
          className="md:w-9 md:h-9"
        />
      </div>

      <div className="flex flex-col gap-1 landscape:sm:flex-1">
        <h3 className="font-semibold text-base md:text-lg text-(--text) leading-snug">
          {title}
        </h3>
        <p className="text-sm text-(--muted) leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default HighlightsCard;
