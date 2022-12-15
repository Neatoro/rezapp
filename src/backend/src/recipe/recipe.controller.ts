import {
    Body,
    Controller,
    Get,
    Header,
    Param,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
    Response,
    Delete,
    NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Recipe } from './recipe.entity';
import {
    CreateRecipeRequestDto,
    ListRecipesResponse
} from './recipe.interface';
import { RecipeService } from './recipe.service';

@Controller('/recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Get()
    async list(): Promise<ListRecipesResponse> {
        return {
            recipes: await this.recipeService.list()
        };
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Recipe> {
        const recipe = await this.recipeService.get(id);
        if (recipe) {
            return recipe;
        } else {
            throw new NotFoundException();
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.recipeService.delete(id);
    }

    @Get(':id/image')
    @Header('content-type', 'image/jpeg')
    async getImage(@Param('id') id: string, @Response() res) {
        const image = await this.recipeService.getImage(id);
        res.end(image);
    }

    @Put(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        await this.recipeService.uploadImage(id, file.buffer);
    }

    @Post()
    async create(@Body() dto: CreateRecipeRequestDto): Promise<Recipe> {
        dto.steps = dto.steps || [];
        dto.ingredients = dto.ingredients || [];

        return this.recipeService.create(dto);
    }
}
