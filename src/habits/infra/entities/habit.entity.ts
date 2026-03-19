import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../users/infra/entities/user.entity';

export enum HabitFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum HabitDifficulty {
  EASY = 'EASY',     // XP baixo
  MEDIUM = 'MEDIUM', // XP médio
  HARD = 'HARD',     // XP alto
  EPIC = 'EPIC',     // XP muito alto
}

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: HabitFrequency,
    default: HabitFrequency.DAILY,
  })
  frequency: HabitFrequency;

  @Column({
    type: 'enum',
    enum: HabitDifficulty,
    default: HabitDifficulty.MEDIUM,
  })
  difficulty: HabitDifficulty;

  @Column({ default: 0 })
  streak: number; // Sequência atual de dias/vezes

  @Column({ default: 0 })
  total_xp: number; // XP total acumulado com este hábito

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => HabitLog, (log) => log.habit)
  logs: HabitLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('habit_logs')
export class HabitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date; // Data de conclusão

  @Column()
  xp_earned: number;

  @ManyToOne(() => Habit, (habit) => habit.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @CreateDateColumn({ name: 'created_at' })
  completedAt: Date;
}
