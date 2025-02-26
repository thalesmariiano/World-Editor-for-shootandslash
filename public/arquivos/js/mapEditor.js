
const pointerEvents = {
	click: {
	},
	move: {
	}
}
let pointerMode = 'add_tile'
let moveMapTrigger = false

const engine = new Engine('#editor-display')
const pointer = new Pointer(engine.canvas)

engine.on('render', (BUFFER) => {
	BUFFER.fillStyle = "#404040"
	BUFFER.fillRect(0, 0, innerWidth, innerHeight)

	BUFFER.scale(map_editor.scale, map_editor.scale)

	BUFFER.translate(map_editor.transX, map_editor.transY)

	// Editable area canvas background
	BUFFER.fillStyle = '#606060'
	BUFFER.fillRect(0,0, map_editor.area.width, map_editor.area.height)
	//
	BUFFER.strokeStyle = 'white'
	BUFFER.strokeRect(0, 0, map_editor.area.width, map_editor.area.height)
	//

	BUFFER.font = '20px Arial'
	BUFFER.fillStyle = '#303030'
	BUFFER.fillText("Player spawn", 95, 360)

	BUFFER.fillStyle = '#404040'
	BUFFER.fillRect(127, 380, 55, 100)

	map_editor.tiles.forEach(tile => {
		BUFFER.drawImage(
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

	pointer.draw(BUFFER)

	if(pointerMode === 'add_tile'){
		BUFFER.globalAlpha = 0.5
		BUFFER.drawImage(
			tilemap,
			config.tileImgX,
			config.tileImgY,
			32, 32,
			pointer.position.x,
			pointer.position.y,
			pointer.size.width, 
			pointer.size.height
		)	
	}
})

engine.resizeAspectRatio()
engine.start()

pointer.on('click', e => {
	if(pointerEvents.click[pointerMode]) pointerEvents.click[pointerMode](e)
})

pointer.on('move', e => {
	if(pointerEvents.move[pointerMode]) pointerEvents.move[pointerMode](e)
	movePointer(e)
})

pointer.on('mousedown', e => {
	moveMapTrigger = true
	pointer.startX = e.clientX - map_editor.transX
	pointer.startY = e.clientY - map_editor.transY
})

pointer.on('mouseup', e => {
	moveMapTrigger = false
})

pointer.element.addEventListener('wheel', e => {
	if(e.wheelDelta > 0){
		if(map_editor.scale >= 1) return
		map_editor.scale += 0.05
	}else{
		if(map_editor.scale <= 0.3) return
		map_editor.scale -= 0.05
	}
})

const switchMode = mode => {
	pointerMode = mode 
	
	if(pointerMode == 'remove_tile') pointer.color = 'red'
	else pointer.color = 'white'

	switch(pointerMode){
		case 'move_map':
			pointer.element.classList.add('cursor-move')
			pointer.color = 'transparent'
			break
		default:
			pointer.element.classList.remove('cursor-move')
	}
}

const addTile = e => {
	const tileX = pointer.getPointerX(e)
	const tileY = pointer.getPointerY(e)

	// if is out editable area, return
	if(tileX >= map_editor.area.width || tileX < 0 || tileY >= map_editor.area.height || tileY < 0) return

	// replace a existing tile for another or not
	const tileIndex = map_editor.tiles.findIndex(tile => tileX == tile.position.x && tileY == tile.position.y)

	if(parseInt(localStorage.getItem('replaceTile'))){
		if(tileIndex !== -1) map_editor.tiles.splice(tileIndex, 1)	
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
	const tileX = pointer.getPointerX(e)
	const tileY = pointer.getPointerY(e)

	const tileIndex = map_editor.tiles.findIndex(tile => tileX == tile.position.x && tileY == tile.position.y)
	if(tileIndex !== -1) map_editor.tiles.splice(tileIndex, 1)	
}

const moveMap = e => {
	if(moveMapTrigger){
		map_editor.transX = e.clientX - pointer.startX
		map_editor.transY = e.clientY - pointer.startY
	}
}

const movePointer = e => {
	pointer.position.x = pointer.getPointerX(e)
	pointer.position.y = pointer.getPointerY(e)

	// continuous tile placement
	if(parseInt(localStorage.getItem('tilePlacement'))){
		if(pointerMode == 'add_tile' && moveMapTrigger){
			addTile(e)
		}
	}
}

pointerEvents.click.add_tile = addTile
pointerEvents.click.remove_tile = removeTile
pointerEvents.move.move_map = moveMap
pointerEvents.move.move_pointer = movePointer

window.onresize = () => engine.resizeAspectRatio()

const switchTexture = (x,y) => {
	config.tileImgX = x
	config.tileImgY = y
	switchMode('add_tile')
}

const clearCanvas = () => map_editor.tiles.length = 0