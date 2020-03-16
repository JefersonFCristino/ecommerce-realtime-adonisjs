'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/refresh', 'AuthController.refresh').as('auth.refresh')
  Route.post('/logout', 'AuthController.logout').as('auth.logout')

  // restore password routes

  //solicitação de reset de senha
  Route.post('/reset-password', 'AuthController.forgot').as('auth.forgot')

  // o click do email enviado para o usuario abrirá uma página com um token que ao clicar enviará esse token ao servidor para ver se ainda está valido
  Route.get('/reset-password', 'AuthController.remember').as('auth.remember')

  // atualização de senha
  Route.put('/reset-password', 'AuthController.reset').as('auth.reset')
})
  .prefix('v1/auth')
  .namespace('Auth')
