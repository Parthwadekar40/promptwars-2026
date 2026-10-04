const ICONS = {
  user: 'icon-user.webp',
  trash: 'icon-trash.webp',
  gear: 'icon-gear.webp',
} as const;

type IconName = keyof typeof ICONS;

/** 3D iridescent icon set — consistent sizing via `size-*` classes, object-contain keeps scale honest. */
export function Icon({
  name,
  className = 'size-5',
  label,
}: {
  name: IconName;
  className?: string;
  label?: string;
}) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/img/${ICONS[name]}`}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 object-contain ${className}`}
    />
  );
}
