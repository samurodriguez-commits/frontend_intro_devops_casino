export interface Usuario {
  id: number;
  username: string;
  email: string;
  saldo: number;
  rol: 'jugador' | 'admin';
  creado_en?: string;
}

export interface RespuestaAuth {
  usuario: Usuario;
  token: string;
}

export interface Juego {
  id: number;
  codigo: 'slots' | 'roulette' | 'blackjack';
  nombre: string;
  descripcion: string;
  apuesta_min: number;
  apuesta_max: number;
}

export interface Transaccion {
  id: number;
  tipo: 'apuesta' | 'premio' | 'deposito' | 'retiro' | 'ajuste';
  monto: number;
  saldo_post: number;
  juego?: string | null;
  detalle?: any;
  creada_en: string;
}

// ----- Slots -----
export interface ResultadoSlots {
  rodillos: string[];
  apuesta: number;
  premio: number;
  multiplicador: number;
  tipo: 'tres-iguales' | 'dos-iguales' | 'perdida';
  neto: number;
}

// ----- Ruleta -----
export type ColorRuleta = 'rojo' | 'negro' | 'verde';
export interface ApuestaRuleta {
  tipo: 'numero' | 'color' | 'paridad' | 'docena';
  valor: string | number;
  monto: number;
  gana?: boolean;
  retorno?: number;
}
export interface ResultadoRuleta {
  numero: number;
  color: ColorRuleta;
  apuestas: ApuestaRuleta[];
  totalApostado: number;
  totalRetornado: number;
  neto: number;
}

// ----- Blackjack -----
export interface Carta { valor: string; palo: string; oculta?: boolean; }
export interface EstadoBlackjack {
  sesionId: number;
  jugador: Carta[];
  banca: Carta[];
  apuesta: number;
  terminada: boolean;
  resultado: 'gana' | 'pierde' | 'empate' | 'blackjack' | null;
  retorno: number;
  totales: { jugador: number; banca: number } | null;
  saldo: number;
}
