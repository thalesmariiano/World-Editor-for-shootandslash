import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const app = express()
const port = 3072

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use("/static", express.static('public/arquivos'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.post('/', (req, res) => {
	if(req.body.tileMap.length){
		const date = new Date()
		const hours = date.getHours()
		const minutes = date.getMinutes()
		const seconds = date.getSeconds()

		const fileName = `tileMap_${hours}h_${minutes}m_${seconds}s`
		const fileContent = JSON.stringify(req.body.tileMap)
		const filePath = `tiles/${fileName}.json`

		fs.writeFile(filePath, fileContent, err => {
			if(err) throw err
			res.status(200).json({message: 'Mapa salvo com sucesso!'})
		})
	}else{
		res.status(400).json({message: 'Você precisa fazer um mapa primeiro!'})
	}
})

app.listen(port, () => {
	console.log('Server iniciado na porta: ' + port)
})