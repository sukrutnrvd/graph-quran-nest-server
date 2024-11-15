import { ConfigModule } from '@nestjs/config';
import { ContainResponseDto } from './dtos/contain-response.dto';
import { GetContainDto } from './dtos/get-contain.dto';
import { Neo4jModule } from '../neo4j/neo4j.module';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { VerseController } from './verse.controller';
import { VerseRepository } from './verse.repository';
import { VerseService } from './verse.service';

describe('VerseController', () => {
  let verseController: VerseController;
  let verseService: VerseService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [Neo4jModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [VerseController],
      providers: [VerseService, VerseRepository],
      exports: [VerseService],
    }).compile();
    verseController = moduleRef.get(VerseController);
    verseService = moduleRef.get(VerseService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  describe('contains', () => {
    it('should return correct root,surah and verse for requested one root', async () => {
      jest.spyOn(verseService, 'getContain').mockImplementation(() => {
        const response = new ContainResponseDto();
        response.roots = [
          {
            rootId: '1641',
            root: ' سوح',
            transliteration: 'swH',
            elementId: '4:b5cfc258-7b3f-4563-bf3b-09ba89001793:1640',
          },
        ];
        response.surah = 37;
        response.verse = 177;
        return Promise.resolve([response]);
      });
      const data = await verseController.contain({ roots: [1641] });

      expect(data[0].surah).toBe(37);
      expect(data[0].verse).toBe(177);
      expect(data[0].roots[0].rootId).toBe('1641');
    });

    it('should return correct surah and verse for requested multiple roots', async () => {
      jest.spyOn(verseService, 'getContain').mockImplementation(() => {
        const response = new ContainResponseDto();
        response.roots = [];
        response.surah = 37;
        response.verse = 3;
        return Promise.resolve([response]);
      });

      const data = await verseController.contain({ roots: [1, 2] });
      expect(data[0].surah).toBe(37);
      expect(data[0].verse).toBe(3);
    });

    it("should return 'Roots should be defined' if no roots parameters given", async () => {
      try {
        await validationPipe.transform(
          {},
          {
            type: 'body',
            metatype: GetContainDto,
          },
        );
      } catch (error) {
        expect(error.getResponse().message[0]).toBe('Roots should be defined');
      }
    });

    it("should return 'Roots should not be empty' if roots length is 0", async () => {
      try {
        await validationPipe.transform(
          { roots: [] },
          {
            type: 'body',
            metatype: GetContainDto,
          },
        );
      } catch (error) {
        expect(error.getResponse().message[0]).toBe(
          'Roots should not be empty',
        );
      }
    });

    it("should return 'All roots's elements must be unique' if roots is not unique", async () => {
      try {
        await validationPipe.transform(
          { roots: [1, 1] },
          {
            type: 'body',
            metatype: GetContainDto,
          },
        );
      } catch (error) {
        expect(error.getResponse().message[0]).toBe(
          "All roots's elements must be unique",
        );
      }
    });

    it("should return 'Roots must contain no more than 10 elements' if roots length more than 10", async () => {
      try {
        await validationPipe.transform(
          { roots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
          {
            type: 'body',
            metatype: GetContainDto,
          },
        );
      } catch (error) {
        expect(error.getResponse().message[0]).toBe(
          'Roots must contain no more than 10 elements',
        );
      }
    });

    it("should return 'Roots should be an array of numbers' if roots not number", async () => {
      try {
        await validationPipe.transform(
          { roots: ['notNumber'] },
          {
            type: 'body',
            metatype: GetContainDto,
          },
        );
      } catch (error) {
        expect(error.getResponse().message[0]).toBe(
          'Roots should be an array of numbers',
        );
      }
    });
  });
});
