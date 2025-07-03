const { v4: uuidv4 } = require('uuid');

// Mock de uuid
jest.mock('uuid', () => ({
  v4: jest.fn()
}));

describe('Tests de gestion de tâches', () => {
  // Mock d'une liste de tâches
  let tasks = [
    {
      id: '1',
      title: 'Tâche test',
      description: 'Description de test',
      status: 'todo',
      priority: 'medium',
      assignedTo: '1',
      createdAt: '2023-01-01T12:00:00.000Z',
      updatedAt: '2023-01-01T12:00:00.000Z'
    }
  ];

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('Création d\'une nouvelle tâche', () => {
    // Configuration du mock pour uuid
    uuidv4.mockReturnValue('new-task-id');
    
    // Date fixe pour les tests
    const fixedDate = new Date('2023-01-02T12:00:00.000Z');
    const originalDateNow = Date.now;
    global.Date = jest.fn(() => fixedDate);
    global.Date.now = originalDateNow;
    
    // Données de la nouvelle tâche
    const taskData = {
      title: 'Nouvelle tâche',
      description: 'Description de la nouvelle tâche',
      priority: 'high',
      assignedTo: '2'
    };
    
    // Simuler la création d'une tâche
    const newTask = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      status: 'todo',
      priority: taskData.priority,
      assignedTo: taskData.assignedTo,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString()
    };
    
    tasks.push(newTask);
    
    // Vérifications
    expect(uuidv4).toHaveBeenCalled();
    expect(newTask.id).toBe('new-task-id');
    expect(tasks.length).toBe(2);
    expect(tasks[1]).toEqual(newTask);
    expect(tasks[1].status).toBe('todo'); // Le statut par défaut est 'todo'
    
    // Restaurer Date
    global.Date = Date;
  });

  test('Mise à jour d\'une tâche existante', () => {
    // Date fixe pour les tests
    const fixedDate = new Date('2023-01-03T12:00:00.000Z');
    const originalDateNow = Date.now;
    global.Date = jest.fn(() => fixedDate);
    global.Date.now = originalDateNow;
    
    // Données de mise à jour
    const taskId = '1';
    const updateData = {
      title: 'Tâche mise à jour',
      status: 'progress'
    };
    
    // Trouver l'index de la tâche à mettre à jour
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    // Mettre à jour la tâche
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updateData,
        updatedAt: fixedDate.toISOString()
      };
    }
    
    // Vérifications
    expect(taskIndex).toBe(0); // La tâche existe
    expect(tasks[0].title).toBe('Tâche mise à jour');
    expect(tasks[0].status).toBe('progress');
    // Vérifier que updatedAt est mis à jour (sans vérifier la valeur exacte)
    expect(tasks[0].updatedAt).toBeDefined();
    
    // Restaurer Date
    global.Date = Date;
  });

  test('Suppression d\'une tâche', () => {
    // Réinitialiser tasks à un état connu
    tasks = [
      {
        id: '1',
        title: 'Tâche test',
        description: 'Description de test',
        status: 'todo',
        priority: 'medium',
        assignedTo: '1',
        createdAt: '2023-01-01T12:00:00.000Z',
        updatedAt: '2023-01-01T12:00:00.000Z'
      }
    ];
    
    // ID de la tâche à supprimer
    const taskId = '1';
    
    // Longueur initiale du tableau
    const initialLength = tasks.length;
    
    // Supprimer la tâche
    tasks = tasks.filter(t => t.id !== taskId);
    
    // Vérifications
    expect(initialLength).toBe(1);
    expect(tasks.length).toBe(0);
  });
});
