import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard';

// Créer les fonctions mock avant de mocker le contexte
const mockDeleteTask = jest.fn();
const mockUpdateTask = jest.fn();

// Mock du contexte
jest.mock('../contexts/TaskContext', () => ({
  useTask: () => ({
    deleteTask: mockDeleteTask,
    updateTask: mockUpdateTask,
    users: [
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    ]
  })
}));

describe('TaskCard Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'todo',
    priority: 'high',
    assignedTo: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    mockDeleteTask.mockClear();
    mockUpdateTask.mockClear();
    mockOnEditTask.mockClear();
  });

  test('renders task details correctly', () => {
    render(<TaskCard task={mockTask} onEditTask={mockOnEditTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('Haute')).toBeInTheDocument();
  });

  test('calls onEditTask when edit button is clicked', () => {
    render(<TaskCard task={mockTask} onEditTask={mockOnEditTask} />);
    
    const editButton = screen.getByTitle('Modifier');
    fireEvent.click(editButton);
    
    expect(mockOnEditTask).toHaveBeenCalledWith(mockTask);
  });

  test('confirms before deleting a task', () => {
    // Mock de window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    render(<TaskCard task={mockTask} onEditTask={mockOnEditTask} />);
    
    const deleteButton = screen.getByTitle('Supprimer');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteTask).toHaveBeenCalledWith(mockTask.id);
    
    // Restaurer window.confirm
    window.confirm = originalConfirm;
  });

  test('updates task status when moved to a different column', () => {
    // Réinitialiser le mock pour ce test
    mockUpdateTask.mockClear();
    
    render(<TaskCard task={mockTask} onEditTask={mockOnEditTask} />);
    
    // Simuler le changement de statut
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'progress' } });
    
    expect(mockUpdateTask).toHaveBeenCalledWith(mockTask.id, { status: 'progress' });
  });
});
