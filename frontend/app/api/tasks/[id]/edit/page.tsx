'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '@/lib/store/api/apiSlice';
import TaskForm from '@/components/task-form';
import { Button } from '@/components/ui/button';

export default function EditTask() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: task, isLoading: isLoadingTask } = useGetTaskByIdQuery(id);
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  
  const handleSubmit = async (data: { title: string; description: string }) => {
    try {
      await updateTask({ id, task: data }).unwrap();
      router.push(`/tasks/${id}`);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };
  
  if (isLoadingTask) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="p-10 text-center bg-red-900/20 rounded-lg border border-red-900/50">
        <h3 className="text-xl font-medium text-red-300">Error loading task</h3>
        <p className="mt-2 text-red-400">The requested task could not be found or there was an error loading it.</p>
        <Link href="/" className="mt-4 inline-block">
          <Button>
            Back to Tasks
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text">
          Edit Task
        </h1>
        
        <div className="flex gap-3">
          <Link href={`/tasks/${id}`}>
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
      
      <TaskForm 
        initialData={task} 
        onSubmit={handleSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  );
}