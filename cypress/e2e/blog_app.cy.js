describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blogs')
    // cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')//
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'invalid username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })
  it('login success', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.get('.success')
      .should('contain', 'Matti Luukkainen logged in')
      .and('have.css', 'color', 'rgb(0, 128, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'invalid username or password')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function() {
      cy.contains('new').click()
      cy.get('#author').type('eidos')
      cy.get('#title').type('tomb raider legend')
      cy.get('#url').type('tombraiderlegend.com')
      cy.contains('save').click()
      cy.contains('tomb raider legend')
      cy.contains('eidos')
    })
    it('can add like', function() {
      cy.createBlog({ title: 'assassin creed', author: 'ubisoft', url: 'ubisoft.com' })
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
    })
    it('can delete', function() {
      cy.createBlog({ title: 'assassin creed', author: 'ubisoft', url: 'ubisoft.com' })
      cy.contains('view').click()
      cy.contains('Delete').click()
      cy
        .should('not.contain','assassin creed')
        .and('not.contain', 'ubisoft')
    })
    it('can"t delete if logged out', function() {
      cy.createBlog({ title: 'assassin creed', author: 'ubisoft', url: 'ubisoft.com' })
      cy.contains('Log out').click()
      cy.contains('view').click()
      cy.contains('Delete').click()
      cy.get('html')
        .should('contain','assassin creed')
        .and('contain', 'ubisoft')
    })
  })
})