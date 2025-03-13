import { NextRequest, NextResponse } from 'next/server';

// Import the tasks array from the parent route
// In a real app, this would be a database call
let tasks: { id: string; title?: string; description?: string; priority?: string; status?: string; updatedAt?: string }[] = [];

// Try to import tasks, but handle the case where it might not be available
try {
  const tasksModule = require('../route');
  tasks = tasksModule.tasks;
} catch (error) {
  console.error('Error importing tasks:', error);
  tasks = [];
}

// GET /api/tasks/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      return NextResponse.json(
        { message: `Task with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error(`Error getting task ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to get task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const body = await request.json();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { message: `Task with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Update only the fields that were provided
    const updatedTask = {
      ...tasks[taskIndex],
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.status !== undefined && { status: body.status }),
      updatedAt: new Date().toISOString() // Add an updatedAt timestamp
    };
    
    // Replace the task in the array
    tasks[taskIndex] = updatedTask;
    
    // Small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { message: `Task with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Remove the task from the array
    tasks.splice(taskIndex, 1);
    
    // Small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(
      { message: `Task with ID ${id} successfully deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}