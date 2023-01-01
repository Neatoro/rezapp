import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum LabelColors {
    default = 'default',
    dark = 'dark',
    red = 'red',
    green = 'green',
    yellow = 'yellow',
    indigo = 'indigo',
    purple = 'purple',
    pink = 'pink'
}

export class CreateLabelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(LabelColors)
    @IsNotEmpty()
    color: LabelColors;
}
