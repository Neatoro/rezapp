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

    list(): Promise<Recipe[]> {
        return this.recipeRepository.find({
            relations: {
                steps: true
            }
        });
    }

    async create(dto: CreateRecipeRequestDto): Promise<Recipe> {
        const steps = await Promise.all(
            dto.steps.map((step) =>
                this.stepRepository.save({ description: step })
            )
        );
        return await this.recipeRepository.save({
            name: dto.name,
            description: dto.description,
            steps: steps
        });
    }
}
