import { Controller, Get } from '@nestjs/common';
import { ListRecipesResponse } from './recipe.interface';
import { RecipeService } from './recipe.service';

@Controller('/recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    async list(): Promise<ListRecipesResponse> {
        return {
            recipes: await this.recipeService.list(),
        };
    }
}
