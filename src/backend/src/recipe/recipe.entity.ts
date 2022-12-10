import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;
}
