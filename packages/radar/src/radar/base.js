
export default class CanvasCtxFactory {

    static zIndex = 0;

    constructor(width, height, definition) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position =  'absolute';
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;
        this.canvas.style.zIndex = CanvasCtxFactory.zIndex;
        CanvasCtxFactory.zIndex ++;
        if (width && height) this.initalScale(width, height, definition);
        const canvasCtx = this.getContext();
        return canvasCtx;
    }

    initalScale = (width, height, definition) => {
        if (this.canvas) {
            this.canvas.width = `${width * definition}`;
            this.canvas.height = `${height * definition}`;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
        }
    }

    getContext = () => {
        if(!this.canvas) return null;
        const canvasCtx = this.canvas.getContext("2d");
        canvasCtx.lineWidth = 1 * this.definition;
        return canvasCtx;
    }
}

class GeneralLayer {
    constructor(width, height, definition) {
        if (!width || !height) return null;
        this.width = width;
        this.height = height;
        this.definition = definition || 1;
        this.ctx = null;
    }

    ctxIsExist = (func) => {
        return (...props) => {
            if (!this.ctx) return;
            func.call(this, ...props);
        }
    }

    checkDataType = (func) => {
        return (...props) => {
            if (!this.ctx) return;
            func.call(this, ...props);
        }
    }
}

export {
    CanvasCtxFactory,
    GeneralLayer,
}