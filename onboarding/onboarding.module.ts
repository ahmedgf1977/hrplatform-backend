import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Entity('onboarding')
export class OnboardingRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  employeeName: string;

  @Column()
  position: string;

  @Column()
  area: string;

  @Column({ type: 'enum', enum: ['zavix','adc'] })
  company: string;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  buddy: string;

  @Column({ default: 'preingreso' })
  stage: string;

  @Column({ type: 'jsonb', default: '{}' })
  completedTasks: Record<string, string[]>;

  @Column({ type: 'jsonb', default: '{}' })
  documents: Record<string, boolean>;

  @CreateDateColumn()
  createdAt: Date;
}

@Injectable()
export class OnboardingService {
  constructor(@InjectRepository(OnboardingRecord) private repo: Repository<OnboardingRecord>) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  findOne(id: number) { return this.repo.findOne({ where: { id } }); }

  create(data: Partial<OnboardingRecord>) { return this.repo.save(this.repo.create(data)); }

  async updateTask(id: number, stage: string, taskId: string, done: boolean) {
    const rec = await this.findOne(id);
    if (!rec) return null;
    const tasks = rec.completedTasks || {};
    const arr: string[] = tasks[stage] || [];
    if (done && !arr.includes(taskId)) arr.push(taskId);
    if (!done) tasks[stage] = arr.filter(t => t !== taskId);
    else tasks[stage] = arr;
    await this.repo.update(id, { completedTasks: tasks });
    return this.findOne(id);
  }

  async updateStage(id: number, stage: string) {
    await this.repo.update(id, { stage });
    return this.findOne(id);
  }
}

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private service: OnboardingService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id/task') updateTask(@Param('id') id: string, @Body() body: { stage: string; taskId: string; done: boolean }) {
    return this.service.updateTask(+id, body.stage, body.taskId, body.done);
  }
  @Put(':id/stage') updateStage(@Param('id') id: string, @Body() body: { stage: string }) {
    return this.service.updateStage(+id, body.stage);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([OnboardingRecord])],
  providers: [OnboardingService],
  controllers: [OnboardingController],
  exports: [OnboardingService],
})
export class OnboardingModule {}
