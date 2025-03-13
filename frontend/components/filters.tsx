"use client";

import React, { useState } from 'react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Filters() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string with the filters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status);
    
    // Update the URL with the filter parameters
    const queryString = params.toString();
    
    // Use the API route with the filters
    // This will trigger a page refresh with the new filters
    if (queryString) {
      router.push(`/?${queryString}`);
    } else {
      router.push('/');
    }
    
    // Also refresh the page to apply filters
    router.refresh();
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setPriority('');
    setStatus('');
    router.push('/');
    router.refresh();
  };

  return (
    <GlassmorphismCard className="p-5">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:w-auto w-full">
            <Select 
              value={priority} 
              onValueChange={setPriority}
              className="w-full sm:w-[130px]"
            >
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </Select>
            
            <Select 
              value={status} 
              onValueChange={setStatus}
              className="w-full sm:w-[130px]"
            >
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" className="flex gap-2 items-center">
            <Filter size={16} />
            Apply Filters
          </Button>
        </div>
      </form>
    </GlassmorphismCard>
  );
}