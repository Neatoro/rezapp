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

    @ValidateNested({ each: true })
    @Type(() => RecipeStep)
    @IsOptional()
    steps: RecipeStep[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RecipeIngredient)
    ingredients: RecipeIngredient[];
}

class RecipeStep {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}

class RecipeIngredient {

    @IsOptional()
    @IsString()
    id: string;

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
