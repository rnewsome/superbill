import React from 'react';

var EditableCell = React.createClass({
    getInitialState: function () {
        return {
            isEditMode: false,
            data: ""
        };
    },
    componentWillMount: function () {
        this.setState({
            isEditMode: this.props.isEditMode,
            data: this.props.data
        });
    },
    handleEditCell: function (evt) {
        this.setState({isEditMode: true});

    },
    handleKeyDown: function (evt) {
        switch (evt.keyCode) {
            case 13: // Enter
            case 9: // Tab
                this.setState({isEditMode: false});
                break;
        }
    },
    handleChange: function (evt) {
        this.setState({data: evt.target.value});
    },
    render: function () {
        var cellHtml;
        if (this.state.isEditMode) {
            cellHtml = <input type='text' value={this.state.data}
                onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
        }
        else {
            cellHtml = <div onClick={this.handleEditCell}>{this.state.data}</div>
        }
        return (
            <td>{cellHtml}</td>
            );
    }
});

export default EditableCell