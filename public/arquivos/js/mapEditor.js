
const engine = new Engine('#editor-display')

const map_editor = {
	area: {
		width: 2000,
		height: 800
	},
	pointer: {
		x: 0,
		y: 0, 
		color: 'white', 
		size: 50
	},
	tiles: [],
	transX: 0,
	transY: 0,
	startX: 0,
	startY: 0,
	clickMode: 'addTile',
	moveMapEnabled: false,
	moveMouseTrigger: false,
}

engine.on('render', () => {
	engine.BUFFER.fillStyle = "#404040"
	engine.BUFFER.fillRect(0, 0, innerWidth, innerHeight)

	engine.BUFFER.translate(map_editor.transX, map_editor.transY)

	// Editable area canvas background
	engine.BUFFER.fillStyle = '#606060'
	engine.BUFFER.fillRect(0,0, map_editor.area.width, map_editor.area.height)
	//
	engine.BUFFER.strokeStyle = 'white'
	engine.BUFFER.strokeRect(0, 0, map_editor.area.width, map_editor.area.height)
	//

	engine.BUFFER.font = '20px Arial'
	engine.BUFFER.fillStyle = '#303030'
	engine.BUFFER.fillText("Player spawn", 95, 360)

	engine.BUFFER.fillStyle = '#404040'
	engine.BUFFER.fillRect(127, 380, 55, 100)

	map_editor.tiles.forEach(tile => {
		engine.BUFFER.drawImage(
			tilemap,
			tile.imgX,
			tile.imgY,
			32, 32,
			tile.position.x,
			tile.position.y,
			tile.width, 
			tile.height
		)		
	})

	// pointer
	engine.BUFFER.strokeStyle = map_editor.pointer.color
	engine.BUFFER.strokeRect(
		map_editor.pointer.x,
		map_editor.pointer.y, 
		map_editor.pointer.size, 
		map_editor.pointer.size
	)
	// 

	if(map_editor.clickMode == 'addTile'){
		engine.BUFFER.globalAlpha = 0.5
		engine.BUFFER.drawImage(
			tilemap,
			config.tileImgX,
			config.tileImgY,
			32, 32,
			map_editor.pointer.x,
			map_editor.pointer.y,
			map_editor.pointer.size, 
			map_editor.pointer.size
		)	
	}
})

engine.canvas.addEventListener('click', e => {
	const handlers = {
		'addTile': addTile,
		'removeTile': removeTile,
		'': () => {}
	}
	handlers[map_editor.clickMode](e)
})

engine.canvas.addEventListener('mousemove', e => {
	movePointer(e)
})

engine.canvas.addEventListener('mousedown', e => {
	map_editor.moveMouseTrigger = true
	map_editor.startX = e.clientX - map_editor.transX
	map_editor.startY = e.clientY - map_editor.transY
})

engine.canvas.addEventListener('mouseup', e => {
	map_editor.moveMouseTrigger = false
})

engine.resizeAspectRatio()
engine.start()

window.onresize = () => engine.resizeAspectRatio()

const switchMode = mode => {
	map_editor.clickMode = mode
	
	if(map_editor.clickMode == 'addTile') map_editor.pointer.color = 'white'
	else if(map_editor.clickMode == 'removeTile') map_editor.pointer.color = 'red'
}

const switchTexture = (x,y) => {
	map_editor.moveMapEnabled = false
	config.tileImgX = x
	config.tileImgY = y
	switchMode('addTile')
}

const addTile = e => {
	const tileX = getPointerX(e)
	const tileY = getPointerY(e)

	// if is out editable area, return
	if(tileX >= map_editor.area.width || tileX < 0 || tileY >= map_editor.area.height || tileY < 0) return

	// replace a existing tile for another or not
	const tileIndex = map_editor.tiles.findIndex(tile => tileX == tile.position.x && tileY == tile.position.y)
	if(parseInt(localStorage.getItem('replaceTile')) && tileIndex !== -1){
		if(tileIndex !== -1) tiles.splice(tileIndex, 1)	
	}else if(tileIndex !== -1) return
	
	// push tile object on array
	map_editor.tiles.push({
		width: 50,
		height: 50,
		imgX: config.tileImgX,
		imgY: config.tileImgY,
		position: {x: tileX, y: tileY},
		type: 'Block',
		visible: false
	})
}

const removeTile = e => {
	const tileX = getPointerX(e)
	const tileY = getPointerY(e)

	const tileIndex = map_editor.tiles.findIndex(tile => tileX == tile.position.x && tileY == tile.position.y)
	if(tileIndex !== -1) map_editor.tiles.splice(tileIndex, 1)					
}

const movePointer = e => {
	map_editor.pointer.x = getPointerX(e)
	map_editor.pointer.y = getPointerY(e)

	if(map_editor.moveMapEnabled) engine.canvas.classList.add('cursor-move')
	else engine.canvas.classList.remove('cursor-move')
	
	if(map_editor.moveMapEnabled && map_editor.moveMouseTrigger){
		map_editor.transX = e.clientX - map_editor.startX
		map_editor.transY = e.clientY - map_editor.startY
	}

	// continuous tile placement
	if(parseInt(localStorage.getItem('tilePlacement'))){
		if(map_editor.clickMode == 'addTile' && map_editor.moveMouseTrigger){
			addTile(e)
		}
	}
	
}

const moveMap = () => {
	map_editor.moveMapEnabled = !map_editor.moveMapEnabled

	if(!map_editor.moveMapEnabled) switchMode('addTile')
	else switchMode('')
}

const clearCanvas = () => map_editor.tiles.length = 0