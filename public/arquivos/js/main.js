
const tilemap = new Image()
tilemap.src = 'static/images/tilemap.png'

const config = {
	tileImgX: 0,
	tileImgY: 0
}

const tilemapMenu = document.querySelector('#tilemap-menu')
const openTilemap = document.querySelector('#open-tilemap')
const closeTilemap = document.querySelector('#close-tilemap')

openTilemap.addEventListener('click', () => tilemapMenu.classList.toggle('hidden'))
closeTilemap.addEventListener('click', () => tilemapMenu.classList.toggle('hidden'))

const deleteMapModal = document.querySelector('#delete-map-modal')
const deleteMapButton = document.querySelector('#delete-map')
const cancelDeleteMap = document.querySelector('#cancel-delete-map')
const confirmDeleteMap = document.querySelector('#confirm-delete-map')

confirmDeleteMap.addEventListener('click', () => {
	deleteMapModal.classList.add('hidden')
	editor.clearCanvas()
})
cancelDeleteMap.addEventListener('click', () => {
	deleteMapModal.classList.add('hidden')
})

deleteMapButton.addEventListener('click', () => {
	deleteMapModal.classList.remove('hidden')
})

const optionsModal = document.querySelector('#options-modal')
const openOptions = document.querySelector('#open-options')
const closeOptions = document.querySelector('#close-options')

openOptions.addEventListener('click', () => {
	optionsModal.classList.remove('hidden')
})
closeOptions.addEventListener('click', () => {
	optionsModal.classList.add('hidden')
})

const selector = textureSelector('#tilemap-display', 'static/images/tilemap.png')
selector.init()

const saveMapModal = document.querySelector('#save-map-modal')
const mapName = document.querySelector('#map-name')
const fileExtension = document.querySelector('#file-extension')
const saveMap = document.querySelector('#save-map')
const confirmSaveMap = document.querySelector('#confirm-save-map')
const cancelSaveMap = document.querySelector('#cancel-save-map')

const savingMap = document.querySelector('#saving-map')

saveMap.addEventListener('click', () => {
	saveMapModal.classList.remove('hidden')
	mapName.placeholder = `tileMap${Math.floor(Math.random() * 1000)}`
})

confirmSaveMap.addEventListener('click', () => {
	saveMapModal.classList.add('hidden')
	savingMap.classList.remove('hidden')

	const data = {
		map_name: mapName.value ? mapName.value : mapName.placeholder,
		file_extension: fileExtension.value,
		tileMap: editor.tiles
	}

	axios.post('http://localhost:3072/', data)
	.then(response => {
		console.log(response.status)
		console.log(response.data)
		savingMap.classList.add('hidden')
	})
	.catch(err => {
		console.log(err.response.status)
		console.log(err.response.data)
		savingMap.classList.add('hidden')
	})
})

cancelSaveMap.addEventListener('click', () => {
	saveMapModal.classList.add('hidden')
})


const continuousTilePlacement = document.querySelector('#continuous-tile-placement')
continuousTilePlacement.addEventListener('click', () => {
	if(continuousTilePlacement.checked){
		localStorage.setItem('tilePlacement', '1')
	}else{
		localStorage.setItem('tilePlacement', '0')
	}
})

if(parseInt(localStorage.getItem('tilePlacement'))){
	continuousTilePlacement.checked = true
}

const replaceTile = document.querySelector('#replace-tile')
replaceTile.addEventListener('click', () => {
	if(replaceTile.checked){
		localStorage.setItem('replaceTile', '1')
	}else{
		localStorage.setItem('replaceTile', '0')
	}
})

if(parseInt(localStorage.getItem('replaceTile'))){
	replaceTile.checked = true
}
