describe('projectView', () => {

	before(() => {
		cy.visit('/cy-log-in');
		cy.wait(1000);
		cy.visit('/projects');
	});

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/sandbox/test-user-cleanup')
    cy.get('[data-testid=addProjectButton]').as('addProjectButton');
    cy.get('[data-testid=projectsGrid]').as('projectsGrid');
  });