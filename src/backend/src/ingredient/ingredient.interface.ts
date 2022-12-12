import { IsNotEmpty, IsString } from 'class-validator';
import { Ingredient } from './ingredient.entity';

export class CreateIngredientRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export interface ListIngredientResponse {
    ingredients: Ingredient[];
}
