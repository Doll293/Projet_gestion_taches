const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock des modules
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Tests d\'authentification', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User'
  };

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  test('Hachage de mot de passe', async () => {
    // Configuration du mock
    bcrypt.hash.mockResolvedValue('hashedPassword');
    
    // Test du hachage
    const hash = await bcrypt.hash('password', 10);
    
    // Vérifications
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(hash).toBe('hashedPassword');
  });

  test('Comparaison de mot de passe', async () => {
    // Configuration du mock
    bcrypt.compare.mockResolvedValue(true);
    
    // Test de la comparaison
    const isValid = await bcrypt.compare('password', 'hashedPassword');
    
    // Vérifications
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(isValid).toBe(true);
  });

  test('Génération de token JWT', () => {
    // Configuration du mock
    jwt.sign.mockReturnValue('mock_token');
    
    // Test de la génération de token
    const token = jwt.sign({ userId: mockUser.id, email: mockUser.email }, 'secret_key');
    
    // Vérifications
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id, email: mockUser.email }, 'secret_key');
    expect(token).toBe('mock_token');
  });

  test('Vérification de token JWT', () => {
    // Configuration du mock
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: mockUser.id, email: mockUser.email });
    });
    
    // Test de la vérification de token
    jwt.verify('mock_token', 'secret_key', (err, decoded) => {
      expect(err).toBeNull();
      expect(decoded).toEqual({ userId: mockUser.id, email: mockUser.email });
    });
    
    // Vérifications
    expect(jwt.verify).toHaveBeenCalledWith('mock_token', 'secret_key', expect.any(Function));
  });
});
