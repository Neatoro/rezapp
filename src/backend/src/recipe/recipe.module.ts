import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeController } from './recipe.controller';
import { Recipe } from './recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe])],
    controllers: [RecipeController],
    providers: [RecipeService]
})
export class RecipeModule {}
