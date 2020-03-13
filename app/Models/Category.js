'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  /**
   * Relacionamento entre Categoria e imagem de destaque
   */
  image() {
    return this.belongsTo('App/Models/Image')
  }

  /**
   * Relacionamento entre Catgoria e Produtos
   */
  products() {
    return this.belongsToMany('App/Models/Product')
  }
}

module.exports = Category
