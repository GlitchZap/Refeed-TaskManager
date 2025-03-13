"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Edit, Loader2, User, Calendar, Clock, Trash2, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

// Simple function to format time relative to now
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return "just now";
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  
  // Less than a month
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  
  // Less than a year
  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  
  // More than a year
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export default function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedPriority, setEditedPriority] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Build API URL with query parameters from the URL
      let apiUrl = '/tasks';
      const params = new URLSearchParams();
      
      // Get filter values from URL parameters
      const search = searchParams.get('search');
      const priority = searchParams.get('priority');
      const status = searchParams.get('status');
      
      if (search) params.append('search', search);
      if (priority) params.append('priority', priority);
      if (status) params.append('status', status);
      
      const queryString = params.toString();
      if (queryString) {
        apiUrl += `?${queryString}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchParams]); // Re-fetch when URL parameters change

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high': return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600 text-black';
      case 'low': return 'bg-emerald-500 hover:bg-emerald-600 text-black';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'completed': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'in-progress': return 'bg-violet-600 hover:bg-violet-700 text-white';
      case 'todo': return 'bg-sky-500 hover:bg-sky-600 text-white';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setEditedPriority(task.priority || 'medium');
    setEditedStatus(task.status || 'todo');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (e: React.MouseEvent, task: Task) => {
    // Stop propagation to prevent the edit modal from opening
    e.stopPropagation();
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTask) return;
    
    setIsUpdating(true);
    
    try {
      // Send update to the API
      const response = await fetch(`/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedTask.id,
          priority: editedPriority,
          status: editedStatus,
          action: 'update'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      
      // Update tasks with the updated task
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      // Close the modal
      setIsEditModalOpen(false);
      
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task. Please try again.");
      fetchTasks();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    setIsDeleting(true);
    
    try {
      // Send delete request to the API
      const response = await fetch(`/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedTask.id,
          action: 'delete'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove the task from the tasks array
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      
      // Close the modal
      setIsDeleteModalOpen(false);
      
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="mb-6 flex justify-end">
          <Link 
            href="/tasks/new" 
            className="flex items-center px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-md hover:from-fuchsia-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-fuchsia-500/30"
          >
            <Plus size={18} className="mr-2" /> New Task
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-5 border-0 shadow-lg bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-20 bg-gray-700" />
                  <Skeleton className="h-5 w-24 bg-gray-700" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Link 
          href="/tasks/new" 
          className="flex items-center px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-md hover:from-fuchsia-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-fuchsia-500/30"
        >
          <Plus size={18} className="mr-2" /> New Task
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <h3 className="text-2xl font-medium text-fuchsia-200 mb-2">No tasks found</h3>
            <p className="text-fuchsia-300/70">Create a new task to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <Card 
              key={task.id} 
              className="p-5 hover:shadow-xl transition-all duration-300 border-none shadow-lg bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg hover:from-gray-800 hover:to-gray-900"
              onClick={() => openEditModal(task)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-medium mb-2 text-white">{task.title}</h3>
                <div className="flex space-x-2">
                  <Edit size={18} className="text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={(e) => openDeleteModal(e, task)}
                    className="text-rose-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-gray-300 mb-4 line-clamp-3">{task.description}</p>
              )}
              <div className="flex justify-between items-center mt-4">
                <div className="space-x-2">
                  {task.priority && (
                    <Badge className={`${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  )}
                  {task.status && (
                    <Badge className={`${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-fuchsia-300/70">
                  {formatTimeAgo(task.createdAt)}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        {selectedTask && (
          <form onSubmit={handleUpdateTask} className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">{selectedTask.title}</h4>
              {selectedTask.description && (
                <p className="text-gray-400 text-sm mb-4">{selectedTask.description}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-priority" className="block text-sm font-medium text-fuchsia-200 mb-1">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                  className="w-full px-3 py-2 text-white bg-gray-800 border border-violet-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-fuchsia-200 mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-white bg-gray-800 border border-violet-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* Task metadata */}
            <div className="mt-6 pt-4 border-t border-violet-700/30 text-xs text-fuchsia-200/70 space-y-2">
              <div className="flex items-center">
                <User size={14} className="mr-2 text-fuchsia-400" /> 
                <span>Created by: {selectedTask.createdBy || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={14} className="mr-2 text-fuchsia-400" /> 
                <span>Created: {new Date(selectedTask.createdAt).toLocaleString()}</span>
              </div>
              {selectedTask.updatedAt && (
                <>
                  <div className="flex items-center">
                    <User size={14} className="mr-2 text-fuchsia-400" /> 
                    <span>Updated by: {selectedTask.updatedBy || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2 text-fuchsia-400" /> 
                    <span>Last updated: {new Date(selectedTask.updatedAt).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm bg-transparent border border-violet-600 text-violet-400 rounded-md hover:bg-violet-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-md hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-fuchsia-500/30"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Updating</span>
                  </div>
                ) : 'Update Task'}
              </button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Delete Task Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle size={20} />
              <h4 className="font-medium">Are you sure you want to delete this task?</h4>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-md border border-rose-500/20">
              <h4 className="font-medium text-white mb-1">{selectedTask.title}</h4>
              {selectedTask.description && (
                <p className="text-gray-400 text-sm">{selectedTask.description}</p>
              )}
            </div>
            
            <p className="text-rose-300/70 text-sm">
              This action cannot be undone. The task will be permanently removed.
            </p>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-md hover:from-rose-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-rose-500/30"
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Deleting</span>
                  </div>
                ) : 'Delete Task'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
