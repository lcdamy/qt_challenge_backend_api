import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, Length } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Length(4, 20)
    username: string;

    @Column()
    @Length(8, 100)
    password: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @CreateDateColumn()
    createdAt: Date;

}