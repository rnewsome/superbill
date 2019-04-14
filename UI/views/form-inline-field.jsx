import React from 'react';
import _ from 'lodash';

class FormInlineField extends React.Component {

    constructor(props) {
        super(props);
        
        var _editable = (this.props.editable != undefined) ? this.props.editable : false;
        this.state = Object.assign({}, props, { editable: _editable });

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onBlur(event) {
        console.log("on-blur", event);
        // this.setState({
        //     editable: false
        // })
    }

    onChange(event) {
        this.setState({
            value: event.target.value
        });
        this.props.onChange({ "id": this.state.id, "value": event.target.value });
    }

    onClick(event) {
        this.setState({
            editable: true
        })
    }

    render() {
        var _html, readonly = false;
        if(this.state.editable) {
            _html = <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor={this.state.id}>{this.state.display}</label>
                <input 
                    className="form-control col-sm-10" 
                    type="text" 
                    id={this.state.id}
                    placeholder={this.state.display}
                    value={this.state.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />
            </div>
        } else {
            _html = <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor={this.state.id}>{this.state.display}</label>
                <div onClick={this.onClick} className="col-sm-10 form-control-static">
                    {this.state.value}
                </div>
            </div>
        }

        return _html;
    }
}

export default FormInlineField