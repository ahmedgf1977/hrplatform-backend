import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ════ ANNOUNCEMENTS ══════════════════════════════════════

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  author: string;

  @Column({ default: 'ambas' })
  target: string;

  @Column({ default: 'Normal' })
  priority: string;

  @Column({ default: 0 })
  readCount: number;

  @Column({ default: 0 })
  totalRecipients: number;

  @Column({ type: 'enum', enum: ['zavix','adc','ambas'], default: 'ambas' })
  company: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Injectable()
export class AnnouncementsService {
  constructor(@InjectRepository(Announcement) private repo: Repository<Announcement>) {}
  findAll(company?: string) {
    return this.repo.find({ where: company ? { company } : {}, order: { createdAt: 'DESC' } });
  }
  create(data: Partial<Announcement>) {
    return this.repo.save(this.repo.create(data));
  }
  async markRead(id: number) {
    const ann = await this.repo.findOne({ where: { id } });
    if (ann) await this.repo.update(id, { readCount: ann.readCount + 1 });
    return this.repo.findOne({ where: { id } });
  }
}

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private service: AnnouncementsService) {}
  @Get() findAll(@Query('company') company?: string) { return this.service.findAll(company); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id/read') markRead(@Param('id') id: string) { return this.service.markRead(+id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
