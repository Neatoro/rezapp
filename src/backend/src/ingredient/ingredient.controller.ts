import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../auth/user.decorator';
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
    async list(@User() user: string): Promise<ListIngredientResponse> {
        return {
            ingredients: await this.ingredientService.list(user)
        };
    }

    @Post()
    async create(
        @Body() dto: CreateIngredientRequest,
        @User() user: string
    ): Promise<Ingredient> {
        return await this.ingredientService.create(dto, user);
    }
}
