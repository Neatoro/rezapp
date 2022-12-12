import { Body, Controller, Get, Post } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import {
    CreateIngredientRequest,
    ListIngredientResponse
} from './ingredient.interface';
import { IngredientService } from './ingredient.service';

@Controller('/ingredient')
export class IngredientController {
    constructor(private readonly ingredientService: IngredientService) {}

    @Get()
    async list(): Promise<ListIngredientResponse> {
        return {
            ingredients: await this.ingredientService.list()
        };
    }

    @Post()
    async create(@Body() dto: CreateIngredientRequest): Promise<Ingredient> {
        return await this.ingredientService.create(dto);
    }
}
