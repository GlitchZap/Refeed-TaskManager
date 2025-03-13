import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../task.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Description must be at least 5 characters long' })
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.PENDING;
}
