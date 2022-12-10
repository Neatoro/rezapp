import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeRequestDto } from './recipe.interface';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>
    ) {}

    list(): Promise<Recipe[]> {
        return this.recipeRepository.find();
    }

    create(dto: CreateRecipeRequestDto): Promise<Recipe> {
        return this.recipeRepository.save({
            name: dto.name,
            description: dto.description,
        });
    }
}
