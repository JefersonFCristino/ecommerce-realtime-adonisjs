'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name', 200)
      table.integer('image_id').unsigned()
      table.text('description')
      table.decimal('price', 12,2)
      table.timestamps()

      table.foreign('image_id').references('id').inTable('images').onDelete('cascade')
    })

    // Fora a nossa imagem de destaque, nosso produto terá uma galeria de imagens sobre o produto. Realizaremos um relacionamento n:n (*:*) para isso

    this.create('image_product', table => {
      table.increments()
      table.integer('image_id').unsigned()
      table.integer('product_id').unsigned()

      table.foreign('image_id').references('id').inTable('images').onDelete('cascade')
      table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
    })
  }

  down () {
    this.drop('image_product')
    this.drop('products')
  }
}

module.exports = ProductSchema
