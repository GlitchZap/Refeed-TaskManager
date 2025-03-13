import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async findAll(
    queryDto: QueryTaskDto,
  ): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    const { search, status, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const query: {
      $or?:
        | { title: { $regex: string; $options: string } }[]
        | { description: { $regex: string; $options: string } }[];
      status?: string;
    } = {};
    if (search) {
      query.$or = [{ description: { $regex: search, $options: 'i' } }];
    }

    if (status) {
      query.status = status;
    }

    const [tasks, total] = await Promise.all([
      this.taskModel.find(query).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    return {
      tasks,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
