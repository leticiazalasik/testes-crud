// src/books/tests/books.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from '../books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        price: 29.99,
      };

      const book = service.create(createBookDto);

      expect(book).toEqual({
        id: expect.any(Number),
        ...createBookDto,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('findOne', () => {
    it('should return a book if it exists', () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        price: 29.99,
      };

      const createdBook = service.create(createBookDto);
      const foundBook = service.findOne(createdBook.id);

      expect(foundBook).toEqual(createdBook);
    });

    it('should throw NotFoundException if book does not exist', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', () => {
      const books = service.findAll();  // Aqui, você testaria a lógica da service.
      
      // Verifica se o retorno é um array
      expect(Array.isArray(books)).toBe(true);
      
      // Caso não haja livros, o array deve ser vazio
      if (books.length === 0) {
        expect(books.length).toBe(0);  // Espera um array vazio
      } else {
        // Caso haja livros, verifica se a quantidade é maior que 0
        expect(books.length).toBeGreaterThan(0);  // Se você tiver livros preexistentes ou mockados
  
        // Verifique se cada item na lista tem a estrutura esperada (por exemplo, se é um livro com título, autor, etc)
        books.forEach(book => {
          expect(book).toHaveProperty('title');
          expect(book).toHaveProperty('author');
          expect(book).toHaveProperty('price');
        });
      }
    });
  });

  describe('update', () => {
    it('should update a book if it exists', () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        price: 29.99,
      };

      // Criação de um livro para ser atualizado
      const createdBook = service.create(createBookDto);

      // Dados para atualização
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        price: 39.99,
      };

      // Chamada do método update
      const updatedBook = service.update(createdBook.id, updateBookDto);

      // Verificações
      expect(updatedBook).toBeDefined();
      expect(updatedBook.id).toBe(createdBook.id);
      expect(updatedBook.title).toBe(updateBookDto.title);
      expect(updatedBook.author).toBe(updateBookDto.author);
      expect(updatedBook.price).toBe(updateBookDto.price);
      expect(updatedBook.createdAt).toEqual(createdBook.createdAt);
    });

    it('should throw NotFoundException if book does not exist', () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };

      expect(() =>
        service.update(999, updateBookDto),
      ).toThrow(NotFoundException);
    });

    it('should update only provided fields', () => {
      // Primeiro criamos um livro
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        price: 29.99,
      };
      const createdBook = service.create(createBookDto);

      // Atualizamos apenas o título
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book Title',
      };

      const updatedBook = service.update(createdBook.id, updateBookDto);

      // Verificações
      expect(updatedBook.title).toBe(updateBookDto.title);
      expect(updatedBook.author).toBe(createdBook.author); // deve manter o valor original
      expect(updatedBook.price).toBe(createdBook.price); // deve manter o valor original
    });
  });
});
