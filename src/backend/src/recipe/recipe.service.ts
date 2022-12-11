import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Recipe, RecipeStep } from './recipe.entity';
import { CreateRecipeRequestDto } from './recipe.interface';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeStep)
        private readonly stepRepository: Repository<Recipe>
    ) {}

    async list(): Promise<Recipe[]> {
        const recipes = await this.recipeRepository.find({
            relations: {
                steps: true
            }
        });

        return recipes.map((recipe) => ({
            ...recipe,
            steps: recipe.steps.sort((stepA, stepB) => stepA.order - stepB.order)
        }));
    }

    async create(dto: CreateRecipeRequestDto): Promise<Recipe> {
        const steps = await Promise.all(
            dto.steps.map((step, index) =>
                this.stepRepository.save({ description: step, order: index })
            )
        );
        return await this.recipeRepository.save({
            name: dto.name,
            description: dto.description,
            steps: steps
        });
    }
}
