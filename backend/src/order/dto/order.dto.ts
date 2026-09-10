import {
  IsEmail,
  IsArray,
  ArrayMinSize,
  IsString,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsUUID()
  film!: string;
  @IsString()
  session!: string;
  @IsString()
  daytime!: string;
  @IsOptional()
  @IsString()
  day?: string;
  @IsOptional()
  @IsString()
  time?: string;
  @IsInt()
  @Min(1)
  row!: number;
  @IsInt()
  @Min(1)
  seat!: number;
  @IsInt()
  @Min(0)
  price!: number;
}

export class CreateOrderDto {
  @IsEmail()
  email!: string;
  @IsString()
  phone!: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets!: TicketDto[];
}
