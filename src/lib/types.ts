export type InsumoCategoria =
  | "minibar"
  | "lenceria"
  | "limpieza"
  | "amenities"
  | "alimentos_bebidas";

export type InsumoSubcategoria = string;

export type UbicacionTipo = "almacen" | "lavanderia" | "piso" | "habitacion";

export type MovimientoTipo =
  | "entrada"
  | "salida"
  | "transferencia_entrada"
  | "transferencia_salida"
  | "ajuste"
  | "merma"
  | "consumo_minibar"
  | "dotacion";

export type AppRole =
  | "admin"
  | "gerencia"
  | "gobernanta"
  | "piso"
  | "almacen"
  | "frontdesk";

export interface Item {
  id: string;
  name: string;
  sku: string;
  category: InsumoCategoria;
  subcategory: InsumoSubcategoria | null;
  unit: string;
  cost: number;
  sale_price: number;
  provider: string | null;
  stock_min: number;
  stock_max: number;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  type: UbicacionTipo;
  parent_id: string | null;
  active: boolean;
}

export interface Room {
  id: string;
  number: string;
  room_type: string;
  floor: string;
  location_id: string | null;
  active: boolean;
}

export interface Movement {
  id: string;
  item_id: string;
  location_id: string | null;
  type: MovimientoTipo;
  quantity: number;
  motivo: string | null;
  reference: string | null;
  user_id: string | null;
  created_at: string;
}

export interface StockRow {
  item_id: string;
  location_id: string;
  quantity: number;
}

export interface Alert {
  id: string;
  type: string;
  item_id: string | null;
  location_id: string | null;
  nivel: "info" | "baja" | "media" | "critica";
  message: string;
  status: "activa" | "resuelta";
  created_at: string;
}

export interface AiUsageLog {
  id: string;
  feature: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_estimate: number | null;
  created_at: string;
}

export const CATEGORY_LABELS: Record<InsumoCategoria, string> = {
  minibar: "Minibar",
  lenceria: "Lencería",
  limpieza: "Limpieza",
  amenities: "Amenities",
  alimentos_bebidas: "Alimentos y Bebidas",
};

export const SUBCATEGORY_LABELS: Record<InsumoCategoria, string[]> = {
  minibar: ["Bebidas", "Snacks"],
  lenceria: ["Toallas", "Sábanas", "Fundas y almohadas", "Protectores"],
  limpieza: ["Químicos", "Consumibles", "Accesorios"],
  amenities: ["Higiene personal", "Artículos de habitación"],
  alimentos_bebidas: ["Alimentos", "Bebidas"],
};

export const UNIT_OPTIONS: Record<InsumoCategoria, string[]> = {
  minibar: ["unidad", "pack"],
  lenceria: ["unidad"],
  limpieza: ["litro", "kilogramo", "unidad", "pack"],
  amenities: ["unidad", "pack"],
  alimentos_bebidas: ["unidad", "pack", "litro"],
};

export const TYPE_LABELS: Record<MovimientoTipo, string> = {
  entrada: "Entrada",
  salida: "Salida",
  transferencia_entrada: "Transferencia (entrada)",
  transferencia_salida: "Transferencia (salida)",
  ajuste: "Ajuste",
  merma: "Merma",
  consumo_minibar: "Consumo minibar",
  dotacion: "Dotación",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrador",
  gerencia: "Gerencia",
  gobernanta: "Gobernanta",
  piso: "Personal de piso",
  almacen: "Almacén / Compras",
  frontdesk: "Recepción",
};

export const ROLE_COLORS: Record<AppRole, string> = {
  admin: "bg-violet-100 text-violet-800",
  gerencia: "bg-sky-100 text-sky-800",
  gobernanta: "bg-emerald-100 text-emerald-800",
  piso: "bg-amber-100 text-amber-800",
  almacen: "bg-rose-100 text-rose-800",
  frontdesk: "bg-teal-100 text-teal-800",
};
