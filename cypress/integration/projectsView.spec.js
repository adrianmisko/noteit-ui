describe('projectsView', () => {

  before(() => {
	cy.visit('/cy-log-in');
	cy.wait(1000);
	cy.visit('/projects');
  });

  beforeEach(() => {
    cy.get('[data-testid=addProjectButton]').as('addProjectButton');
    cy.get('[data-testid=projectsGrid]').as('projectsGrid');
  });

   it('Should add new Project', async () => {
    window.focus();
    cy.get('@addProjectButton').click();
    cy.get('[data-testid=projectNameInput]').as('projectNameInput');
    cy.get('[data-testid=addConfirmButton]').as('addConfirmButton');
    cy.get('@projectNameInput').type('projekt1');
    cy.get('@addConfirmButton').click()
    cy.get('[data-testid=cardHeader]').as('cardHeader');
    cy.get('@cardHeader').contains('projekt1');
  });

    it('Should display delete dialog', async () => {
	   	cy.get('@addProjectButton').click();
	    cy.get('[data-testid=projectNameInput]').as('projectNameInput');
	    cy.get('[data-testid=addConfirmButton]').as('addConfirmButton');
	    cy.get('@projectNameInput').type('projekt1');
	    cy.get('@addConfirmButton').click();
	    cy.get('[data-testid=moreHeader]').as('moreHeader');
	    cy.get('@moreHeader').click()
	    cy.get('[data-testid=deleteButton]').as('deleteButton');
	    cy.get('@deleteButton').click()
	    cy.get('[data-testid=deleteButton]').as('confirmDelete');
	    cy.get('@confirmDelete').should('exist');
  });

   it('Redirects to ProjectSite', async () => {
    cy.get('@addProjectButton').click();
	cy.get('[data-testid=projectNameInput]').as('projectNameInput');
    cy.get('[data-testid=addConfirmButton]').as('addConfirmButton');
    cy.get('@projectNameInput').type('projekt1');
    cy.get('@addConfirmButton').click();
    cy.get('[data-testid=projectRedirect]').as('projectRedirect');
    cy.get('@projectRedirect').click()
    cy.get('[data-testid=optionsList]').as('optionsList');
    cy.get('@optionsList').should('exist'); 
  });

  it('Should delete existing project', async () => {
  	cy.get('@addProjectButton').click();
    cy.get('[data-testid=projectNameInput]').as('projectNameInput');
    cy.get('[data-testid=addConfirmButton]').as('addConfirmButton');
    cy.get('@projectNameInput').type('projekt1');
    cy.get('@addConfirmButton').click()
    cy.get('[data-testid=moreHeader]').as('moreHeader');
    cy.get('@moreHeader').click()
    cy.get('[data-testid=deleteButton]').as('deleteButton');
    cy.get('@deleteButton').click()
    cy.get('[data-testid=confirmDelete]').as('confirmDelete');
    cy.get('@confirmDelete').click()
    cy.get('[data-testid=cardHeader]').should('not.exist')
  });


});
