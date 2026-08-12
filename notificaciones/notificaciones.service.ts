import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotificacionDto } from './notificacion.dto';

const ESTADO_LABEL: Record<string, string> = {
  nuevo: 'Nuevo',
  asignado: 'Asignado',
  proceso: 'En Atención',
  pausado: 'En Pausa',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // ahmed.garcia@zavixbrands.com
        pass: process.env.GMAIL_APP_PASSWORD, // los 16 caracteres, sin espacios
      },
    });
  }

  private construirMensaje(data: NotificacionDto) {
    const { tipo, ticket } = data;
    const eL = ESTADO_LABEL;

    const mensajes: Record<string, { principal: string; detalle: string; subject: string }> = {
      ticket_creado: {
        principal: 'Tu ticket fue registrado ✓',
        detalle:
          'Hemos recibido tu solicitud. El equipo de TI la atenderá a la brevedad según la prioridad asignada.',
        subject: `✓ Ticket registrado: ${ticket.folio} — ${ticket.titulo}`,
      },
      estado_cambiado: {
        principal: 'Tu ticket fue actualizado',
        detalle: 'El estado de tu solicitud cambió. Revisa los detalles a continuación.',
        subject: `[Actualización] ${ticket.folio} — Estado: ${eL[data.estadoNuevo || ''] || data.estadoNuevo || ''}`,
      },
      comentario: {
        principal: 'Ahmed García respondió tu ticket',
        detalle: 'El Gerente de TI agregó un comentario a tu solicitud. Revísalo a continuación.',
        subject: `[Respuesta] ${ticket.folio} — ${ticket.titulo}`,
      },
      ticket_resuelto: {
        principal: 'Tu ticket ha sido resuelto ✅',
        detalle: 'Tu solicitud fue atendida. Si el problema persiste puedes reabrirlo desde el portal.',
        subject: `✅ Resuelto: ${ticket.folio} — ${ticket.titulo}`,
      },
    };

    const m = mensajes[tipo] || {
      principal: 'Notificación de tu ticket',
      detalle: '',
      subject: `Mesa de Ayuda TI — ${ticket.folio}`,
    };

    let body = `${m.principal}\n\n`;
    if (data.estadoNuevo) {
      body += `Estado anterior: ${eL[data.estadoAnterior || ''] || data.estadoAnterior || '—'}\n`;
      body += `Nuevo estado: ${eL[data.estadoNuevo] || data.estadoNuevo}\n\n`;
    }
    if (data.comentario) body += `Comentario de Ahmed García (Gerente TI):\n${data.comentario}\n\n`;
    if (data.solucion) body += `Solución aplicada:\n${data.solucion}\n\n`;
    body += m.detalle;
    body += '\n\n———————————\n';
    body += `Folio: ${ticket.folio || ''}\n`;
    body += `Título: ${ticket.titulo || ''}\n`;
    body += `Estado actual: ${eL[ticket.estado || ''] || ticket.estado || ''}\n`;
    body += 'Portal: https://soporte.zavixbrands.com';

    return { subject: m.subject, body };
  }

  async enviar(data: NotificacionDto): Promise<{ ok: boolean; error?: string; enviado_a?: string }> {
    try {
      if (!data.ticket || !data.ticket.userEmail) {
        throw new Error('El ticket no tiene userEmail');
      }
      const { subject, body } = this.construirMensaje(data);

      await this.transporter.sendMail({
        from:
          '"Mesa de Ayuda TI — Zavix Brands" <' +
          (process.env.GMAIL_FROM_ALIAS || process.env.GMAIL_USER) +
          '>',
        replyTo: process.env.GMAIL_FROM_ALIAS || process.env.GMAIL_USER,
        to: data.ticket.userEmail,
        subject,
        text: body,
      });

      return { ok: true, enviado_a: data.ticket.userEmail };
    } catch (err: any) {
      this.logger.error('Error enviando notificación', err);
      return { ok: false, error: err.message };
    }
  }
}
