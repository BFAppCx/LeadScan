import { ReactNode } from "react";

type SurfaceCardProps = {
  title?: string;
  children: ReactNode;
  accent?: boolean;
};

export function SurfaceCard({
  title,
  children,
  accent = false
}: SurfaceCardProps) {
  return (
    <section className={accent ? "surface-card surface-card-accent" : "surface-card"}>
      {title ? <h2 className="surface-card__title">{title}</h2> : null}
      {children}
    </section>
  );
}
