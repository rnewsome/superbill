import React from 'react'
import _ from 'lodash'

class Code extends React.Component {

 constructor(props) {
    super(props);

    this.onSelectCode = this.onSelectCode.bind(this); 
  }

  onSelectCode(code, idx, isLastNode) {
    this.props.onEvent({ "type": "onSelectCode", "code": code, "idx": idx, "isLastNode": isLastNode });
  }

  render() {

    var isLastNode = (this.props.item.Children == null || this.props.item.Children.length == 0);

    return (
        <li key={this.props.item.Id} className={(this.props.cssClass == undefined) ? "" : this.props.cssClass}>
            <a href="#" onClick={(e) => this.onSelectCode(this.props.item, this.props.idx, isLastNode)}>{this.props.item.Id}: {this.props.item.Description}</a>
        </li>
    );
  }
}
export default Code