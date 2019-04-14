import React from 'react';
import _ from 'lodash';

import FormInlineField from './form-inline-field'
import FormInlineSelect from './form-inline-select'
import EditableGrid from './editable-grid'

import { ON_CANCEL, ON_PROPERTY_SUBMIT } from '../actions'

class FormInline extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.state;

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCancel(event) {
        this.props.onEvent({ "type": ON_CANCEL })
    }

    onSubmit(event) {
        console.log("onSubmit-form-inline", this.state);
        this.props.onEvent({"type": ON_PROPERTY_SUBMIT, "property": this.state});
    }

    onChange(event) {
        console.log("onChange-form-inline", event);
        this.setState({
            [event.id]: event.value
        });
    }

  render() {

    // var _units = units, numUnits = 0, aggRent = 0;
    
    // if(_units !== null && _units.length > 0) {
    //     numUnits = _units.length;            
    //     aggRent = _.reduce(_units, (sum, u) => {
    //         return sum + u.rate;
    //     }, 0);
    // }

    // var header = <h3># of Units: {numUnits} for {aggRent}/month</h3>;
    // var link = <div><a onClick={this.onAddUnit}>Add Unit</a></div>;

    var _editable = (this.props.context.mode == "add") ? true : false;
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                    <button className="btn btn-primary" onClick={this.onSubmit}>Submit</button> <button className="btn" onClick={this.onCancel}>Cancel</button>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 container">
                    <FormInlineField display="Address" id="address" value={this.state.address} onChange={this.onChange} editable={_editable} />
                    <FormInlineField display="City" id="city" value={this.state.city} onChange={this.onChange} editable={_editable} />
                    <FormInlineSelect display="State" id="state" value={this.state.state} onChange={this.onChange} options={["CT", "FL", "NJ", "NY"]} editable={_editable} />
                    <FormInlineField display="Zip" id="zip" value={this.state.zip} onChange={this.onChange} editable={_editable} />

                    <FormInlineField display="Price" id="price" value={this.state.price} onChange={this.onChange} editable={_editable} />
                    <FormInlineField display="Taxes" id="taxes" value={this.state.taxes} onChange={this.onChange} editable={_editable} />
                    <FormInlineField display="Reno" id="reno" value={this.state.reno} onChange={this.onChange} editable={_editable} />
                    <FormInlineSelect display="Type" id="type" value={this.state.type} onChange={this.onChange} options={["Multi-Family", "Single Family", "Townhouse"]} editable={_editable} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <EditableGrid rows={this.state.units} propertyId={this.state.id} onChange={this.onChange} />
                </div>
            </div>
        </div>
    );
  }
}

export default FormInline