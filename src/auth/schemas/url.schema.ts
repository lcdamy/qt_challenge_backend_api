import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { User } from './user.schema';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.urls)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ unique: true })
    short_code: string;

    @Column({ unique: true })
    @Length(10, 2048)
    @IsUrl()
    long_url: string;

    @Column({ default: 0 })
    clicks: number;

    @CreateDateColumn()
    createdAt: Date;
}