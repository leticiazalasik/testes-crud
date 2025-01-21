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
        // Dados para criar um livro inicial
        const createBookDto: CreateBookDto = {
            title: 'Test Book',
            author: 'Test Author',
            price: 29.99,
        };

        // Criação de um livro para ser atualizado
        const createdBook = service.create(createBookDto);

        // Dados para atualização
        const updateBookDto: UpdateBookDto = {
            title: 'Updated Book', // Novo título
            author: 'Updated Author', // Novo autor
            price: 39.99, // Novo preço
        };

        // Chamada do método update no service
        const updatedBook = service.update(createdBook.id, updateBookDto);

        // Verificações para confirmar que o livro foi atualizado corretamente
        expect(updatedBook).toBeDefined(); // Verifica se o livro atualizado existe
        expect(updatedBook.id).toBe(createdBook.id); // O ID deve ser o mesmo do livro original
        expect(updatedBook.title).toBe(updateBookDto.title); // O título deve ser atualizado
        expect(updatedBook.author).toBe(updateBookDto.author); // O autor deve ser atualizado
        expect(updatedBook.price).toBe(updateBookDto.price); // O preço deve ser atualizado
        expect(updatedBook.createdAt).toEqual(createdBook.createdAt); // A data de criação não deve ser alterada
    });

    it('should throw NotFoundException if book does not exist', () => {
        // DTO com os dados de atualização
        const updateBookDto: UpdateBookDto = {
            title: 'Updated Book', // Novo título para o livro
        };

        // Tenta atualizar um livro que não existe (ID 999)
        expect(() =>
            service.update(999, updateBookDto),
        ).toThrow(NotFoundException); // Verifica se o erro NotFoundException é lançado
    });

    it('should update only provided fields', () => {
        // Criação inicial de um livro com todos os campos preenchidos
        const createBookDto: CreateBookDto = {
            title: 'Test Book',
            author: 'Test Author',
            price: 29.99,
        };
        const createdBook = service.create(createBookDto);

        // Dados para atualizar apenas o título
        const updateBookDto: UpdateBookDto = {
            title: 'Updated Book Title', // Atualiza somente o título
        };

        // Atualização do livro
        const updatedBook = service.update(createdBook.id, updateBookDto);

        // Verifica se apenas o campo título foi alterado
        expect(updatedBook.title).toBe(updateBookDto.title); // O título foi atualizado
        expect(updatedBook.author).toBe(createdBook.author); // O autor permaneceu inalterado
        expect(updatedBook.price).toBe(createdBook.price); // O preço permaneceu inalterado
    });
});



describe('remove', () => {
    it('should remove a book by id', () => {
      // Estado inicial
      service['books'] = [
        { id: 1, title: 'Book 1', author: 'George teste', price: 10.0 },
        { id: 2, title: 'Book 2', author: 'George teste', price: 10.0 },
      ];
  
      // Removendo o livro com id: 1
      service.remove(1);
  
      // Verificando que o livro com id: 1 foi removido
      expect(service['books']).not.toContainEqual({ id: 1, title: 'Book 1', author: 'George teste', price: 10.0 });
  
      // Verificando que os outros livros permanecem inalterados
      expect(service['books']).toContainEqual({ id: 2, title: 'Book 2', author: 'George teste', price: 10.0 });
    });
  
    it('should throw NotFoundException if book not found', () => {
        // Verificando o estado antes da remoção
        expect(service['books'].length).toBe(2); // Inicialmente, o array tem 2 livros
      
        // Verificando se a exceção é lançada
        expect(() => service.remove(999)).toThrow(NotFoundException);
      
        // O tamanho do array deve continuar o mesmo, já que a remoção falhou
        expect(service['books'].length).toBe(2); // O livro com id: 2 ainda está presente
      });
  });
})