'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /**
   * Categories resourse routes
   */

  Route.resource('/categories', 'CategoryController').apiOnly()

  /**
   * Products resource routes
   */

  Route.resource('/products', 'ProductController').apiOnly()

  /**
   * User resourse routes
   */

  Route.resource('/coupons', 'CouponController').apiOnly()

  /**
   * Order resourse routes
   */

  Route.resource('/orders', 'OrderController').apiOnly()

  /**
   * Image resourse routes
   */

  Route.resource('/images', 'ImageController').apiOnly()

  /**
   * User resourse routes
   */

  Route.resource('/users', 'UserController').apiOnly()
})
  .prefix('v1/admin')
  .namespace('Admin')
