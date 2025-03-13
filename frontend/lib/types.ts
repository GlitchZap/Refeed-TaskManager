export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
  }
  
  export interface Task {
    _id?: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt?: string;
    updatedAt?: string;
  }