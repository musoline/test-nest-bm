import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('name') prodName: string,
    @Body('category') prodCategory: string,
    @Body('price') prodPrice: number,
  ) {
    const id = await this.productsService.insertProduct(
      prodName,
      prodCategory,
      prodPrice,
    );
    return { id };
  }
  @Get('search')
  async searchByQuery(@Query() query: any) {
    const results = await this.productsService.searchByQuery(query);
    return results;
  }
  @Get()
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  getProduct(@Param('id') productId: string) {
    return this.productsService.getSingleProduct(productId);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body('name') prodName: string,
    @Body('category') prodCategory: string,
    @Body('price') prodPrice: number,
  ) {
    await this.productsService.updateProduct(
      productId,
      prodName,
      prodCategory,
      prodPrice,
    );
    return null;
  }

  @Delete(':id')
  removeProduct(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
