import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
    recipes: Recipe[];
}
