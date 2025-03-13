import { NextResponse } from 'next/server';

// This would normally connect to a database
// Using a server-side variable as a temporary store
export const tasks = [
  {
    id: '1',
    title: 'Create project documentation',
    description: 'Write comprehensive documentation for the new project features',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2025-03-10T13:00:57.000Z', // Using a date close to current date
    createdBy: 'GlitchZap'
  },
  {
    id: '2',
    title: 'Design user interface mockups',
    description: 'Create mockups for the new dashboard components',
    priority: 'medium',
    status: 'todo',
    createdAt: '2025-03-09T13:00:57.000Z', // One day before
    createdBy: 'GlitchZap'
  },
  {
    id: '3',
    title: 'Optimize database queries',
    description: 'Review and optimize slow performing database queries',
    priority: 'low',
    status: 'completed',
    createdAt: '2025-03-08T13:00:57.000Z', // Two days before
    createdBy: 'GlitchZap'
  }
];

// Current date and time as provided by the user
const currentDateTime = '2025-03-11 13:00:57';
const currentDateTimeISO = new Date(currentDateTime).toISOString();
const currentUser = 'GlitchZap';

export async function GET(request: Request) {
  try {
    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search')?.toLowerCase();
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    
    // Filter tasks based on parameters
    let filteredTasks = [...tasks];
    
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) || 
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    // Sort by created date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Add a slight delay to simulate network latency (making it more realistic)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(filteredTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if this is a delete operation
    if (body.action === 'delete' && body.id) {
      const taskIndex = tasks.findIndex(task => task.id === body.id);
      
      if (taskIndex === -1) {
        return NextResponse.json(
          { message: `Task with ID ${body.id} not found` },
          { status: 404 }
        );
      }
      
      // Remove the task from the array
      tasks.splice(taskIndex, 1);
      
      // Add a slight delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return NextResponse.json(
        { message: `Task with ID ${body.id} successfully deleted` },
        { status: 200 }
      );
    }
    
    // Check if this is an update operation
    if (body.action === 'update' && body.id) {
      const taskIndex = tasks.findIndex(task => task.id === body.id);
      
      if (taskIndex === -1) {
        return NextResponse.json(
          { message: `Task with ID ${body.id} not found` },
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
        updatedAt: currentDateTimeISO,
        updatedBy: currentUser
      };
      
      // Replace the task in the array
      tasks[taskIndex] = updatedTask;
      
      // Add a slight delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return NextResponse.json(updatedTask);
    }
    
    // This is a create operation
    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { message: 'Title is required' }, 
        { status: 400 }
      );
    }
    
    // Create a new task
    const newTask = {
      id: Date.now().toString(), // Simple ID generation
      title: body.title.trim(),
      description: body.description || '',
      priority: body.priority || 'medium',
      status: body.status || 'todo',
      createdAt: currentDateTimeISO,
      createdBy: currentUser
    };
    
    // Add to our tasks array
    tasks.unshift(newTask); // Add to the beginning for immediate visibility
    
    // Add a slight delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(
      newTask,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing task:', error);
    return NextResponse.json(
      { message: 'Failed to process task' }, 
      { status: 500 }
    );
  }
}