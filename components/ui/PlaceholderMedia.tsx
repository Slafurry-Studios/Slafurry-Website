// Dipakai buat mengisi tempat aset asli (video montage, cover image, dst)
// yang belum ada. Sengaja dikasih label kecil biar jelas ini placeholder,
// bukan bug. Ganti ke <video>/<Image> asli begitu asetnya siap.

const PLACEHOLDER_GRADIENTS = [
  "from-emerald-700 via-neutral-900 to-neutral-950",
  "from-fuchsia-700 via-neutral-900 to-neutral-950",
  "from-amber-600 via-neutral-900 to-neutral-950",
  "from-sky-700 via-neutral-900 to-neutral-950",
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}

export function PlaceholderVideoBg({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradientFor(label)} blur-2xl scale-110 opacity-80 ${className}`}
      aria-hidden="true"
    />
  );
}

export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradientFor(label)} ${className}`}
    >
      <span className="px-3 text-center font-body text-xs font-medium text-white/70">
        {label}
      </span>
    </div>
  );
}
