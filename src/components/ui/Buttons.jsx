import React, { Component } from 'react';

class Button extends Component{
    constructor(props) {
        super(props);
        this.state = {
            min_height: window.innerHeight - 85
        };
    }
    render (){
        const type = this.props.type;
        return(
            <button onClick={this.props.onClick} className={"btn btn-"+type}>{this.props.children}</button>
        )
    }
}

export default Button;
