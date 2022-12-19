import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authProviderClient = axios.create({
            baseURL: this.configService.get('AUTH_PROVIDER_BASE_URL'),
            headers: {
                cookie: request.headers['cookie'] || ''
            },
            validateStatus: () => true
        });

        const authProviderResponse = await authProviderClient.get('/profile');

        return authProviderResponse.data.isAuthenticated;
    }
}
