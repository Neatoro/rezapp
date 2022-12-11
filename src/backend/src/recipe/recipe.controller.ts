import { Body, Controller, Get, Post } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import {
    CreateRecipeRequestDto,
    ListRecipesResponse
} from './recipe.interface';
import { RecipeService } from './recipe.service';

@Controller('/recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    async list(): Promise<ListRecipesResponse> {
        return {
            recipes: await this.recipeService.list()
        };
    }

    @Post()
    async create(@Body() dto: CreateRecipeRequestDto): Promise<Recipe> {
        dto.steps = dto.steps || [];
        return this.recipeService.create(dto);
    }
}
