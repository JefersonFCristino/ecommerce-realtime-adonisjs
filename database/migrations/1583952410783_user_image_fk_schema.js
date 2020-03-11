'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

// Estamos criando esse relacionamento aqui pois na hora que rodarmos a migration de 'users' a tabela de 'images' ainda não vai existir dando assim um erro

class UserImageFkSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.foreign('image_id').references('id').inTable('images').onDelete('cascade')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropForeign('image_id')
    })
  }
}

module.exports = UserImageFkSchema
