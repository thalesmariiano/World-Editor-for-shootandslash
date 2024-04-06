
function textureSelector(canvasId, image){
	const canvas = document.querySelector(canvasId)
	const ctx = canvas.getContext('2d')
	canvas.imageSmoothingEnabled = false

	const pointer = {
		x: 0,
		y: 0, 
		color: 'white', 
		size: 32
	}

	const tilemap = new Image()
	tilemap.src = image

	const getPointerX = e => roundTo(e.clientX - canvas.offsetLeft - pointer.size/2, pointer.size)
	const getPointerY = e => roundTo(e.clientY - canvas.offsetTop - pointer.size/2, pointer.size)

	function movePointer(e){
		pointer.x = getPointerX(e)
		pointer.y = getPointerY(e)
	}

	function selectTileTexture(e){
		config.tileImgX = getPointerX(e)
		config.tileImgY = getPointerY(e)
	}

	function render(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// canvas size equal tilemap image size
		canvas.width = tilemap.width
		canvas.height = tilemap.height
		ctx.drawImage(tilemap, 0, 0)

		// show image selected
		ctx.strokeStyle = '#03e8fc'
		ctx.strokeRect(config.tileImgX, config.tileImgY, pointer.size, pointer.size)
		//

		// pointer
		ctx.strokeStyle = pointer.color
		ctx.strokeRect(pointer.x, pointer.y, pointer.size, pointer.size)
		// 

		requestAnimationFrame(render)
	}

	function init(){
		canvas.addEventListener('click', selectTileTexture)
		canvas.addEventListener('mousemove', movePointer)

		render()
	}

	return {
		init
	}
}
