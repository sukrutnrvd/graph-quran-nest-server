import { ConfigModule } from '@nestjs/config';
import { GetRelationsDto } from './dtos/get-relations.dto';
import { Neo4jModule } from '../neo4j/neo4j.module';
import { RelationsResponseDto } from './dtos/relations-response.dto';
import { RootController } from './root.controller';
import { RootRepository } from './root.repository';
import { RootService } from './root.service';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';

describe('rootController', () => {
  let rootController: RootController;
  let rootService: RootService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [Neo4jModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [RootController],
      providers: [RootService, RootRepository],
      exports: [RootService],
    }).compile();
    rootController = moduleRef.get(RootController);
    rootService = moduleRef.get(RootService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  describe('relations', () => {
    it('should return correct root,surah and verse for requested one root', async () => {
      jest.spyOn(rootService, 'getRelations').mockImplementation(() => {
        const response = new RelationsResponseDto();
        response.roots = [
          {
            rootId: '1641',
            root: ' سوح',
            transliteration: 'swH',
            elementId: '4:b5cfc258-7b3f-4563-bf3b-09ba89001793:1640',
          },
        ];
        response.verses = [{ surah: 37, verse: 177 }];
        return Promise.resolve(response);
      });
      const data = await rootController.relations({ roots: [1641] });

      expect(data.verses[0].surah).toBe(37);
      expect(data.verses[0].verse).toBe(177);
      expect(data.roots[0].rootId).toBe('1641');
    });

    it('should return correct surah and verse for requested multiple roots', async () => {
      jest.spyOn(rootService, 'getRelations').mockImplementation(() => {
        const response = new RelationsResponseDto();
        response.roots = [
          {
            rootId: '1',
            root: 'سمو',
            transliteration: 'smw',
            elementId: '4:bf9c53dc-3a4b-46a0-b014-e492fd29d86c:0',
          },
          {
            rootId: '52',
            root: 'ارض',
            transliteration: 'ArD',
            elementId: '4:bf9c53dc-3a4b-46a0-b014-e492fd29d86c:51',
          },
        ];
        response.verses = [{ surah: 2, verse: 22 }];
        return Promise.resolve(response);
      });

      const data = await rootController.relations({ roots: [1, 52] });
      expect(data.verses[0].surah).toBe(2);
      expect(data.verses[0].verse).toBe(22);
      expect(data.roots[0].rootId).toBe('1');
      expect(data.roots[1].rootId).toBe('52');
    });

    it("should return 'Roots should be defined' if no roots parameters given", async () => {
      try {
        await validationPipe.transform(
          {},
          {
            type: 'body',
            metatype: GetRelationsDto,
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
            metatype: GetRelationsDto,
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
            metatype: GetRelationsDto,
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
            metatype: GetRelationsDto,
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
            metatype: GetRelationsDto,
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
