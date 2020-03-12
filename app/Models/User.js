'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      // Caso mudemos a senha o lucid detecta que esse campo foi modificado e cria a mesma propriedade (nesse caso, 'password') só que dentro de uma outra propriedade chamada dirty. dirty.password = password modificado que está dentro de dirty (caso exista execulta o if)

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   *  Oculta os campos definidos no retorno das queries no DB
   */

  static get hidden() {
    return ['password']
  }

  // trait é basicamente um bloco de código que estamos trazendo para o nosso model

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  // this referencia o Model ou seja, nesse caso, o Model user (this.belongsTo = user.belongsTo)

  image() {
    return this.belongsTo('App/Models/Image')
  }

  coupon() {
    return this.belongsToMany('App/Models/Coupon')
  }
}

module.exports = User
