function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="group flex flex-col items-center text-center gap-3 p-5 
                    rounded-2xl border border-(--border)/40 bg-(--bg)/70 backdrop-blur-sm 
                    shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                    landscape:sm:flex-row landscape:sm:text-left landscape:sm:items-start landscape:sm:gap-4
                    md:p-6"
    >
      <div className="shrink-0 rounded-xl p-3 bg-(--primary)/10">
        <Icon
          size={28}
          color="var(--primary)"
          aria-hidden="true"
          className="md:w-8 md:h-8"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-base md:text-lg text-(--text) leading-snug">
          {title}
        </h3>
        <p className="text-sm text-(--muted) leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
