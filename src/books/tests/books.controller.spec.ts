// src/books/tests/books.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book } from '../entities/book.entity';
import { UpdateBookDto } from '../dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        price: 29.99,
      };

      const result = controller.create(createBookDto);

      expect(result).toEqual({
        id: expect.any(Number),
        ...createBookDto,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of books', () => {
        const result = controller.findAll();  // Testa o método findAll da controller, que deve chamar a service

        expect(Array.isArray(result)).toBe(true);
        // Caso seja necessário, você pode testar o conteúdo do array ou outras condições específicas
      });
    });
  
    
        describe('update', () => {
            it('should update a book', () => {
                const updateBookDto: UpdateBookDto = {
                    title: 'Updated Book',
                    author: 'Updated Author',
                    price: 39.99,
                };
    
                const mockUpdatedBook: Book = {
                    id: 1, // Agora é um número
                    title: 'Updated Book',
                    author: 'Updated Author',
                    price: 39.99,
                    createdAt: new Date(),
                };
    
                jest.spyOn(service, 'update').mockReturnValue(mockUpdatedBook);
    
                const result = controller.update('1', updateBookDto);
    
                expect(service.update).toHaveBeenCalledWith(1, updateBookDto);
                expect(result).toBe(mockUpdatedBook);
            });
        });
    });
