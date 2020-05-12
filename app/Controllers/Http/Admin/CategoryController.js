'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {Object} ctx.pagination
   */

  // const page = request.input('page')
  // const limit = request.input('limit')

  async index({ request, response, view, pagination }) {

    // tbm vamos implementar uma busca filtrada
    const title = request.input('title')

    // criando uma instância do query builder do Model Category que já vai ficar pronta para executar algum comando
    const query = Category.query()

    if (title) {
      query.where('title', 'LIKE', `%${title}%`)
    }

    const categories = await query.paginate(pagination.page, pagination.limit) // pagina e quantidade por pagina

    return response.send(categories)
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { title, description, image_id } = request.all()
      const category = await Category.create({ title, description, image_id })
      return response.status(201).send(category)

    } catch (error) {

      return response.status(error.status).send({
        message: "Erro ao processar a sua solicitação!"
      })
    }

  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response }) {
    // findOrFail() = no caso de falha já envia a resposta de erro automaticamente
    const category = await Category.findOrFail(id)

    return response.send(category)
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {

    // OBS: category ao mesmo tempo que é um objeto ele também é a instância de um Model (e isso explica muita coisa)

    // caso não seja encontrado nem vai seguir para o próximo código, respondendo automaticamente como erro
    const category = await Category.findOrFail(id)

    const { title, description, image_id } = request.all()
    await category.merge({ title, description, image_id })
    await category.save()

    return response.send(category)
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {

    const category = await Category.findOrFail(id)
    await category.delete()

    return response.status(204).send()

  }
}

module.exports = CategoryController
