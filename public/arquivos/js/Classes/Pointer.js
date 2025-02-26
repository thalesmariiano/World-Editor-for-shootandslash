
class Pointer {
    constructor(element){
        this.element = element

        this.element.addEventListener('click', e => {
            const listeners = this.eventsCallback.filter(event => event.name === 'click')
            listeners.forEach(listener => listener.callback(e))
        })
        
        this.element.addEventListener('mousemove', e => {
            const listeners = this.eventsCallback.filter(event => event.name === 'move')
            listeners.forEach(listener => listener.callback(e))
        })
        
        this.element.addEventListener('mousedown', e => {
            const listeners = this.eventsCallback.filter(event => event.name === 'mousedown')
            listeners.forEach(listener => listener.callback(e))
        })
        
        this.element.addEventListener('mouseup', e => {
            const listeners = this.eventsCallback.filter(event => event.name === 'mouseup')
            listeners.forEach(listener => listener.callback(e))
        })

        this.position = {
            x: 0,
            y: 0
        }
        this.start = {
            x: 0,
			y: 0,
        }
        this.color = 'white',
        this.size = {
            width: 50,
            height: 50
        },

        this.eventsCallback = []
    }

    on(event, callback){
        this.eventsCallback.push({
            name: event,
            callback
        })
    }
    
    getPointerX(e){
        return roundTo(
            e.clientX - this.size.width/2 - map_editor.transX,
            this.size.width
        )
    }
    getPointerY(e){
        return roundTo(
            e.clientY - this.size.height/2 - map_editor.transY,
            this.size.width
        )
    }

    draw(BUFFER){
        BUFFER.strokeStyle = this.color
	    BUFFER.strokeRect(
		    this.position.x,
		    this.position.y, 
		    this.size.width, 
		    this.size.height
	    )
    }
}