import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { RecipeService } from '../recipe/recipe.service';

@Injectable()
export class RecipeOwnerGuard implements CanActivate {
    constructor(private readonly recipeService: RecipeService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const id = request.params.id;

        const recipe = await this.recipeService.get(id);

        if (recipe && recipe.user === request.user) {
            return true;
        }

        throw new NotFoundException();
    }
}
