import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  ProductPage,
  UpdateProductDto,
  queryParamsProduct,
} from './dto/product.dto';
import { Collection, Db, ObjectId } from 'mongodb';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private readonly productCollection: Collection;

  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {    
     this.productCollection = this.db.collection('products');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.productCollection.insertOne(createProductDto);
  }


  async findAll(queryParams: queryParamsProduct): Promise<ProductPage> {
    const { search, page = 1, limit = 10, sortField, sortOrder } = queryParams;

    let filter: any = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const cursor = this.productCollection
      .find(filter)
      .skip((page - 1) * +limit)
      .limit(+limit);

    if (sortField && sortOrder) {
      const sort = {};
      sort[sortField] = sortOrder === 'asc' ? 1 : -1;
      cursor.sort(sort);
    }

    const documents = await cursor.toArray();
    const products: Product[] = documents.map(doc => ({
      _id: doc._id.toHexString(),
      name: doc.name,
      description: doc.description,
      price: doc.price
    }));
    const totalCount = await this.productCollection.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / +limit);
    const currentPage = +page || 1;

    return {
      products,
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
      }
    };
  }

  async findOne(id: string) {
    return await this.productCollection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productCollection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: updateProductDto },
    );
    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.productCollection.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });
  }
}
