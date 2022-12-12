import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadDatabaseConfiguration } from '../database/config-loader';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientModule } from '../ingredient/ingredient.module';
import { Recipe, RecipeStep } from '../recipe/recipe.entity';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            async useFactory() {
                const providedConfig = await loadDatabaseConfiguration();
                return {
                    ...providedConfig,
                    entities: [Recipe, RecipeStep, Ingredient]
                };
            }
        }),
        RecipeModule,
        IngredientModule
    ]
})
export class AppModule {}
