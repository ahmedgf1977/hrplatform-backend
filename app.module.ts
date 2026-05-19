import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { VacationsModule } from './vacations/vacations.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { EvaluationsModule } from './evaluations/evaluations.module';

@Module({
  imports: [
    // Config global — lee variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // Base de datos PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // En producción cambiar a false después de primera carga
        ssl: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    EmployeesModule,
    VacationsModule,
    AnnouncementsModule,
    OnboardingModule,
    EvaluationsModule,
  ],
})
export class AppModule {}
