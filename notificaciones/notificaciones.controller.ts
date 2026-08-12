import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionDto } from './notificacion.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // Para probar que el endpoint está vivo
  @Get()
  ping() {
    return { status: 'OK', msg: 'Mesa de Ayuda TI — servicio de correo activo (NestJS)' };
  }

  // Este es el que llama sendViaGAS() desde el frontend
  @Post()
  async recibir(@Body() body: NotificacionDto) {
    return this.notificacionesService.enviar(body);
  }
}
