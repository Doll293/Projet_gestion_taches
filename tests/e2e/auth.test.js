const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Tests E2E - Authentification', () => {
  let driver;
  
  beforeAll(async () => {
    // Configuration du driver Chrome
    const options = new chrome.Options();
    options.addArguments('--headless'); // Mode headless pour exécution sans interface graphique
    
    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    } catch (error) {
      console.error('Erreur lors de la création du driver:', error);
    }
  }, 20000); // Augmentation du timeout à 20 secondes
  
  afterAll(async () => {
    // Fermer le navigateur après les tests
    if (driver) {
      try {
        await driver.quit();
      } catch (error) {
        console.error('Erreur lors de la fermeture du driver:', error);
      }
    }
  });
  
  test('Login - Flux complet de connexion', async () => {
    // Accéder à la page de connexion
    await driver.get('http://localhost:3000/login');
    
    // Attendre que la page se charge
    await driver.wait(until.elementLocated(By.id('email')), 5000);
    
    // Saisir les identifiants
    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    
    // Soumettre le formulaire
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Attendre la redirection vers le tableau de bord
    await driver.wait(until.urlContains('/dashboard'), 5000);
    
    // Vérifier que l'utilisateur est connecté en cherchant l'élément dashboard-header
    const headerElement = await driver.wait(until.elementLocated(By.css('.dashboard-header')), 5000);
    const headerText = await headerElement.getText();
    
    expect(headerText).toContain('Bienvenue');
  }, 20000); // Timeout augmenté à 20 secondes
  
  test('Logout - Déconnexion', async () => {
    // Vérifier qu'on est bien connecté
    await driver.get('http://localhost:3000/dashboard');
    await driver.wait(until.elementLocated(By.css('.dashboard-header')), 5000);
    
    // Cliquer sur le bouton de déconnexion
    await driver.findElement(By.css('.logout-btn')).click();
    
    // Attendre la redirection vers la page de connexion
    await driver.wait(until.urlContains('/login'), 5000);
    
    // Vérifier qu'on est bien déconnecté en cherchant le formulaire de connexion
    const formElement = await driver.wait(until.elementLocated(By.css('.auth-form')), 5000);
    expect(await formElement.isDisplayed()).toBe(true);
  }, 20000); // Timeout augmenté à 20 secondes
});
