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

    @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes)
    @JoinTable()
    ingredients: Ingredient[];
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
