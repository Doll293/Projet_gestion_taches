import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import { TaskContext } from '../contexts/TaskContext';

describe('TaskCard', () => {
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockOnEditTask = jest.fn();

  const task = {
    id: '1',
    title: 'Test unitaire',
    description: 'Description de test',
    status: 'todo',
    priority: 'high',
    assignedTo: '42',
    createdAt: new Date().toISOString(),
  };

  const users = [
    { id: '42', name: 'Jean Dupont' },
    { id: '99', name: 'Autre Utilisateur' },
  ];

  const renderComponent = () => {
    return render(
      <TaskContext.Provider
        value={{
          updateTask: mockUpdateTask,
          deleteTask: mockDeleteTask,
          users,
        }}
      >
        <TaskCard task={task} onEditTask={mockOnEditTask} />
      </TaskContext.Provider>
    );
  };

  test('affiche le titre, la description, la priorité et l’utilisateur assigné', () => {
    renderComponent();

    expect(screen.getByText(/Test unitaire/i)).toBeInTheDocument();
    expect(screen.getByText(/Description de test/i)).toBeInTheDocument();
    expect(screen.getByText(/Haute/i)).toBeInTheDocument();
    expect(screen.getByText(/Jean Dupont/i)).toBeInTheDocument();
  });

  test('déclenche la fonction onEditTask au clic sur ✏️', () => {
    renderComponent();

    const editButton = screen.getByTitle('Modifier');
    fireEvent.click(editButton);

    expect(mockOnEditTask).toHaveBeenCalledWith(task);
  });

  test('affiche bien les options du select de statut', () => {
    renderComponent();

    const select = screen.getByDisplayValue('À faire');
    expect(select).toBeInTheDocument();

    expect(screen.getByText('À faire')).toBeInTheDocument();
    expect(screen.getByText('En cours')).toBeInTheDocument();
    expect(screen.getByText('Terminé')).toBeInTheDocument();
  });
});
