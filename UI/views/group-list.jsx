import React from 'react'
import _ from 'lodash'

import Code from './code'

class GroupList extends React.Component {

 constructor(props) {
    super(props);

    this.state = { name: "" };

    this.onAddGroup = this.onAddGroup.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelectGroup = this.onSelectGroup.bind(this);
  }

  onAddGroup(e){
        this.props.onEvent({ "type": "on-add-group", "name": this.state.name, "description": "" });
    }

    onChange(event) {
        this.setState({
            name: event.target.value
        });
    }  

  onSelectGroup(name) {
    this.props.onEvent({ "type": "on-group-select-view", "name": name, "mode": "select" });
  }

  onViewGroup(name) {
    this.props.onEvent({ "type": "on-group-select-view", "name": name, "mode": "view" });
  }

  buildList(list) {
    var self = this;
    var context = this.props.context;

    var items = _.map(list, (g, i) => {

        var cssView = (context.mode == "view" && context.selected == g.name) ? "btn btn-primary" : "btn btn-secondary";
        var cssSelected = (context.mode == "select" && context.selected == g.name) ? "btn btn-primary" : "btn btn-secondary";

        return <li key={g.name} className="list-group-item list-group-item-secondary d-flex justify-content-between">

                <label><span className="badge badge-primary badge-pill">{g.favorites.length}</span> {g.name}</label>
                <div className="btn-group" role="group">
                    <button type="button" className={cssSelected} onClick={e => this.onSelectGroup(g.name)}>Select</button>
                    <button type="button" className={cssView} onClick={e => this.onViewGroup(g.name)}>View</button>
                    <button type="button" className="btn">Delete</button>
                </div>
            </li>
    });
    return <ul className="list-group">{items}</ul>;
  }

  render() {

    var form = (this.props.showForm == false) 
            ? <div /> 
            : <div className="d-flex">
                <button className="btn btn-primary" onClick={this.onAddGroup}>Add Group</button>
                <input autoFocus id="newGroup" className="form-control ml-2" onChange={this.onChange}></input>
            </div>
    return (
        <div>
            {form}
            <div className="pt-2">{this.buildList(this.props.list)}</div>
        </div>
    );
  }
}
export default GroupList