import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeIngredient } from '../recipe/recipe.entity';

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(
        () => RecipeIngredient,
        (recipeIngredient) => recipeIngredient.id
    )
    recipes: RecipeIngredient[];

    @Column()
    user: string;
}
