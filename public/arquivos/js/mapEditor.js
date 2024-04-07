
function mapEditor(canvasId, image){
	const canvas = document.querySelector(canvasId)
	const ctx = canvas.getContext('2d')
	canvas.imageSmoothingEnabled = false

	const editable_area = {
		width: 2000,
		height: 800
	}
	const pointer = {
		x: 0,
		y: 0, 
		color: 'white', 
		size: 50
	}

	const tilemap = new Image()
	tilemap.src = image

	const tiles = []

	let moveMapEnabled = false
	let moveMouseTrigger = false

	let click_mode = 'addTile'

	let transX = 0
	let transY = 0
	let startX = 0
	let startY = 0

	const getPointerX = e => roundTo(e.clientX - canvas.offsetLeft - pointer.size/2 - transX, pointer.size)
	const getPointerY = e => roundTo(e.clientY - canvas.offsetTop - pointer.size/2 - transY, pointer.size)
	const clearCanvas = () => {if(tiles.length) tiles.length = 0}

	function moveMap(){
		moveMapEnabled = !moveMapEnabled

		if(!moveMapEnabled) switchMode('addTile')
		else switchMode('')
	}

	function movePointer(e){
		pointer.x = getPointerX(e)
		pointer.y = getPointerY(e)

		if(moveMapEnabled) canvas.classList.add('cursor-move')
		else canvas.classList.remove('cursor-move')
		
		if(moveMapEnabled && moveMouseTrigger){
			transX = e.clientX - startX
			transY = e.clientY - startY
		}

		// continuous tile placement
		if(parseInt(localStorage.getItem('tilePlacement'))){
			if(click_mode == 'addTile' && moveMouseTrigger){
				addTile(e)
			}
		}
		
	}

	function clickHandler(e){
		const handlers = {
			'addTile': addTile,
			'removeTile': removeTile,
			'': () => {}
		}
		handlers[click_mode](e)
	}

	function mouseDownHandler(e){
		moveMouseTrigger = true
		startX = e.clientX - transX
		startY = e.clientY - transY
	}

	function mouseUpHandler(e){
		moveMouseTrigger = false
	}

	function addTile(e){
		const tileX = getPointerX(e)
		const tileY = getPointerY(e)

		// if is out editable area, return
		if(tileX >= editable_area.width ||
		   tileX < 0 ||
		   tileY >= editable_area.height ||
		   tileY < 0
		) return

		// if already has a tile, return
		const hasTile = tiles.find(tile => tileX == tile.position.x && tileY == tile.position.y)
		if(hasTile) return

		// push tile object on array
		tiles.push({
			width: 50,
			height: 50,
			imgX: config.tileImgX,
			imgY: config.tileImgY,
			position: {x: tileX, y: tileY},
			type: 'Block',
			visible: false
		})
	}

	function removeTile(e){
		const tileX = getPointerX(e)
		const tileY = getPointerY(e)

		const tileIndex = tiles.findIndex(tile => tileX == tile.position.x && tileY == tile.position.y)
		if(tileIndex !== -1) tiles.splice(tileIndex, 1)					
	}

	function switchMode(mode){
		click_mode = mode
		
		if(click_mode == 'addTile') pointer.color = 'white'
		else if(click_mode == 'removeTile') pointer.color = 'red'
	}

	function switchTexture(x,y){
		moveMapEnabled = false
		config.tileImgX = x
		config.tileImgY = y
		switchMode('addTile')
	}

	function render(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.save()

		canvas.width = innerWidth
		canvas.height = innerHeight

		ctx.translate(transX, transY)

		// Editable area canvas background
		ctx.fillStyle = '#606060'
		ctx.fillRect(0,0, editable_area.width, editable_area.height)
		//
		ctx.strokeStyle = 'white'
		ctx.strokeRect(0, 0, editable_area.width, editable_area.height)
		//

		ctx.font = '20px Arial'
		ctx.fillStyle = '#303030'
		ctx.fillText("Player spawn", 95, 360)

		ctx.fillStyle = '#404040'
		ctx.fillRect(127, 380, 55, 100)

		tiles.forEach(tile => {
			ctx.drawImage(
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
		ctx.strokeStyle = pointer.color
		ctx.strokeRect(pointer.x, pointer.y, pointer.size, pointer.size)
		// 

		if(click_mode == 'addTile'){
			ctx.globalAlpha = 0.5
			ctx.drawImage(
				tilemap,
				config.tileImgX,
				config.tileImgY,
				32, 32,
				pointer.x,
				pointer.y,
				pointer.size, 
				pointer.size
			)	
		}
		
		ctx.restore()
		requestAnimationFrame(render)
	}

	function init(){
		canvas.addEventListener('click', clickHandler)
		canvas.addEventListener('mousemove', movePointer)
		canvas.addEventListener('mousedown', mouseDownHandler)
		canvas.addEventListener('mouseup', mouseUpHandler)

		render()
	}

	return {
		switchTexture,
		clearCanvas,
		switchMode,
		moveMap,
		tiles,
		init
	}
}
