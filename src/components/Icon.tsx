const ICONS = {
  user: 'icon-user.webp',

  chat: 'icon-chat.webp',
  pencil: 'icon-pencil.webp',
  trash: 'icon-trash.webp',
  trashOpen: 'icon-trash-open.webp',
  search: 'icon-search.webp',
  bell: 'icon-bell.webp',
  bellRing: 'icon-bell-ring.webp',
  gear: 'icon-gear.webp',
} as const;

export type IconName = keyof typeof ICONS;

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
