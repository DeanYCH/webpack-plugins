import CanvasCtxFactory, { GeneralLayer } from "./base";
import TransformSyntax from "./util";

// 出现的所有角度均为deg，逆时针旋转的角度
// 平面坐标系与极坐标系和数学中坐标系一致
export default class CanvasLayer extends GeneralLayer {

    constructor(width, height, definition) {
        super(width, height, definition);
        this.ctx = new CanvasCtxFactory(this.width, this.height, this.definition);
        const funcNames = Object.getOwnPropertyNames(this.__proto__);
        funcNames.forEach((name) => {
            if (name === 'ctxIsExist' || name === 'constructor') return;
            this[name] = this.ctxIsExist(this[name]);
        });
        return this;
    }

    drawDiscretionalCircle = (center, poi, circleR, style) => {
        // center [x, y], poi [deg, r]
        if (!(poi instanceof Array) && !(center instanceof Array)) return;
        let centerX, centerY;
        centerX = Math.cos(poi[0] * Math.PI / 180 || 0) * poi[1] + center[0];
        centerY = center[1] - Math.sin(poi[0] * Math.PI / 180 || 0) * poi[1];
        this.drawCircle([centerX, centerY, circleR], style);
    }
    // 绘制圆
    drawCircle = (poi, style) => {
        // poi 为相对于画布长和宽的百分比相对位置以及半径, 画布左上角为圆点
        if (!poi || poi.length < 3) return;
        let x = poi[0], y = poi[1], r = poi[2];
        if (typeof x === 'string') {
            if (/%/ig.test(x)) {
                x = Number.parseFloat(x) / 100;
                y = Number.parseFloat(y) / 100;
            }
            else if (/px/ig.test(x)) {
                x = Number.parseFloat(x) / this.width;
                y = Number.parseFloat(y) / this.height;
            }
            else return;
        }
        if (x < 1) {
            x = Number.parseFloat(x) * this.width;
            y = Number.parseFloat(y) * this.height;
        }
        if (typeof r === 'string' && /px/ig.test(r)) {
            r = Number.parseFloat(r);
        }
        this.ctx.beginPath();
        this.ctx.arc(this.definition * x, this.definition * y, this.definition * r, 0, 2 * Math.PI);
        if (style.line && style.line.color) this.ctx.strokeStyle = new TransformSyntax(style.line.color, style.line.opacity).rgb;
        else if (style.line) this.ctx.strokeStyle = style.line.style;
        this.ctx.stroke();
        if (style.fill) {
            const gradient = style.fill.gradient;
            if (gradient){
                if (gradient.type === 'radial'){
                    style.fill.gradient = {
                        type: 'radial',
                        sx: poi[0],
                        sy: poi[1],
                        sr: 0.1,
                        sColor: '',
                        ex: poi[0],
                        ey: poi[1],
                        er: poi[2],
                        eColor: '',
                        ...gradient,
                    }
                }
                else {
                    style.fill.gradient = {
                        type: 'liner',
                        ...gradient,
                    }
                }
            }
            this.drawFill(style.fill);
        }
    }

    // 绘制多边形
    drawPolygon = (data, style) => {
        let center = [0, 0], FlatvertexData;
        // 'center'为已 data.center为中心(x, y)画多边形，
        // data.vertex为多边形全部顶点相对于中心的极坐标（deg, r）形成的数组
        if (!(data.center instanceof Array) || !(data.vertex instanceof Array)) return;
        if (data.center.length === 2) center = data.center;
        FlatvertexData = data.vertex.map((vertex, ind) => {
            return [Math.cos(vertex[0] * Math.PI / 180 || 0) * vertex[1] + center[1], center[0] - Math.sin(vertex[0] * Math.PI / 180 || 0) * vertex[1] ]
        });
        this.drawClosedPath(FlatvertexData, style);
    }

    drawClosedPath = (data, style) => {
        if (!data || !(data instanceof Array) || data.length < 2) return;
        this.ctx.beginPath();
        data.forEach((vertex, ind) => {
            if(ind === 0) {
                this.ctx.moveTo(this.definition * vertex[0], this.definition * vertex[1]);
                return;
            }
            this.ctx.lineTo(this.definition * vertex[0], this.definition * vertex[1]);
        });
        this.ctx.closePath();
        if (style.line && style.line.color) {
            this.ctx.strokeStyle = new TransformSyntax(style.line.color, style.line.opacity).rgb;
        } else if (style.line){
            this.ctx.strokeStyle = style.line.style;
        }
        this.ctx.stroke();
        if (style.fill) this.drawFill(style.fill);
    }

