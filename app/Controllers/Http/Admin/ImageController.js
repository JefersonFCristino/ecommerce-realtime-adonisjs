'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
const { manage_single_upload, manage_multiple_uploads, Helpers } = use('App/Helpers')
const fs = use('fs')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {object} ctx.pagination
   */
  async index ({ request, response, pagination }) {
    // Vamos montar a estrutura de forma que mostre as últimas imagens adicionadas, como uma galeria de fotos.
    const images = await Image.query().orderBy('id', 'DESC').paginate(pagination.page, pagination.limit)

    return response.send(images)
  }

  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    // Método de quando fizermos o upload de uma única imagem

    try {
      // captura uma imagem ou mais do request
      // 1º param = os arquivos / 2º = um validator para checar o tipo dessas imagens (evitando assim algum usuário de enviar algum executavel)
      const fileJar = request.file('images', {
        types: ['image'],
        size: '2mb'
      })

      // tratar o retorno para o usuário
      let images = []

      // CASO SEJA UM ÚNICO ARQUIVO - manage-single-upload
      // !fileJar.files = se files estiver setado quer dizer que o usuário fez o upload de vários arquivos, caso não, fez de um único arquivo
      if (!fileJar.files) {
        const file = await manage_single_upload(fileJar)
        
        // vamos verificar também se o arquivo foi movido para saber se o upload foi feito com sucesso, assim como fizemos nos nossos Helpers. Se file.moved() for verdadeiro então que dizer que temos uma imagem para salvar no banco de dados pois seu upload deu sucesso
        if (file.moved()) {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          })

          images.push(image)

          return response.status(201).send({ successes: images, errors: {} })
        }

        return response.status(400).send({
          message: 'Não foi possível processar esta imagem no momento!'
        })

      }

      // CASO SEJAM VÁRIOS ARQUIVOS - manage-multiple-uploads
      let files = await manage_multiple_uploads(fileJar)

      await Promise.all(files.successes.map(async file => {
        const image = await Image.create({
          path: file.fileName,
          size: file.size,
          original_name: file.clientName,
          extension: file.subtype
        })

        images.push(image)
      }))

      return response.status(201).send({ successes: images, errors: files.errors })

    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possível processar a sua solicitação!'
      })
    }

  }

  /**
   * Display a single image.
   * GET images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, view }) {
    const image = await Image.findOrFail(id)
    return response.send(image)

  }

  /**
   * Update image details.
   * PUT or PATCH images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    // Nosso método update de imagens vai servir parar trocar o título da imagem (original_name)

    const image = await Image.findOrFail(id)

    try {
      image.merge(request.only(['original_name']))
      await image.save()

      return response.status(200).send(image)

    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possível atualizar está imagem no momento!'
      })

    }

  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)

    try {
      let filepath = Helpers.publicPath(`uploads/${image.path}`)

      // fs.unlink = vai excluir o arquivo em disco, na nossa própria pasta 
      await fs.unlink(filepath, err => {
        // se não tiver erro quer dizer que deletou a imagem do disco, sendo assim, agora vamos deletar do banco de dados também (serve também por uma questão de assegurar que a imagem só será excluída do banco caso realmente não tenha dado erro)
        if(!err)

        await image.delete()
      })

      return response.status(204).send()

    } catch (error) {
        return response.status(400).send({
          message: 'Não foi possível deletar a imagem no momento!'
        })
    }
  }
}

module.exports = ImageController
