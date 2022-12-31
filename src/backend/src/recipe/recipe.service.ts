import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Recipe, RecipeIngredient, RecipeStep } from './recipe.entity';
import { CreateRecipeRequestDto } from './recipe.interface';
import { writeFile, readFile, access, rm } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeStep)
        private readonly stepRepository: Repository<RecipeStep>,
        @InjectRepository(RecipeIngredient)
        private readonly recipeIngredientRepository: Repository<RecipeIngredient>
    ) {}

    async list(user: string, search: string): Promise<Recipe[]> {
        return await this.recipeRepository.find({
            where: {
                user,
                name: Like(`%${search}%`)
            }
        });
    }

    async get(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOne({
            where: {
                id
            },
            relations: ['steps', 'ingredients', 'ingredients.ingredient']
        });

        if (recipe) {
            return {
                ...recipe,
                steps: recipe.steps.sort(
                    (stepA, stepB) => stepA.rank - stepB.rank
                )
            };
        } else {
            return undefined;
        }
    }

    private async createRecipeIngredient({ ingredient, amount, unit }) {
        return await this.recipeIngredientRepository.save({
            ingredient: { id: ingredient },
            amount,
            unit
        });
    }

    async create(dto: CreateRecipeRequestDto, user: string): Promise<Recipe> {
        const steps = await Promise.all(
            dto.steps.map((step, index) =>
                this.stepRepository.save({ ...step, rank: index })
            )
        );

        const recipeIngredients = await Promise.all(
            dto.ingredients.map((recipeIngredient) =>
                this.createRecipeIngredient(recipeIngredient)
            )
        );

        return await this.recipeRepository.save({
            name: dto.name,
            description: dto.description,
            portions: dto.portions,
            steps: steps,
            ingredients: recipeIngredients,
            user
        });
    }

    async update(id: string, dto: CreateRecipeRequestDto): Promise<Recipe> {
        const dboRecipe = await this.recipeRepository.findOneBy({ id });
        if (!dboRecipe) {
            return undefined;
        }

        const steps = await Promise.all(
            dto.steps.map(async (step, index) => {
                if (step.id) {
                    const dboStep = await this.stepRepository.findOneBy({
                        id: step.id
                    });
                    dboStep.description = step.description;
                    dboStep.rank = index;
                    return await this.stepRepository.save(dboStep);
                } else {
                    return await this.stepRepository.save({
                        ...step,
                        rank: index
                    });
                }
            })
        );

        const recipeIngredients = await Promise.all(
            dto.ingredients.map(async (recipeIngredient) => {
                if (recipeIngredient.id) {
                    const dboRecipeIngredient =
                        await this.recipeIngredientRepository.findOne({
                            where: { id: recipeIngredient.id }
                        });
                    dboRecipeIngredient.amount = recipeIngredient.amount;
                    dboRecipeIngredient.unit = recipeIngredient.unit;
                    return this.recipeIngredientRepository.save(
                        dboRecipeIngredient
                    );
                } else {
                    return await this.createRecipeIngredient(recipeIngredient);
                }
            })
        );

        dboRecipe.name = dto.name;
        dboRecipe.description = dto.description;
        dboRecipe.steps = steps;
        dboRecipe.ingredients = recipeIngredients;
        dboRecipe.portions = dto.portions;

        return await this.recipeRepository.save(dboRecipe);
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
