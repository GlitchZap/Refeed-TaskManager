import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.schema';

export class QueryTaskDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
