// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  private books: Book[] = [];
  private idCounter = 1;

  create(createBookDto: CreateBookDto): Book {
    const book: Book = {
      id: this.idCounter++,
      ...createBookDto,
      createdAt: new Date(),
    };
    this.books.push(book);
    return book;
  }

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book {
    const book = this.books.find(book => book.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  update(id: number, updateBookDto: UpdateBookDto): Book {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const updatedBook = {
      ...this.books[bookIndex],
      ...updateBookDto,
    };

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  remove(id: number): void {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    this.books.splice(bookIndex, 1);
  }
}