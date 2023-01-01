import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

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

    @ManyToMany(() => Recipe, (recipe) => recipe.labels)
    recipes: Recipe[];
}
