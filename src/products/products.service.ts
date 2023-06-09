import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
  ) {}

  async insertProduct(name: string, category: string, price: number) {
    const newProduct = new this.ProductModel({ name, category, price });
    const res = await newProduct.save();
    return res.id as string;
  }

  async getProducts() {
    const products = await this.ProductModel.find().exec();
    return products.map((prod) => ({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
    }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
    };
  }

  async searchByQuery(query: any): Promise<Product[]> {
    let searchQuery = {};
    let priceRange = {};
    console.log(query);
    if (query.category) {
      searchQuery = { ...searchQuery, category: query.category };
    }
    if (query.name) {
      searchQuery = { ...searchQuery, name: query.name };
    }
    if (query.minPrice) {
      priceRange = { ...priceRange, $gte: query.minPrice };
      searchQuery = {
        ...searchQuery,
        price: priceRange,
      };
    }
    if (query.maxPrice) {
      priceRange = { ...priceRange, $lte: query.maxPrice };
      searchQuery = {
        ...searchQuery,
        price: priceRange,
      };
    }
    return await this.ProductModel.find(searchQuery).exec();
  }

  async updateProduct(
    productId: string,
    name: string,
    category: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (name) {
      updatedProduct.name = name;
    }
    if (category) {
      updatedProduct.category = category;
    }
    if (price) {
      updatedProduct.price = price;
    }
    updatedProduct.save();
  }

  async deleteProduct(productId: string) {
    const result = await this.ProductModel.deleteOne({ _id: productId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product Not Found');
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.ProductModel.findById(id);
    } catch (error) {
      throw new NotFoundException();
    }

    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }
}
