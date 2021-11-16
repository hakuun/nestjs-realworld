import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory() {
        return {
          uri: process.env.MONGODB_URI,
        };
      },
    }),
  ],
})
export class DbModule {}
