

function TransformSyntax(str, opacity) {
    this.opacity = opacity || 0;
    this.origin = str;
    this.reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    this.hex = this.Rgb2Hex();
    this.rgb = this.Hex2Rgb();
}

/*16进制转为RGB*/
TransformSyntax.prototype.Hex2Rgb = function () {
    let sColor = this.origin.toLowerCase();
    if (sColor && this.reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        sColorChange.push(parseFloat(this.opacity));
        return "RGBA(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
};

/*RGB颜色转换为16进制*/
TransformSyntax.prototype.Rgb2Hex = function () {
    const that = this;
    if (/^(rgb(a)?|RGB(A)?)/.test(this.origin)) {
        let aColor = this.origin.replace(/(?:\(|\)|rgb(a)?|RGB(A)?)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < 3; i++) {
            let hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;

    } else {
        return that;
    }
};

export default TransformSyntax;
