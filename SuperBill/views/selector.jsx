import React from 'react'
import _ from 'lodash'

import Wizard from './wizard'
import FavoriteList from './favorite-list'
import SectionTree from './section-tree'
import GroupList from './group-list'

class Selector extends React.Component {

 constructor(props) {
    super(props);

    this.onViewToggle = this.onViewToggle.bind(this);
  }

  onViewToggle(view) {
    this.props.onEvent({ "type": "on-view-toggle", "view": view});
  }

  render() {

    var leftPane = <div />
    var rightPane = <div />
    var leftPaneHeader = null

    var group = _.find(this.props.state.groups, (g, i) => g.name == this.props.state.groupContext.selected);

    // Group Selected
    if(group != undefined) {
      var selected = (this.props.state.context.selected != null) 
                      ? _.find(group.favorites, x=> x.id == this.props.state.context.selected.item)
                      : undefined;

      // Select
      if(this.props.state.groupContext.mode == "select") {

        rightPane = <SectionTree children={this.props.state.master.Sections} onEvent={this.props.onEvent} />
        
        leftPaneHeader = <GroupList list={[group]} context={this.props.state.groupContext} onEvent={this.props.onEvent} showForm={false} />
        leftPane = (selected != undefined) 
                    ? <Wizard selected={selected} context={this.props.state.context} onEvent={this.props.onEvent} />
                    : <FavoriteList group={group.name} list={group.favorites} onEvent={this.props.onEvent} />

      } 
      // View
      else { 

        leftPane = <GroupList list={this.props.state.groups} context={this.props.state.groupContext} onEvent={this.props.onEvent} />
        rightPane = (selected != undefined) 
                    ? <Wizard selected={selected} context={this.props.state.context} onEvent={this.props.onEvent} />
                    : <FavoriteList group={group.name} list={group.favorites} onEvent={this.props.onEvent} />

      }
    } 
    
    // Group Context not set (Add Groups)
    else {
      leftPane = <GroupList list={this.props.state.groups} context={this.props.state.groupContext} onEvent={this.props.onEvent} />
    }

    return (
        <div className="container-fluid">

          <div className="row">
            <div className="col-lg-6">
              {leftPaneHeader}
              {leftPane}
            </div>

            <div className="col-lg-6">
              {rightPane}
            </div>
          </div>
        </div>
    );
  }
}

export default Selector