import React from 'react'
import _ from 'lodash'

import Code from './code'

class FavoriteList extends React.Component {

 constructor(props) {
    super(props);

    this.onSelectFavorite = this.onSelectFavorite.bind(this);
  }

  onSelectFavorite(action) {
    this.props.onEvent({ "type": "on-favorites-select", "id": action.code.Id, "group": this.props.group });
  }

  buildList(list) {
    var self = this;
    var items = _.map(list, (f, i) => {
        var c = f.item;
        return <Code key={c.Id} item={c} idx={i} onEvent={self.onSelectFavorite} cssClass="list-group-item list-group-item-secondary" />
    });
    return items;
  }

  render() {
    return (

        <ul className="list-group">
            {this.buildList(this.props.list)}
        </ul>

    );
  }
}
export default FavoriteList