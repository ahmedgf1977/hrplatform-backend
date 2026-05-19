import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName1: string;

  @Column({ nullable: true })
  lastName2: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column()
  area: string;

  @Column({ type: 'enum', enum: ['zavix', 'adc'] })
  company: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'enum', enum: ['Activo', 'Baja', 'Suspendido'], default: 'Activo' })
  status: string;

  @Column()
  contractType: string;

  @Column()
  schedule: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, length: 18 })
  curp: string;

  @Column({ nullable: true, length: 13 })
  rfc: string;

  @Column({ nullable: true })
  imss: string;

  @Column({ nullable: true, length: 18 })
  clabe: string;

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  civilStatus: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  career: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
