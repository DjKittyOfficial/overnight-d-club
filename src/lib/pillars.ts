import { Feather, HeartHandshake, Infinity as InfinityIcon, Link2, Scale, Users, type LucideIcon } from "lucide-react";

export type Pillar = { n: string; name: string; line: string; body: string; icon: LucideIcon };

export const PILLARS: Pillar[] = [
  {
    n: "01",
    name: "Libertad",
    line: "La carretera nocturna no pide permiso.",
    body: "Cada miembro conserva su forma de ser, de conducir y de entender el motor. OverNight no uniforma a nadie: ofrece un lugar donde la libertad individual se vive con responsabilidad hacia los demás.",
    icon: Feather,
  },
  {
    n: "02",
    name: "Lealtad",
    line: "Quien está a tu lado, está a tu lado siempre.",
    body: "La lealtad es el vínculo que sostiene a la organización. Se demuestra con hechos: apoyando a los compañeros, respetando la palabra dada y protegiendo lo que se construye entre todos.",
    icon: Link2,
  },
  {
    n: "03",
    name: "Respeto",
    line: "Sin respeto, no hay motor que arranque.",
    body: "Respeto hacia cada miembro, hacia otras organizaciones y hacia la ciudad que compartimos. Las diferencias se resuelven con diálogo; la convivencia es innegociable.",
    icon: Scale,
  },
  {
    n: "04",
    name: "Personas",
    line: "Los coches nos reúnen. Las personas nos quedan.",
    body: "Los automóviles son el punto de encuentro, pero lo verdaderamente importante son quienes los conducen. Cada historia, cada voz y cada aportación cuentan dentro de OverNight.",
    icon: Users,
  },
  {
    n: "05",
    name: "Familia",
    line: "Una familia unida por los motores.",
    body: "OverNight es más que un grupo: es una familia elegida. Un espacio de confianza en el que se celebra lo bueno, se afronta lo difícil y nadie se queda atrás.",
    icon: HeartHandshake,
  },
  {
    n: "06",
    name: "Legado",
    line: "Lo que construimos hoy es lo que dejamos mañana.",
    body: "Cada encuentro, cada proyecto y cada nuevo miembro forma parte de algo que perdura. El legado de OverNight se escribe entre todos, noche tras noche.",
    icon: InfinityIcon,
  },
];
