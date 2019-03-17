import React from 'react';
import _ from 'lodash';

class FormInlineSelect extends React.Component {

    constructor(props) {
        super(props);
        var _editable = (this.props.editable != undefined) ? this.props.editable : false;
        this.state = Object.assign({}, props, { editable: _editable });

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onBlur(event) {
        this.setState({
            editable: false
        })
    }
  
    onChange(event) {
        this.setState({
            value: event.target.value,
            editable: false
        });
        this.props.onChange({ "id": this.state.id, "value": event.target.value });
    }

    onClick(event) {
        this.setState({
            editable: true
        })
    }

    render() {

        var _html;
        var options = _.map(this.props.options, function(o, idx){
            return <option key={o}>{o}</option>
        }); 
        options.unshift(<option key="blank"></option>);

        if(this.state.editable) {
            _html = <div className="form-group row">
                <label className="col-sm-2 col-form-label" htmlFor={this.state.id}>{this.state.display}</label>
                <select 
                    className="form-control col-sm-10"
                    id={this.state.id}                            
                    value={(this.state.value == null) ? "" : this.state.value }
                    onChange={this.onChange}
                >
                    {options}
                </select>
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

export default FormInlineSelect