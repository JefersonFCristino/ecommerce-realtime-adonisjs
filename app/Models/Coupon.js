'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Coupon extends Model {
  static get dates() {
    return ['created_at', 'updated_at', 'valid_from', 'valid_until']
  }

  users() {
    return this.belongsToMany('App/Models/User')
  }

  products() {
    this.belongsToMany('App/Models/Product')
  }

  orders() {
    return this.belongsToMany('App/Models/Order')
  }
}

// porque temos um Model de desconto mas não uma tabela de desconto?  A atbela que vai gerenciar os decontos é a coupon_order, que é qaundo um cupom passa a ser diretamente relacionado com um pedido, onde no caso o cupom específico deixa de ser um cupom de desconto e passa a ser um desconto de fato

module.exports = Coupon
