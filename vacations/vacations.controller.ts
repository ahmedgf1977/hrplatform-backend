import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vacations')
@UseGuards(JwtAuthGuard)
export class VacationsController {
  constructor(private service: VacationsService) {}

  // GET /api/vacations?company=zavix
  @Get()
  findAll(@Query('company') company?: string) {
    return this.service.findAll(company);
  }

  // GET /api/vacations/employee/:employeeId
  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.service.findByEmployee(+employeeId);
  }

  // GET /api/vacations/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // POST /api/vacations
  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  // PATCH /api/vacations/:id/approve
  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.service.approve(+id, body.approvedBy);
  }

  // PATCH /api/vacations/:id/reject
  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() body: { approvedBy: string; rejectionReason?: string }) {
    return this.service.reject(+id, body.approvedBy, body.rejectionReason);
  }

  // DELETE /api/vacations/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
