import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientModule } from '../ingredient/ingredient.module';
import { RecipeController } from './recipe.controller';
import { Recipe, RecipeIngredient, RecipeStep } from './recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe, RecipeStep, RecipeIngredient])],
    controllers: [RecipeController],
    providers: [RecipeService]
})
export class RecipeModule {}
