import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['superadmin','admin','manager','colaborador','guest'], default: 'colaborador' })
  role: string;

  @Column({ type: 'enum', enum: ['zavix','adc'], default: 'zavix' })
  company: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  employeeId: number;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;
}
