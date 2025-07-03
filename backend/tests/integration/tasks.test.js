const request = require('supertest');
const app = require('../../server');

describe('API Tasks Routes', () => {
  let authToken;
  let createdTaskId;
  
  // Avant tous les tests, on se connecte pour obtenir un token
  beforeAll(async () => {
    // Utiliser l'utilisateur admin pour se connecter
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password'
      });
    
    authToken = res.body.token;
  });
  
  test('GET /api/tasks - Récupération de toutes les tâches avec authentification', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  test('GET /api/tasks - Échec de récupération sans authentification', async () => {
    const res = await request(app)
      .get('/api/tasks');
    
    expect(res.statusCode).toBe(401);
  });
  
  test('POST /api/tasks - Création d\'une nouvelle tâche', async () => {
    const taskData = {
      title: 'Tâche de test intégration',
      description: 'Description de la tâche de test intégration',
      priority: 'high'
    };
    
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(taskData.title);
    expect(res.body.description).toBe(taskData.description);
    expect(res.body.priority).toBe(taskData.priority);
    expect(res.body.status).toBe('todo');
    
    // Sauvegarder l'ID pour les tests suivants
    createdTaskId = res.body.id;
  });
  
  test('GET /api/tasks/:id - Récupération d\'une tâche spécifique', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdTaskId);
  });
  
  test('PUT /api/tasks/:id - Mise à jour d\'une tâche', async () => {
    const updateData = {
      title: 'Tâche mise à jour',
      status: 'progress'
    };
    
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdTaskId);
    expect(res.body.title).toBe(updateData.title);
    expect(res.body.status).toBe(updateData.status);
  });
  
  test('DELETE /api/tasks/:id - Suppression d\'une tâche', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(204);
    
    // Vérifier que la tâche a bien été supprimée
    const getRes = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(getRes.statusCode).toBe(404);
  });
});
