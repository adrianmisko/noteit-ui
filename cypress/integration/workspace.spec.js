describe('Workspace', () => {
  before(() => {
    cy.visit('/Workspace');
  });

  beforeEach(() => {
    cy.get('[data-testid=editor]').as('editor');
    cy.get('[data-testid=Toolbox]').as('toolbox');
    cy.get('[data-testid=pasteButton]').as('pasteButton');
    cy.get('[data-testid=logo]').as('logo');
    cy.get('[data-testid=decreaseFontSizeButton]').as('fontSizeDecBtn');
    cy.get('[data-testid=increaseFontSizeButton]').as('fontSizeIncBtn');
  });

  it('Should contain an editor with sample text', () => {
    cy.get('@editor').contains('Lorem ipsum');
  });

  it('Should contain Toolbox and button(s)', () => {
    cy.get('@Toolbox').should('exist');
    cy.get('@pasteButton').should('exist');
  });

  it('Should paste content on click', async () => {
    window.focus();
    await clipboard.writeText('Some text');
    cy.get('@pasteButton').click();
    cy.get('@editor').contains('Some text');
  });

  it('Has default font size of 14px', () => {
    cy.get('@editor').should('have.css', 'font-size', '14px');
  });

  it('Should decrease font size on button click', async () => {
    // so that change is visible
    window.focus();
    await clipboard.writeText('Some text');
    cy.get('@pasteButton').click();
    cy.get('@editor').contains('Some text');

    cy.get('@fontSizeDecBtn').click();
    cy.get('@editor').should('have.css', 'font-size', '12px');
  });

  it('Should increase font size on button click', async () => {
    // so that change is visible
    window.focus();
    await clipboard.writeText('Some text');
    cy.get('@pasteButton').click();
    cy.get('@editor').contains('Some text');

    cy.get('[data-testid=increaseFontSizeButton]').click();
    cy.get('@editor').should('have.css', 'font-size', '16px');
  });
});
