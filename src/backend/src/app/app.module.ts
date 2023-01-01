import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadDatabaseConfiguration } from '../database/config-loader';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientModule } from '../ingredient/ingredient.module';
import { Label } from '../label/label.entity';
import { LabelModule } from '../label/label.module';
import { Recipe, RecipeIngredient, RecipeStep } from '../recipe/recipe.entity';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            async useFactory() {
                const providedConfig = await loadDatabaseConfiguration();
                return {
                    ...providedConfig,
                    entities: [
                        Recipe,
                        RecipeStep,
                        RecipeIngredient,
                        Ingredient,
                        Label
                    ]
                };
            }
        }),
        RecipeModule,
        IngredientModule,
        LabelModule
    ]
})
export class AppModule {}
