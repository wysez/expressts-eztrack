import { join } from 'path';
import { DataSource } from 'typeorm';
import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
} from '@/core/config';
import { UserEntity } from '@/features/auth/auth.entity';
import { BudgetItemEntity } from '@/features/budget/budget.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: POSTGRES_HOST,
  port: +POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [UserEntity, BudgetItemEntity],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
});
