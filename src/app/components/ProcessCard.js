function ProcessCard({ icon: Icon, id, title, description }) {
  return (
    <div className="flex flex-row gap-4 md:flex md:flex-col ">
      <Icon size={50} color="var(--primary-dark)" aria-hidden="true" />
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-row items-center gap-2">
          <span className="bg-(--primary) text-(--white) flex items-center justify-center w-6 h-6 font-bold rounded-full p-1.5 text-xs">
            {id}
          </span>
          <h3 className="font-bold text-(--text)">{title}</h3>
        </div>
        <p className="text-xs text-(--muted)">{description}</p>
      </div>
    </div>
  );
}

export default ProcessCard;
