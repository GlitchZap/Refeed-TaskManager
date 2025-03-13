import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TaskStatus, Task } from '@/lib/types';
import { Button } from './ui/button';
import { GlassmorphismCard } from './ui/glassmorphism-card';
import { SparklesCore } from './ui/sparkles';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Task) => void;
  isLoading: boolean;
}

const schema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(5, 'Description must be at least 5 characters'),
  status: yup.string().oneOf(Object.values(TaskStatus), 'Please select a valid status').required('Status is required'),
});

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: '',
      description: '',
      status: TaskStatus.PENDING,
    },
  });

  return (
    <GlassmorphismCard className="w-full max-w-2xl mx-auto">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              placeholder="Task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              {...register('description')}
              className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              placeholder="Task description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value={TaskStatus.PENDING}>Pending</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            >
              {initialData ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
      
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleColor="#ffffff"
        particleCount={15}
        className="absolute inset-0 z-0"
      />
    </GlassmorphismCard>
  );
};

export default TaskForm;