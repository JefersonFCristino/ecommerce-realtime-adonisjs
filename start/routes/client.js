'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  // products routes
  Route.get('products', 'ProductController.index')
  Route.get('products/:id', 'ProductController.show')

  // orders routes
  Route.post('orders', 'OrderController.store')
  Route.get('orders', 'OrderController.index')
  Route.put('orders/:id', 'OrderController.update')
  Route.get('orders/:id', 'OrderController.show')
})
  .prefix('v1')
  .namespace('Client')
