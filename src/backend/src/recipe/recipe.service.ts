import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        return await this.recipeRepository.find();
    }

    async get(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOne({
            where: {
                id
            },
            relations: {
                steps: true
            }
        });

        return {
            ...recipe,
            steps: recipe.steps.sort((stepA, stepB) => stepA.order - stepB.order)
        };
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
