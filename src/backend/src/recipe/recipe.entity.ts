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

    @Column({ default: false })
    image: boolean;

    @OneToMany(() => RecipeStep, (step) => step.recipe)
    steps: RecipeStep[];
}

@Entity()
export class RecipeStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column('int')
    order: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.steps)
    recipe: Recipe;
}
