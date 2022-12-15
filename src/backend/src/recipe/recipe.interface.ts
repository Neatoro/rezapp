import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
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
    @ValidateNested({ each: true })
    @Type(() => RecipeIngredient)
    ingredients: RecipeIngredient[];
}

class RecipeIngredient {
    @IsNotEmpty()
    @IsString()
    ingredient: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsString()
    @IsOptional()
    unit: string;
}
