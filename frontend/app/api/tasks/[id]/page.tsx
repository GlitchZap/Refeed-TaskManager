"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetTaskByIdQuery, useDeleteTaskMutation } from '@/lib/store/api/apiSlice';
import { Button } from '@/components/ui/button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { SparklesCore } from '@/components/ui/sparkles';
import { TaskStatus } from '@/lib/types';

export default function TaskDetail() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: task, isLoading, isError } = useGetTaskByIdQuery(id);
  const [deleteTask] = useDeleteTaskMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDelete = async () => {
    try {
      await deleteTask(id).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'text-yellow-300';
      case TaskStatus.IN_PROGRESS:
        return 'text-blue-300';
      case TaskStatus.COMPLETED:
        return 'text-green-300';
      default:
        return 'text-gray-300';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isError || !task) {
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
          Task Details
        </h1>
        
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline">
              Back to Tasks
            </Button>
          </Link>
          <Link href={`/tasks/${id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Edit Task
            </Button>
          </Link>
        </div>
      </div>
      
      <GlassmorphismCard className="w-full max-w-3xl mx-auto">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} border border-current`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Description</h3>
              <p className="text-gray-200 whitespace-pre-line bg-gray-900/30 p-4 rounded-md border border-gray-800">
                {task.description}
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-400">
                <p>Created: {new Date(task.createdAt || '').toLocaleString()}</p>
                <p>Last Updated: {new Date(task.updatedAt || '').toLocaleString()}</p>
              </div>
              
              <div>
                {!showDeleteConfirm ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Task
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                    >
                      Confirm Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
    </div>
  );
}