import React from 'react';
import _ from 'lodash';

class EditableGrid extends React.Component {

    constructor(props) {
        super(props);

        this.state = ({
            editRowIdx: null,
            rows: []
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleOnToggle = this.handleOnToggle.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleOnAddRecord = this.handleOnAddRecord.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount(){
        this.setState({
            rows: this.props.rows,
            propertyId: this.props.propertyId
        });
    }

    handleSave(evt) {
        this.props.onChange({ "id": "units", value: this.state.rows });
        this.setState({ editRowIdx: null });        
    }

    handleOnToggle(idx) {
        this.setState({ editRowIdx: idx });
    }

    handleOnAddRecord() {
        this.setState({ 
            rows: this.state.rows.concat({ "Id": null, "propertyId": this.state.propertyId, "rate": 0, "bedrooms": 0, "bathrooms": 0 }),
            editRowIdx: this.state.rows.length
        });
    }

    handleChange(evt) {
        if(this.state.rows.length > 0) {
            var _item = this.state.rows.slice(this.state.editRowIdx, this.state.editRowIdx+1)[0];
            _item[evt.target.id] = evt.target.value;

            var _rows = this.state.rows.slice(0, this.state.editRowIdx).concat([_item]).concat(this.state.rows.slice(this.state.editRowIdx + 1))
            this.setState({
                rows: _rows
            });
        }
    }

    handleDelete(idx) {
        if(this.state.rows.length > 0) {
            var _rows = this.state.rows.slice(0, idx).concat(this.state.rows.slice(idx + 1))
            this.setState({
                rows: _rows
            });
        }
    }

    buildRow(row, idx) {
        var html;
        var key = (row.id == null) ? "NEW" + idx : row.id;
        
        if (this.state.editRowIdx == idx) {
            // Editing Row
            html = <tr key={key} >
                <td><input className="form-control" type='text' onChange={this.handleChange} id="rate" value={row.rate} /></td> 
                <td><input className="form-control" type='text' onChange={this.handleChange} id="bedrooms" value={row.bedrooms} /></td>
                <td><input className="form-control" type='text' onChange={this.handleChange} id="bathrooms" value={row.bathrooms} /></td>
                <td><button className="btn btn-primary" onClick={this.handleSave}>Submit</button></td>
            </tr>;
        }
        else {
            // Normal Row
            html = <tr key={key} onClick={() => { return this.handleOnToggle(idx); }}>
                <td>{row.rate}</td> 
                <td>{row.bedrooms}</td>
                <td>{row.bathrooms}</td>
                <td><button className="btn btn-primary" onClick={() => { return this.handleDelete(idx); }}>Delete</button></td>
            </tr>;
        }
        return html;
    }

    render() {
        var items = _.map(this.state.rows, (row, idx) => {
            return this.buildRow(row,idx);
        });

        return (
            <div>
                <button className="btn btn-primary" onClick={this.handleOnAddRecord}>Add</button>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th width="30%">Rate</th>
                            <th width="30%">Bedrooms</th>
                            <th width="30%">Bathrooms</th>
                            <th width="10%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default EditableGrid