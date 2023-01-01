import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../auth/user.decorator';
import { CreateLabelDto } from './label.interface';
import { LabelService } from './label.service';

@Controller('/label')
export class LabelController {
    constructor(private readonly labelService: LabelService) {}

    @Get()
    async list(@User() user: string) {
        return {
            labels: await this.labelService.list(user)
        };
    }

    @Post()
    async create(@User() user: string, @Body() dto: CreateLabelDto) {
        return await this.labelService.create(user, dto);
    }
}
