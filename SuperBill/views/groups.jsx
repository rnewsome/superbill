import React from 'react'
import _ from 'lodash'

import FavoriteList from './favorite-list'

class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selectedItems: [], selectedGroup: "" }

        this.onExpandGroup = this.onExpandGroup.bind(this);
        this.onDeleteGroup = this.onDeleteGroup.bind(this);

        this.onGroupFavorites = this.onGroupFavorites.bind(this);

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    onSelectChange(event) {
        this.setState({
            selectedGroup: event.target.value
        });
    }

    onCheckboxChange(id) {
        var item = _.findIndex(this.state.selectedItems, x => x == id);
        if(item == -1) {
            this.setState({
                selectedItems: this.state.selectedItems.concat(id)
            });
        } else {
            this.setState({
                selectedItems: _.filter(this.state.selectedItems, x=> x != id)
            });
        }
    }

    onExpandGroup(e) {
        this.props.onEvent({ "type": "on-expand-group", "name": e });
    }

    onDeleteGroup(e) {
        this.props.onEvent({ "type": "on-delete-group", "name": e });
    }

    onGroupFavorites(e){
        this.props.onEvent({ "type": "on-add-favorites-to-group", "items": this.state.selectedItems, "name": this.state.selectedGroup});
    }

    buildGroupList(list) {
        var self = this;
        var items = _.map(list, (g, i) => {
            return <div key={g.name} id={i}>
                {g.name} [<a href="#" onClick={() => this.onExpandGroup(g.name)}>Expand</a> | <a href="#" onClick={() => this.onDeleteGroup(g.name)}>Delete</a>]

                {_.map(g.favorites, (f, i) => {
                    var item = f.item;
                    return <div key={item.Id} className="form-group">
                                <label>{item.Id}: {item.Description}</label>
                            </div>
                })}
            </div>
        });
        return items;
    }

    buildGroupOptions(list) {
        var self = this;

        var items = _.map(list, (g, i) => {
            return <option key={g.name} value={g.name}>{g.name}</option>
        });
        return items;
    }

    buildFavoriteList(list) {
        var self = this;
        var items = _.map(list, (f, i) => {
            var item = f.item;
            return <div key={item.Id} className="form-group">
                        <label><input type="checkbox" onChange={() => this.onCheckboxChange(item.Id)} /> {item.Id}: {item.Description}</label>
                    </div>
        });
        return items;
    }
    

    render() {
        return (
            <div className="container-fluid">
                <div className="row">

                    <div className="col-sm-6">

                        <div className="form-inline">
                            <select id="groups" className="form-control" onChange={this.onSelectChange}>
                                {this.buildGroupOptions(this.props.state.groups)}
                            </select>
                            <button className="btn btn-primary" onClick={this.onGroupFavorites}>Group</button>
                        </div>

                        {this.buildFavoriteList(this.props.state.favorites)}

                    </div>


                    <div className="col-sm-6">

                        {this.buildGroupList(this.props.state.groups)}

                    </div>

                </div>
            </div>
        );
    }
}

export default Groups