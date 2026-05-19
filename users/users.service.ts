import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findAll() {
    return this.repo.find({ select: { id:true, name:true, email:true, role:true, company:true, active:true, lastLogin:true, createdAt:true } });
  }

  async create(data: Partial<User>) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.repo.create({ ...data, password: hashed });
    return this.repo.save(user);
  }

  async updateLastLogin(id: number) {
    await this.repo.update(id, { lastLogin: new Date() });
  }

  async seedAdmins() {
    const admins = [
      { name:'Brenda Álvarez', email:'brenda.alvarez@zavixbrands.com', password:'hrplatform2025', role:'admin',      company:'zavix' },
      { name:'Ahmed García',   email:'ahmed.garcia@zavixbrands.com',   password:'hrplatform2025', role:'superadmin', company:'zavix' },
    ];
    for (const admin of admins) {
      const exists = await this.findByEmail(admin.email);
      if (!exists) await this.create(admin);
    }
    console.log('✅ Usuarios admin creados');
  }
}
