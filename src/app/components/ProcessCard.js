function ProcessCard({ icon: Icon, id, title, description, isLast }) {
  return (
    <div className="flex flex-row gap-4 md:flex-1 md:flex-col md:gap-5">
      <div className="flex flex-col items-center self-stretch md:w-full md:flex-row">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--primary)/10">
          <Icon size={26} color="var(--primary-dark)" aria-hidden="true" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-(--border) md:ml-3 md:h-px md:w-auto" />
        )}
      </div>

      <div className="flex flex-col gap-2 pb-8 md:pb-0">
        <div className="flex flex-row items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-[10px] font-bold text-(--white)">
            {id}
          </span>
          <h3 className="font-bold text-(--text)">{title}</h3>
        </div>
        <p className="text-xs leading-relaxed text-(--muted)">{description}</p>
      </div>
    </div>
  );
}

export default ProcessCard;
