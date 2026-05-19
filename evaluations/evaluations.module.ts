import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  employeeName: string;

  @Column()
  evaluatorName: string;

  @Column()
  period: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  score: number;

  @Column({ default: 'Pendiente' })
  status: string;

  @Column({ default: 'Desempeño 360°' })
  type: string;

  @Column({ nullable: true, type: 'text' })
  comments: string;

  @Column({ type: 'enum', enum: ['zavix','adc'], default: 'zavix' })
  company: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Injectable()
export class EvaluationsService {
  constructor(@InjectRepository(Evaluation) private repo: Repository<Evaluation>) {}
  findAll(company?: string) { return this.repo.find({ where: company ? { company } : {} }); }
  create(data: Partial<Evaluation>) { return this.repo.save(this.repo.create(data)); }
  async complete(id: number, score: number, comments: string) {
    await this.repo.update(id, { score, comments, status: 'Completado' });
    return this.repo.findOne({ where: { id } });
  }
}

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private service: EvaluationsService) {}
  @Get() findAll(@Query('company') company?: string) { return this.service.findAll(company); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id/complete') complete(@Param('id') id: string, @Body() body: { score: number; comments: string }) {
    return this.service.complete(+id, body.score, body.comments);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation])],
  providers: [EvaluationsService],
  controllers: [EvaluationsController],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
