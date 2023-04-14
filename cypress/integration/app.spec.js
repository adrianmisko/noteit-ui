describe('App', () => {
  it('Logs in and redirects to /projects', () => {
    cy.visit('/cy-log-in');
    cy.wait(1000);
    cy.visit('/projects');
    cy.location('pathname').should('eq', '/projects');
  });
});
