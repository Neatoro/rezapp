import { IsNotEmpty, IsString } from 'class-validator';
import { Recipe } from './recipe.entity';

export interface ListRecipesResponse {
    recipes: Recipe[];
}

export class CreateRecipeRequestDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsString({ each: true })
    steps: string[] = [];
}
