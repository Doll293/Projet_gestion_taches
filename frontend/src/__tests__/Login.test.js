import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';

// Variables pour stocker les paramètres du mock login
let mockLoginParams = null;

// Mock du contexte d'authentification
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn((email, password) => {
      mockLoginParams = { email, password };
      
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({ success: true });
      } else {
        return Promise.resolve({ 
          success: false, 
          error: 'Identifiants invalides' 
        });
      }
    }),
    user: null
  })
}));

describe('Login Component', () => {
  beforeEach(() => {
    mockLoginParams = null;
  });
  
  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Tenter de soumettre le formulaire sans saisir de données
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);
    
    // Vérifier que les messages d'erreur s'affichent
    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Remplir le formulaire
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);
    
    // Vérifier que la fonction login a été appelée avec les bonnes données
    await waitFor(() => {
      expect(mockLoginParams).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('shows error message on failed login', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Remplir et soumettre le formulaire
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
    });
  });
});
