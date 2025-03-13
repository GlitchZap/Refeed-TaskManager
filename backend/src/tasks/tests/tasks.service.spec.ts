import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from '../tasks.service';
import { Task, TaskStatus } from '../task.schema';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

const mockTask = {
  _id: 'some-id',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
};

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<Task>;

  const mockTaskModel = {
    new: jest.fn().mockResolvedValue(mockTask),
    constructor: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<Task>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.PENDING,
      };

      jest.spyOn(mockTaskModel, 'save').mockResolvedValueOnce(mockTask);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks and count', async () => {
      const tasks = [mockTask];
      const count = 1;

      jest.spyOn(model, 'find').mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(tasks),
          }),
        }),
      } as any);

      jest.spyOn(model, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValue(count),
      } as any);

      const result = await service.findAll({});

      expect(result.tasks).toEqual(tasks);
      expect(result.total).toEqual(count);
    });
  });

  describe('findOne', () => {
    it('should find and return a task by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTask),
      } as any);

      const result = await service.findOne('some-id');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
