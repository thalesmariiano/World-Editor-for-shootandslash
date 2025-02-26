
class Engine {
    constructor(canvasId){
        this.canvas = document.querySelector(canvasId)
        this.canvasBuffer = document.createElement('canvas')

        this.paused = true

        this.deltaTime
        this.lastTime = 0
        this.fps = 60
        this.fpsInterval = 1000/this.fps

        this.BUFFER = this.canvasBuffer.getContext('2d', {alpha: false})
        this.CTX = this.canvas.getContext('2d', {alpha: false})

        this.eventsCallback = []
    }

    on(event, callback){
        this.eventsCallback.push({
            name: event,
            callback
        })
    }

    loop(timestamp){
        this.deltaTime = timestamp - this.lastTime

        if(this.deltaTime > this.fpsInterval){
            this.lastTime = timestamp - (this.deltaTime % this.fpsInterval)

            this.update()
            this.render()
        }

        if(!this.paused) requestAnimationFrame(this.loop.bind(this))
    }
    

    start(){
        this.paused = false
        this.loop()
    }

    update(){
        const listeners = this.eventsCallback.filter(event => event.name === 'update')
        listeners.forEach(listener => listener.callback(this.deltaTime))
    }

    render(){
        this.BUFFER.save()
    	this.BUFFER.clearRect(0, 0, this.canvas.width, this.canvas.height)

        const listeners = this.eventsCallback.filter(event => event.name === 'render')
        listeners.forEach(listener => listener.callback(this.BUFFER))

        this.BUFFER.restore()
	    this.CTX.drawImage(this.canvasBuffer, 0, 0)
    }

    resizeAspectRatio(){
        this.canvas.width = this.canvasBuffer.width = window.innerWidth
        this.canvas.height = this.canvasBuffer.height = window.innerHeight
        this.CTX.imageSmoothingEnabled = false
        this.BUFFER.imageSmoothingEnabled = false
    }
    
}