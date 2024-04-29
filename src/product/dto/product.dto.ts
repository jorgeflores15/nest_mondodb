import { Product } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsPrice } from '@nestjsi/class-validator';
import { IsNotEmpty, IsOptional } from 'class-validator';

export interface ProductPage {
  products: Product[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    nextPage: number;
    prevPage: number;
  };
}

export interface queryParamsProduct {
  search?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsPrice()
  price: number;
}

export class UpdateProductDto {
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  @IsPrice()
  price?: number;
}
