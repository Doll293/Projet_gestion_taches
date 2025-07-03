// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock des contextes
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(() => Promise.resolve({ success: true })),
    register: jest.fn(() => Promise.resolve({ success: true })),
    logout: jest.fn(),
    user: { name: 'Test User', email: 'test@example.com' },
    token: 'mock-token',
    loading: false
  })
}));

jest.mock('./contexts/TaskContext', () => ({
  useTask: () => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        assignedTo: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    users: [
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    ],
    loading: false,
    createTask: jest.fn(() => Promise.resolve({ success: true })),
    updateTask: jest.fn(() => Promise.resolve({ success: true })),
    deleteTask: jest.fn(() => Promise.resolve({ success: true })),
    fetchTasks: jest.fn()
  })
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/dashboard'
  })
}));