    drawFill = (style) => {
        // style { color , opacity, pattern, gradient ={type, sx, sy, sr, sColor, ex, ey, er, eColor} },前缀 s 为开始位置， 前缀 e 为结束位置
        if (typeof style !== 'object') return;
        let color, opacity = 1, grd;
        if (style.color) {
            if (style.opacity || style.opacity === 0) opacity = style.opacity;
            color = new TransformSyntax(style.color, opacity).rgb;
            this.ctx.fillStyle = color;
        }
        if (style.gradient) {
            const gradient = style.gradient
            if (gradient.type === 'liner') {
                grd = this.ctx.createLinearGradient(gradient.sx, gradient.sy, gradient.ex, gradient.ey);

            } else if (gradient.type === 'radial') {
                grd = this.ctx.createRadialGradient(gradient.sx, gradient.sy, gradient.sr, gradient.ex, gradient.ey, gradient.er);
            }
            grd.addColorStop(0, new TransformSyntax(gradient.sColor, 1).rgb);
            grd.addColorStop(1, new TransformSyntax(gradient.eColor, 1).rgb);
            this.ctx.fillStyle = grd;
        }
        this.ctx.fill();
    }

    //绘制放射线
    drawRay = (data, style) => {
        // data.originPoint [x,y]， data.vertex [deg, r]
        if (typeof data !== 'object' || !data.originPoint || !data.vertex) return;
        let startX = data.originPoint[0], startY = data.originPoint[1],
            endX = Math.cos(data.vertex[0] * Math.PI / 180 || 0) * data.vertex[1] + startX, 
            endY = startY - Math.sin(data.vertex[0] * Math.PI / 180 || 0) * data.vertex[1];
        this.drawLine([[startX, startY], [endX, endY]], style);
    }

    // 绘制线
    drawLine = (data, style) => {
        // data为二维数组[[startX, startY], [endX, endY]]，单位为px
        // style { type, ll, bl, color,  }为line的颜色等设置, 'dash'为虚线，ll为线长，bl为断长
        if (!(data instanceof Array)) return;
        if (data.length !== 2) return;
        let startX = data[0][0],
            startY = data[0][1],
            endX = data[1][0],
            endY = data[1][1];
        if (typeof startX === 'string') {
            startX = Number.parseFloat(startX);
            startY = Number.parseFloat(startY);
            endX = Number.parseFloat(endX);
            endY = Number.parseFloat(endY);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.definition * startX, this.definition * startY);
        this.ctx.lineTo(this.definition * endX, this.definition * endY);
        if (typeof style === 'object'){
            if (style.type === 'dash') {
                // 虚线
                this.ctx.setLineDash([style.ll, style.bl]);
            }
            if (style.color) this.ctx.strokeStyle = new TransformSyntax(style.color, style.opacity).rgb;
            else if (style.style) this.ctx.strokeStyle = style.style;
        }
        this.ctx.stroke();
    }

    drawTextPanel = (text, url, poi) => {
        // poi [x, y, width, height], 
        // 其中 x, y指textpanel的中心坐标，width ,height指textpanel的尺寸
        let imgPoi, textPoi;

        if (url) this.drawImage(url, imgPoi);
        if (text) this.drawText(text, textPoi)
    }

    drawImage = (url, poi) => {
        // poi [x, y, width, height]
        if (!url || !(poi instanceof Array)) return;
        const img = document.createElement('img');
        img.src = url;
        ctx.drawImage(img, poi[0], poi[1], poi[2], poi[3]);
    }

    drawText = (text, poi) => {
        // text {text, style: {color, font}}, poi [x, y] 文字绘制的起始坐标
        if (!text || !(poi instanceof Array)) return;
        if (text.style){
            const style = text.style;
            this.ctx.fillStyle = style.color;
            this.ctx.font = style.font // "30px Verdana";
        }
        this.ctx.fillText(text.text, poi[0], poi[1]);
    }
}