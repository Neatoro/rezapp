import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Label } from "./label.entity";

@Injectable()
export class LabelService {

    constructor(@InjectRepository(Label) private readonly labelRepository: Repository<Label>) {}

    async list(user: string): Promise<Label[]> {
        return await this.labelRepository.find({
            where: {
                user
            }
        });
    }

}