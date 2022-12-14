import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Ingredient } from '../ingredient/ingredient.entity';

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ default: false })
    image: boolean;

    @OneToMany(() => RecipeStep, (step) => step.recipe)
    steps: RecipeStep[];

    @OneToMany(
        () => RecipeIngredient,
        (recipeIngredient) => recipeIngredient.recipe
    )
    ingredients: RecipeIngredient[];
}

@Entity()
export class RecipeStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column('int')
    order: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.steps, { onDelete: 'CASCADE' })
    recipe: Recipe;
}

@Entity()
export class RecipeIngredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column()
    unit: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
        onDelete: 'CASCADE'
    })
    recipe: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes, {
        onDelete: 'CASCADE'
    })
    ingredient: Ingredient;
}
