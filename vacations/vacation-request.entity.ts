import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vacation_requests')
export class VacationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  employeeName: string;

  @Column({ type: 'enum', enum: ['Vacaciones','Licencia Médica','Permiso Personal','Maternidad/Paternidad','Duelo','Capacitación'] })
  type: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  workingDays: number;

  @Column({ type: 'enum', enum: ['Pendiente','Aprobado','Rechazado'], default: 'Pendiente' })
  status: string;

  @Column()
  reason: string;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ type: 'enum', enum: ['zavix','adc'] })
  company: string;

  @CreateDateColumn()
  createdAt: Date;
}
