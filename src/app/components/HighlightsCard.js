function HighlightsCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col gap-2 shadow p-4">
      <Icon size={32} color="var(--primary-dark)" aria-hidden="true" />
      <h3 className="font-bold text-(--text)">{title}</h3>
      <p className="text-xs text-(--muted)">{description}</p>
    </div>
  );
}

export default HighlightsCard;
