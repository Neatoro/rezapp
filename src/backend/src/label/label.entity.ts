import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Label {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    color: string;

    @Column()
    user: string;
}
