import { Controller, Get } from "@nestjs/common";
import { User } from "../auth/user.decorator";
import { LabelService } from "./label.service";

@Controller('/label')
export class LabelController {

    constructor(private readonly labelService: LabelService) {}

    @Get()
    async list(@User() user: string) {
        return {
            labels: await this.labelService.list(user)
        };
    }

};