'use stric'

const crypto = use('crypto')

// importando os Helpers do próprio Adonis, e não especificos do nosso sistema
const Helpers = use('Helpers')

// O primeiro Helper que vamos criar vai ser o str_random(), que utilizamos lá no nosso Model de PasswordReset. Ele vai gerar um Hash, uma string randomica para usarmos no nosso sistema. Vamos usar essas strings na geração de nomes/path das nossas imagens e também na criação dos nossos tokens. Ou seja, qualquer necessidade de gerar um hash randomcio iremos utilizar ele

/**
 * Generate random string
 * 
 * @param { int } length - O tamanho da string que você quer gerar
 * @return { string } - uma string randomica do tamanho do length
 */

const str_random = async(length = 40) => {
  let string = ''
  let len = string.length

  if(len < length) {
    let size = length - len
    let bytes = await crypto.randomBytes(size)
    let buffer = Buffer.from(bytes)

    string += buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '').substr(0, size)
  }

  // replace com regex = tirar tudo que não for uma letra de A - Z minúscula ou maiúscula ou um número de 0 a 9 (espaços por exemplo), substituindo por nada ''

  return string
}

// Vamos criar mais 2 Helpers que seram utilizados no nosso Controller de Imagens. Eles vão nós ajudar a gerenciar o upload de arquivos dentro do Adonis

// 1 Helper - Quando o usuário realizar um único upload, com somente um arquivo

/**
 * Move um único arquivo para o caminho especificado, se nenhum for especificado 
 * então 'public/uploads' será utilizado.
 * 
 * FileJar = como o Adonis chama a classe que trata arquivos
 * 
 * @param { FileJar } file o arquivo a ser gerenciado
 * @param { string } path o caminho para onde o arquivo deve ser movido
 * @return { Object<FileJar> }
 */

 // path é opcional
const manage_single_upload = async (file, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')

  // filename: a 1ª parte do nome das nossas imagens será a data que foi feita o upload em forma de número inteiro, a 2ª a string randomica gerada e a 3ª a estensão do arquivo (se é um instancia do FileJar ele terá uma propriedade chamada subtype que é a extensão do arquivo)

  // gera um nome aleatório
  const random_name = await str_random(30)
  let filename = `${new Date().getTime()}-${random_name}.${file.subtype}}`

  // renomeia/altera de fato o nome do arquvio e move ele para o path
  await file.move(path, {
    name: filename
  })

  return file

}

// 2 Helper - Quando o usuário realizar múltiplos uploads

/**
 * Move mútiplos arquivos para o caminho especificado, se nenhum for especificado 
 * então 'public/uploads' será utilizado.
 * 
 * @param { FileJar } FileJar
 * @param { string } path
 * @return { Object }
 */

const manage_multiple_uploads = async (fileJar, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')

  // Haverá situações onde vamos fazer upload de múltiplos arquivos e alguns desses faram o upload completo, outros serão rejeitados por não serem arquivos válidos e outros por serem muito grandes e etc. Sendo assim teremos 2 tipos de retorno: Os arquivos que conseguimos processar com sucesso e os arquivos que deram erro no processamento 
  
  let successes = [], errors = []

  await Promise.all(FileJar.files.map(async file => {
    let random_name = await str_random(30)
    let filename = `${new Date().getTime()}-${random_name}.${file.subtype}}`

    // move o arquivo
    await file.move(path, {
      name: filename
    })

    //verificamos se moveu mesmo
    if (file.movid()) {
      successes.push(file)

    } else {
      errors.push(file.error())
    }

  }))

  return { successes, errors }

}

module.exports = {
  str_random,
  manage_single_upload,
  manage_multiple_uploads,
  Helpers
}
