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
    NotFoundException,
    UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipeOwnerGuard } from '../auth/recipe.guard';
import { User } from '../auth/user.decorator';
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
    async list(@User() user: string): Promise<ListRecipesResponse> {
        return {
            recipes: await this.recipeService.list(user)
        };
    }

    @Get(':id')
    @UseGuards(RecipeOwnerGuard)
    async get(@Param('id') id: string): Promise<Recipe> {
        const recipe = await this.recipeService.get(id);
        if (recipe) {
            return recipe;
        } else {
            throw new NotFoundException();
        }
    }

    @Delete(':id')
    @UseGuards(RecipeOwnerGuard)
    async delete(@Param('id') id: string) {
        await this.recipeService.delete(id);
    }

    @Get(':id/image')
    @UseGuards(RecipeOwnerGuard)
    @Header('content-type', 'image/jpeg')
    async getImage(@Param('id') id: string, @Response() res) {
        const image = await this.recipeService.getImage(id);
        res.end(image);
    }

    @Put(':id/image')
    @UseGuards(RecipeOwnerGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        await this.recipeService.uploadImage(id, file.buffer);
    }

    @Post()
    async create(
        @Body() dto: CreateRecipeRequestDto,
        @User() user: string
    ): Promise<Recipe> {
        dto.steps = dto.steps || [];
        dto.ingredients = dto.ingredients || [];

        return this.recipeService.create(dto, user);
    }

    @Put(':id')
    @UseGuards(RecipeOwnerGuard)
    async update(
        @Param('id') id: string,
        @Body() dto: CreateRecipeRequestDto
    ): Promise<Recipe> {
        dto.steps = dto.steps || [];
        dto.ingredients = dto.ingredients || [];

        return this.recipeService.update(id, dto);
    }
}
