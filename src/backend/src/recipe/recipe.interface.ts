import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Recipe } from './recipe.entity';

export interface ListRecipesResponse {
    recipes: Recipe[];
}

export class CreateRecipeRequestDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsString({ each: true })
    @IsOptional()
    steps: string[];

    @IsOptional()
    ingredients: RecipeIngredient[];
}

class RecipeIngredient {
    @IsNotEmpty()
    ingredient: string;

    amount: number;

    unit: string;
}
