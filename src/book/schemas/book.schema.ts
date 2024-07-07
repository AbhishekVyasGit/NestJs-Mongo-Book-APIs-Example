import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    published: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);