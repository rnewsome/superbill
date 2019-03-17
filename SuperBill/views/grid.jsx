var React = require('react');
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { ON_PROPERTY_DETAILS } from '../actions'

class Grid extends React.Component {

 constructor(props) {
    super(props);

    this.onRowSelect = this.onRowSelect.bind(this);
  }

  onRowSelect(row, isSelected, e) {
    this.props.onEvent({ "type": ON_PROPERTY_DETAILS, "id": row["id"], "selected": isSelected })
  }

  render() {
    var rows = this.props.data;

    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.onRowSelect
    };

    return (
      <div id="property-table">
        <BootstrapTable data={rows} selectRow={selectRowProp}> 
            <TableHeaderColumn isKey dataField='id' hidden>Id</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='address'>Address</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='city'>City</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='state'>State</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='zip'>Zip</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='price'>Price</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default Grid