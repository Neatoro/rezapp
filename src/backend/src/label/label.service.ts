import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity';
import { CreateLabelDto } from './label.interface';

@Injectable()
export class LabelService {
    constructor(
        @InjectRepository(Label)
        private readonly labelRepository: Repository<Label>
    ) {}

    async list(user: string): Promise<Label[]> {
        return await this.labelRepository.find({
            where: {
                user
            }
        });
    }

    async create(user: string, dto: CreateLabelDto): Promise<Label> {
        return await this.labelRepository.save({
            name: dto.name,
            color: dto.color,
            user
        });
    }
}
