import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class BookService {

  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) { }

  // create book
  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const createdBook = await this.bookModel.create(createBookDto);
      return createdBook;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create the book: ${error.message}`);
    }
  }

// find all books
  async findAll(): Promise<Book[]> {
    const bookData = await this.bookModel.find().exec();
    if (bookData.length === 0) {
      throw new NotFoundException('No books found!');
    }
    return bookData;
  }

// find book by id  
  async findOne(id: string): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    try {
      const findBook = await this.bookModel.findById(id).exec();
      if (!findBook) {
        throw new NotFoundException(`Book #${id} not found`);
      }
      return findBook;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to find the book: ${error.message}`);
    }
  }

// update book by id
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    try {
      const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true });
      if (!updatedBook) {
        throw new NotFoundException(`Book #${id} not found`);
      }
      return updatedBook;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update the book: ${error.message}`);
    }
  }

// delete book by id
  async remove(id: string): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    try {
      const deletedBook = await this.bookModel.findByIdAndDelete(id);
      if (!deletedBook) {
        throw new NotFoundException(`Book #${id} not found`);
      }
      return deletedBook;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete the book: ${error.message}`);
    }
  }
}
