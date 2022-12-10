import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadDatabaseConfiguration } from '../database/config-loader';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            async useFactory() {
                const providedConfig = await loadDatabaseConfiguration();
                return {
                    ...providedConfig,
                    entities: [Recipe],
                };
            },
        }),
        RecipeModule,
    ],
})
export class AppModule {}
