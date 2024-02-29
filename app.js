// console.log('Ola mundo!')
// importar modulo do express

const express = require('express')

// modulo do mysql

const mysql = require('mysql2')

// importar handlebars
const { engine } = require('express-handlebars')
// brostrap
const app = express()
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

app.use('/css', express.static('./css'))

// configuração do express-handlebars

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// rotas do projeto
app.get('/', function (req, res) {
   res.render('formulario')
})
// modulos
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'views', 'layouts', 'main.handlebars')

// Verifique se o arquivo existe
if (fs.existsSync(filePath)) {
   console.log('O arquivo main.handlebars existe.')
} else {
   console.log('O arquivo main.handlebars não existe.')
}

// configuração do BD
const conexao = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'eletromagnetismo',
   database: 'projeto',
})

// teste de conexão
conexao.connect(function (erro) {
   if (erro) throw erro
   console.log('Conexao realizada com sucesso!')
})
// cadastro produto
app.post('/cadastrar', function (req, res) {
   try {
      let nome = req.body.nome
      let valor = req.body.valor
      let imagem = req.files.imagem.name
      // validar nome do produto
      if (nome == '' || valor == '' || isNaN(valor)) {
         res.redirect('/falha cadastro')
      } else {
         let sql = `INSERT INTO  produto(nome, valor, imagem)VALUES ('${nome}', ${valor},'${imagem}')`
         // executar comando
         conexao.query(sql, function (erro, returno) {
            if (erro) throw erro

            // caso ocorra o casdatro

            res.files.imagem.mv(__dirname + '/imagens/' + req.files.imagem.name)
            console.log(returno)
         })

         // retornar para rota principal
         res.redirect('/okCadastro')
      }
   } catch (erro) {
      res.redirect('/falha cadastro')
   }
})

// criar servidor

app.listen(8080)
