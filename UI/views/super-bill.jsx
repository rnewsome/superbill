import React from 'react'
import _ from 'lodash'

import Wizard from './wizard'

class Superbill extends React.Component {

 constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(group, id, fav) {
    console.log(group,id, fav);
    this.props.onEvent({ "type": "on-favorites-select", "id": id, "group": group});
  }

  buildFavorites(groups) {
    var self = this;
    var items = _.map(groups, function(g, i){

        return <div className="card">
            <div className="card-header">
                <h5>{g.name}</h5>
            </div>
            <ul className="list-group list-group-flush">
                {_.map(g.favorites, function(f, idx) {
                    return <li className="list-group-item list-group-item-secondary"><a href="#" onClick={e=> self.onSelect(g.name, f.id, f.item)}>{f.id}: {f.item.Description}</a></li>
                })}
            </ul>
        </div>
    });

    return items;
  }

  render() {
    var rows = this.props.data;

    var groups = this.props.state.groups;
    var context = this.props.state.context;

    var items = this.buildFavorites(groups);
    var chunks = (items.length > 0) ? items.length / 4 : 0;
    var itemCols = _.chunk(items, chunks);

    var cols = _.map(itemCols, function(i, idx){
        return <div className="col-sm-3">
                    {i}
                </div>
    })

    var selected = null;
    if(this.props.state.context.selected != null) {
        var group = _.find(this.props.state.groups, (g, i) => g.name == this.props.state.context.selected.group);
        if(group != undefined) {
            selected = _.find(group.favorites, x=> x.id == this.props.state.context.selected.item);
        }
    }
    
    return (
        <div id="wrapper" className="container-fluid">
            <div className="row">

            {(this.props.state.context.selected == null) ? cols : <Wizard selected={selected} context={this.props.state.context} onEvent={this.props.onEvent} /> }

            </div>
        </div>
    );
  }
}
export default Superbill