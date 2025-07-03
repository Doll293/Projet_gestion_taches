const request = require('supertest');
const app = require('../../server');

describe('API Authentication Routes', () => {
  let authToken;
  
  test('POST /api/auth/register - Inscription d\'un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test-integration@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('test-integration@example.com');
    
    // Sauvegarder le token pour les tests suivants
    authToken = res.body.token;
  });
  
  test('POST /api/auth/login - Connexion avec des identifiants valides', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test-integration@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('test-integration@example.com');
  });
  
  test('POST /api/auth/login - Échec de connexion avec des identifiants invalides', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test-integration@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
