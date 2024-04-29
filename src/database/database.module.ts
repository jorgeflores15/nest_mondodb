import { Module } from '@nestjs/common';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const options: MongoClientOptions = {};

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const client = new MongoClient(
          process.env.DB_CONNECTION_STRING,
          options,
        );
        await client.connect();
        return client.db(process.env.DB_NAME);
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
