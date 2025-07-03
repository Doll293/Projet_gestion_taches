const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Tests E2E - Gestion des tâches', () => {
  let driver;
  const taskTitle = 'Tâche E2E Test ' + Date.now(); // Titre unique pour chaque exécution
  
  beforeAll(async () => {
    // Configuration du driver Chrome
    const options = new chrome.Options();
    options.addArguments('--headless'); // Mode headless pour exécution sans interface graphique
    
    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      
      // Se connecter avant de commencer les tests
      await driver.get('http://localhost:3000/login');
      await driver.wait(until.elementLocated(By.id('email')), 5000);
      await driver.findElement(By.id('email')).sendKeys('admin@test.com');
      await driver.findElement(By.id('password')).sendKeys('password');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlContains('/dashboard'), 5000);
    } catch (error) {
      console.error('Erreur lors de la création du driver ou de la connexion:', error);
    }
  }, 30000); // Augmentation du timeout à 30 secondes
  
  afterAll(async () => {
    // Se déconnecter et fermer le navigateur
    if (driver) {
      try {
        await driver.findElement(By.css('.logout-btn')).click();
      } catch (error) {
        console.log('Déconnexion échouée, fermeture du navigateur');
      }
      await driver.quit();
    }
  }, 10000);
  
  test('Création d\'une nouvelle tâche', async () => {
    try {
      // Cliquer sur le bouton pour créer une nouvelle tâche
      const newTaskButton = await driver.findElement(By.css('.btn-primary'));
      await newTaskButton.click();
      
      // Attendre l'affichage du formulaire
      await driver.wait(until.elementLocated(By.css('form')), 5000);
    
      // Remplir le formulaire
      await driver.findElement(By.name('title')).sendKeys(taskTitle);
      await driver.findElement(By.name('description')).sendKeys('Description de la tâche E2E');
      
      // Sélectionner une priorité
      const prioritySelect = await driver.findElement(By.name('priority'));
      await prioritySelect.click();
      await prioritySelect.findElement(By.css('option[value="high"]')).click();
      
      // Soumettre le formulaire
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Attendre que la tâche soit créée et affichée
      await driver.wait(until.elementLocated(By.xpath(`//h4[contains(text(), "${taskTitle}")]`)), 5000);
      
      // Vérifier que la tâche est bien dans la colonne "À faire"
      const todoColumn = await driver.findElement(By.css('.task-column.todo'));
      const taskElement = await todoColumn.findElement(By.xpath(`.//h4[contains(text(), "${taskTitle}")]`));
      
      expect(await taskElement.isDisplayed()).toBe(true);
    } catch (error) {
      console.error('Erreur lors de la création de tâche:', error);
      throw error;
    }
  }, 20000);
  
  test('Modification d\'une tâche', async () => {
    try {
      // Trouver la tâche créée précédemment
      const taskElement = await driver.findElement(By.xpath(`//h4[contains(text(), "${taskTitle}")]`));
      
      // Trouver le bouton d'édition dans le parent de la tâche
      const taskCard = await taskElement.findElement(By.xpath('./ancestor::div[contains(@class, "task-card")]'));
      const editButton = await taskCard.findElement(By.css('button[title="Modifier"]'));
      await editButton.click();
      
      // Attendre l'affichage du formulaire d'édition
      await driver.wait(until.elementLocated(By.css('form')), 5000);
      
      // Modifier le titre
      const titleInput = await driver.findElement(By.name('title'));
      await titleInput.clear();
      await titleInput.sendKeys(taskTitle + ' - Modifiée');
      
      // Soumettre le formulaire
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Attendre que la tâche modifiée soit affichée
      await driver.wait(until.elementLocated(By.xpath(`//h4[contains(text(), "${taskTitle} - Modifiée")]`)), 5000);
      
      // Vérifier que la tâche a bien été modifiée
      const modifiedTaskElement = await driver.findElement(By.xpath(`//h4[contains(text(), "${taskTitle} - Modifiée")]`));
      expect(await modifiedTaskElement.isDisplayed()).toBe(true);
    } catch (error) {
      console.error('Erreur lors de la modification de tâche:', error);
      throw error;
    }
  }, 20000);
  
  test('Changement de statut d\'une tâche', async () => {
    try {
      // Trouver la tâche modifiée
      const taskElement = await driver.findElement(By.xpath(`//h4[contains(text(), "${taskTitle} - Modifiée")]`));
      
      // Trouver le sélecteur de statut dans le parent de la tâche
      const taskCard = await taskElement.findElement(By.xpath('./ancestor::div[contains(@class, "task-card")]'));
      const statusSelect = await taskCard.findElement(By.css('.status-select'));
      
      // Changer le statut à "En cours"
      await statusSelect.click();
      await statusSelect.findElement(By.css('option[value="progress"]')).click();
      
      // Attendre que la tâche soit déplacée dans la colonne "En cours"
      await driver.sleep(1000); // Attendre un peu pour le rendu
      await driver.wait(async () => {
        const progressColumn = await driver.findElement(By.css('.task-column.progress'));
        try {
          const taskInProgress = await progressColumn.findElement(By.xpath(`.//h4[contains(text(), "${taskTitle} - Modifiée")]`));
          return await taskInProgress.isDisplayed();
        } catch (error) {
          return false;
        }
      }, 5000);
      
      // Vérifier que la tâche est bien dans la colonne "En cours"
      const progressColumn = await driver.findElement(By.css('.task-column.progress'));
      const taskInProgress = await progressColumn.findElement(By.xpath(`.//h4[contains(text(), "${taskTitle} - Modifiée")]`));
      
      expect(await taskInProgress.isDisplayed()).toBe(true);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      throw error;
    }
  }, 20000);
  
  test('Suppression d\'une tâche', async () => {
    try {
      // Trouver la tâche dans la colonne "En cours"
      const progressColumn = await driver.findElement(By.css('.task-column.progress'));
      const taskElement = await progressColumn.findElement(By.xpath(`.//h4[contains(text(), "${taskTitle} - Modifiée")]`));
      
      // Trouver le bouton de suppression dans le parent de la tâche
      const taskCard = await taskElement.findElement(By.xpath('./ancestor::div[contains(@class, "task-card")]'));
      const deleteButton = await taskCard.findElement(By.css('button[title="Supprimer"]'));
      
      // Mocker window.confirm pour auto-confirmer la suppression
      await driver.executeScript('window.confirm = function() { return true; }');
      
      // Cliquer sur le bouton de suppression
      await deleteButton.click();
      
      // Attendre que la tâche soit supprimée
      await driver.sleep(1000); // Attendre un peu pour le traitement
      await driver.wait(async () => {
        try {
          await progressColumn.findElement(By.xpath(`.//h4[contains(text(), "${taskTitle} - Modifiée")]`));
          return false; // La tâche existe toujours
        } catch (error) {
          return true; // La tâche n'existe plus
        }
      }, 5000);
      
      // Vérifier que la tâche a bien été supprimée
      let taskExists = true;
      try {
        await driver.findElement(By.xpath(`//h4[contains(text(), "${taskTitle} - Modifiée")]`));
      } catch (error) {
        taskExists = false;
      }
      
      expect(taskExists).toBe(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de tâche:', error);
      throw error;
    }
  }, 20000);
});
