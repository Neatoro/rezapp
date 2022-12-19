import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientRequest } from './ingredient.interface';

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>
    ) {}

    async list(user: string) {
        return this.ingredientRepository.find({
            where: { user }
        });
    }

    async create(dto: CreateIngredientRequest, user: string) {
        return await this.ingredientRepository.save({
            name: dto.name,
            user
        });
    }
}
