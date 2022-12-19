import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authProviderClient = axios.create({
            baseURL: this.configService.get('AUTH_PROVIDER_BASE_URL'),
            headers: {
                cookie: request.headers['cookie'] || ''
            },
            validateStatus: () => true
        });

        const authProviderResponse = await authProviderClient.get('/profile');

        if (authProviderResponse.data.isAuthenticated) {
            request.user = authProviderResponse.data.user.sub;
            return true;
        }

        throw new UnauthorizedException();
    }
}
