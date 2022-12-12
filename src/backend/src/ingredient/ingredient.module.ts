import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientController } from './ingredient.controller';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ingredient])],
    controllers: [IngredientController],
    providers: [IngredientService]
})
export class IngredientModule {}
