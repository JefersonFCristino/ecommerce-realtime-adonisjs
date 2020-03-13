'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  /**
   * Relacionamento entre Produto e imagem de destaqu
   */
  image() {
    return this.belongsTo('App/Models/Image')
  }

  /**
   * Relacionamento entre Produto e images (galeria de imagens do produto)
   */
  images() {
    return this.belongsToMany('App/Models/Image')
  }

  /**
   * Relacionamento entre Produtos e Categorias
   */
  categories() {
    return this.belongsToMany('App/Models/Category')
  }

  /**
   * Relacionamento entre Produtos e cupons de desconto
   */
  coupons() {
    return this.belongsToMany('App/Models/Coupon')
  }
}

module.exports = Product
