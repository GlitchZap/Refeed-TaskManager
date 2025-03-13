'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TaskList from '@/components/task-list';
import Filters from '@/components/filters';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { Meteors } from '@/components/ui/meteors';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text">
            Task Management
          </h1>
          <p className="text-gray-400 mt-2">
            Organize, track, and manage your tasks efficiently
          </p>
        </div>
        
        <Link href="/tasks/new">
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
            Create New Task
          </Button>
        </Link>
      </div>
      
      {/* Hero section with animated meteors */}
      <div className="relative h-60 mb-12">
        <GlassmorphismCard className="h-full flex items-center justify-center">
          <div className="text-center z-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Streamline Your Workflow
            </h2>
            <p className="text-gray-300 max-w-lg mx-auto">
              Create, organize, and track your tasks with our intuitive task management system.
              Boost productivity and stay organized with powerful filtering and search capabilities.
            </p>
          </div>
          <Meteors />
        </GlassmorphismCard>
      </div>
      
      {/* Filters */}
      <Filters />
      
      {/* Task list */}
      <TaskList />
    </div>
  );
}