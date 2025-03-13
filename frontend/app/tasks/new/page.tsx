"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTaskPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          status
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      // Redirect to the tasks page
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Tasks
        </Link>
        <h1 className="text-3xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">Create New Task</h1>
      </div>
      
      <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-fuchsia-300 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-3 py-2 text-white bg-gray-800 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-fuchsia-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              className="w-full px-3 py-2 text-white bg-gray-800 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-fuchsia-300 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-800 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-fuchsia-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-800 border border-violet-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm bg-transparent border border-violet-600 text-violet-400 rounded-md hover:bg-violet-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-md hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-fuchsia-500/30"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Creating</span>
                </div>
              ) : 'Create Task'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}