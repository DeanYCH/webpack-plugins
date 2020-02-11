import CanvasLayer from './lib';

export default class Radar {
    // 1、setHangPoint; 2、initialBaseMap；3、drawMap;4、combineLayer & hangOut
    // ElId: 挂载的节点id， definition: 画布清晰度等级，为整数，清晰度越高，线越清晰
    constructor(ElId, definition) {
        this.data = null;
        this.radar = null;
        this.baseLayerQuene = [];
        this.dataLayerQuene = [];
        this.setHangPoint(ElId);
        this.setPictureFeature(definition);
        this.initial();
    }

    setData = (data) => {
        if (!(data instanceof Array)) return;
        // data 的元素为百分比[0.1, 0.2, 0.4],该百分比即相对于半径的百分比，
        // 这样设百分比为a, 半径为r,则[deg, a*r]即是该点的极坐标, 其中deg为this.Axis中定义的几个坐标轴的角度

        this.data = data.map((percent, ind) => {
            const lineLength = percent * (this.width/2)-this.margin;
            const deg = this.Axis[ind];
            return [deg, lineLength];
        });
        this.drawMap();
    }

    setHangPoint = (Elid) => {
        this.hangPoint = Elid;
        this.root = document.createElement('div');
    }

    setPictureFeature = (definition) => {
        this.margin = 1; // 默认的canvas留边，当可能绘到canvas边缘时，应减掉该值，以留出边缘
        this.definition = definition;
        this.Axis = [90, 210, 330];
    }

    initial = () => {
        if (!this.hangPoint) return;
        const El = document.getElementById(this.hangPoint);
        if (!El) return;
        const { width, height } = El.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.MapCenterX = this.width/2;
        this.MapCenterY = this.height/2;
        this.drawBaseMap();
    }

    drawBaseMap = () => {
        const firstLayer = new CanvasLayer(this.width, this.height, this.definition);
        firstLayer.drawCircle([0.5, 0.5, (this.width / 2) - this.margin], {
            fill: {
                color: '#efeff4', opacity: 0.1
            },
            line: {
                color: '#efeff4', opacity: 0.2
            }
        });
        const secondLayer = new CanvasLayer(this.width, this.height, this.definition);
        secondLayer.drawPolygon({
            center: [this.MapCenterX, this.MapCenterY],
            vertex: this.Axis.map((deg) => {
                return [deg, (this.width / 2) - this.margin];
            }),
        }, {
            fill: {
                color: '#efeff4', opacity: 0.1
            },
            line: {
                color: '#efeff4', opacity: 0.1
            }
        });
        const thirdLayer = new CanvasLayer(this.width, this.height, this.definition);
        this.Axis.forEach((deg) => {
            thirdLayer.drawRay({
                originPoint: [this.MapCenterX, this.MapCenterY],
                vertex: [deg, (this.width / 2) - this.margin],
            }, {
                type: 'dash',
                ll: 1 * this.definition,
                bl: 2 * this.definition,
                color: '#efeff4',
                opacity: 0.3,
            });
        });
        this.clearQuene(this.baseLayerQuene);
        this.baseLayerQuene = this.baseLayerQuene.concat([firstLayer.ctx.canvas, secondLayer.ctx.canvas, thirdLayer.ctx.canvas]);
        this.hangLayer(this.baseLayerQuene);
    }

    drawMap = () => {
        const firstLayer = new CanvasLayer(this.width, this.height, this.definition);
        firstLayer.drawPolygon({
            center: [this.MapCenterX, this.MapCenterY],
            vertex: this.data,
        }, {
            fill: {
                color: 'rgba(229, 194, 143, 0.8)', opacity: 0.1
            },
            line: {
                color: '#e5c28f', opacity: 1
            }
        });
        const secondLayer = new CanvasLayer(this.width, this.height, this.definition);
        this.data.forEach((vertex) => {
            const circleR = 3 * this.width / 138;
            secondLayer.drawDiscretionalCircle([this.MapCenterX, this.MapCenterY], vertex, circleR, {
                fill: {
                    gradient: {
                        type: 'radial',
                        sColor: '#ffffff',
                        eColor: 'rgba(255, 255, 255, 0)',
                    }
                    // color: 'rgba(255, 255, 255, 0.1)', opacity: 0.1
                },
                line: {
                    color: '#ffffff', opacity: 0
                }
            });
        });
        this.clearQuene(this.dataLayerQuene);
        this.dataLayerQuene = this.dataLayerQuene.concat([firstLayer.ctx.canvas, secondLayer.ctx.canvas]);
        this.hangLayer(this.baseLayerQuene.concat(this.dataLayerQuene));
    }

    clearQuene = (quene) => {
        if (this.hangPoint) {
            const hangEl = document.getElementById(this.hangPoint);
            while (quene.length) {
                const canvas = quene.pop();
                hangEl.removeChild(canvas);
            }
        }
    }

    hangLayer = (quene) => {
        if (this.hangPoint) {
            const hangEl = document.getElementById(this.hangPoint);
            quene.forEach((canvas) => {
                hangEl.appendChild(canvas);
            });
        }
    }
}
