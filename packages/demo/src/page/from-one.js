
import React, { creatRef } from "react";
import ReactDom from 'react-dom';
import Radar from "radar";

class DrawARadar extends React{
    constructor(props){
        super(props);
        this.firstCanvas = creatRef();
    }

    componentDidMount(){
        this.secondCanvas = document.querySelector('#canvas');
        this.secondRadar = new Radar('canvas');
    }

    render(){
        return (<div>
            <div id="canvas" />
            <div ref={this.firstCanvas} />
        </div>)
    }
}

ReactDom.render(<DrawARadar />, document.querySelector('#root'));
