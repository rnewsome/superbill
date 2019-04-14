import React from 'react'

import Superbill from './super-bill'
import Selector from './selector'
import Groups from './groups'

// import $ from "jquery"
// import Bootstrap from 'bootstrap'

class Root extends React.Component {

 constructor(props) {
    super(props);

    this.onEvent = this.onEvent.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
  }

  onEvent(e) {
    this.props._dispatcher(e);
  }

  onNavigate(page) {
    this.onEvent({ "type": "on-navigate", "page": page });
  }

  render(){

    var _view = this.props.state.navigation;
    switch(_view){
      case "superbill":
        _view = <Superbill state={this.props.state} onEvent={this.onEvent} />
        break;
      case "groups":
      case "selector": 
      default:
        _view = <Selector state={this.props.state} onEvent={this.onEvent} />
        break;
    }

    return (
      <div id="application">

        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        
          <a className="navbar-brand" href="#">Navbar w/ text</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={e=> this.onNavigate("selector")}>Selector</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={e=> this.onNavigate("superbill")}>Super Bill</a>
              </li>
            </ul>
          </div>

        </nav>

        <div id="content" className="content-area pt-2">
          {_view}
        </div>

      </div>
    );
  }
}

export default Root