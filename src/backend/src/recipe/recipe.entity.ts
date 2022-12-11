import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => RecipeStep, (step) => step.recipe)
    steps: RecipeStep[];
}

@Entity()
export class RecipeStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.steps)
    recipe: Recipe;
}
