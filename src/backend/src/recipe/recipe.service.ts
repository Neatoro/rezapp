import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>
    ) {}

    list(): Promise<Recipe[]> {
        return this.recipeRepository.find();
    }
}
