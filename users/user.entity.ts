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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;
}
