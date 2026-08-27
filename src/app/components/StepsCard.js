function StepsCard({ icon: Icon, number, title, description }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center p-4 rounded-lg bg-(--background) shadow">
      <Icon size={32} color="var(--primary)" />
      <h3 className="mt-2 font-bold text-(--text) flex gap-4 items-center">
        {" "}
        <span className="bg-(--primary) text-(--white) flex items-center justify-center w-6 h-6 font-bold rounded-full p-1.5 text-xs">
          {number}
        </span>{" "}
        {title}
      </h3>
      <p className="mt-1 text-xs text-(--muted)">{description}</p>
    </div>
  );
}

export default StepsCard;
