import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LabelController } from "./label.controller";
import { Label } from "./label.entity";
import { LabelService } from "./label.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Label])
    ],
    controllers: [LabelController],
    providers: [LabelService]
})
export class LabelModule {};