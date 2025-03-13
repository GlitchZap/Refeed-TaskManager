import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '@/components/task-form';
import { TaskStatus } from '@/lib/types';

describe('TaskForm component', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders correctly for creating a new task', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('renders correctly for editing an existing task', () => {
    const initialData = {
      _id: '123',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };

    render(<TaskForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(<TaskForm {...defaultProps} />);

    // Try to submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits the form when inputs are valid', async () => {
    render(<TaskForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Task Description' } });

    // Select status from dropdown
    fireEvent.change(screen.getByLabelText(/status/i), { target: { value: TaskStatus.IN_PROGRESS } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Task Description',
        status: TaskStatus.IN_PROGRESS,
      });
    });
  });

  test('disables submit button when loading', () => {
    render(<TaskForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).toBeDisabled();
  });
});