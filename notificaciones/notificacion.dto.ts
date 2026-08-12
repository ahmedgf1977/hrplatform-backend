export interface TicketPayload {
  folio?: string;
  titulo?: string;
  userEmail?: string;
  estado?: string;
  [key: string]: any;
}

export interface NotificacionDto {
  tipo: 'ticket_creado' | 'estado_cambiado' | 'comentario' | 'ticket_resuelto' | string;
  ticket: TicketPayload;
  estadoAnterior?: string;
  estadoNuevo?: string;
  comentario?: string;
  solucion?: string;
  [key: string]: any;
}
