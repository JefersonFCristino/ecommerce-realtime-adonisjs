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

    // tabela de relacionamento entre categorias e produtos
    // Obs: 'category_product' tem que ser escrita desse jeito pois quando formos mexer com nossos Models para criar os relacionamentos ele vai buscar da seguinte forma: toda vez que buscarmos um relacionamento entre 2 Models o Adonis vai buscar pelo nome do Model em minúsculo separado por "_" e o nome do outro Model, e também em ordem alfabetica, é por isso que 'category' vem primeiro q 'product'

    this.create('category_product', table => {
      table.increments()
      table.integer('product_id').unsigned()
      table.integer('category_id').unsigned()

      table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
      table.foreign('category_id').references('id').inTable('categories').onDelete('cascade')
    }) 

  }

  down () {
    this.drop('category_product')
    this.drop('image_product')
    this.drop('products')
  }
}

module.exports = ProductSchema
