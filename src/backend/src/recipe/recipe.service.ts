import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe, RecipeStep } from './recipe.entity';
import { CreateRecipeRequestDto } from './recipe.interface';
import { writeFile, readFile, access, rm } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeStep)
        private readonly stepRepository: Repository<Recipe>
    ) {}

    async list(): Promise<Recipe[]> {
        return await this.recipeRepository.find();
    }

    async get(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOne({
            where: {
                id
            },
            relations: {
                steps: true,
                ingredients: true
            }
        });

        return {
            ...recipe,
            steps: recipe.steps.sort(
                (stepA, stepB) => stepA.order - stepB.order
            )
        };
    }

    async create(dto: CreateRecipeRequestDto): Promise<Recipe> {
        const steps = await Promise.all(
            dto.steps.map((step, index) =>
                this.stepRepository.save({ description: step, order: index })
            )
        );
        return await this.recipeRepository.save({
            name: dto.name,
            description: dto.description,
            steps: steps,
            ingredients: dto.ingredients.map((ingredient) => ({
                id: ingredient
            }))
        });
    }

    async delete(id: string) {
        await this.recipeRepository.delete(id);
        try {
            await access(this.getImagePath(id));
            await rm(this.getImagePath(id));
        } catch {}
    }

    async uploadImage(id: string, file: Buffer) {
        await writeFile(this.getImagePath(id), file);
        const template = await this.recipeRepository.findOne({ where: { id } });
        template.image = true;
        await this.recipeRepository.save(template);
    }

    async getImage(id: string) {
        const file = await readFile(this.getImagePath(id));
        return file;
    }

    private getImagePath(id: string) {
        return resolve(process.cwd(), 'images', id);
    }
}
