function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-(--background) shadow">
      <Icon size={32} color="var(--primary)" aria-hidden="true" />
      <h3 className="mt-2 font-bold text-(--text)">{title}</h3>
      <p className="mt-1 text-sm text-(--muted)">{description}</p>
    </div>
  );
}

export default FeatureCard;
