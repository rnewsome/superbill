import React from 'react'
import _ from 'lodash'

import Code from './code'

class Wizard extends React.Component {

 constructor(props) {
    super(props);

    this.onCancelWizard = this.onCancelWizard.bind(this);
    this.onCodeSelection = this.onCodeSelection.bind(this);
    this.onPartSelection = this.onPartSelection.bind(this);
    this.onBilCode = this.onBilCode.bind(this);
  }

  onCodeSelection(action) {
    this.props.onEvent({ "type": "on-wizard-select", "item": action.code, "id": action.code.Id, "idx": action.idx, "isLastNode": action.isLastNode, "rules": action.code.Rules });
  }

  onPartSelection(pos, id) {
    this.props.onEvent({ "type": "on-wizard-part-select", "id": id, "idx": pos });
  }

  onBilCode() {
    this.props.onEvent({ "type": "on-wizard-bill-code" });
  }

  onCancelWizard() {
    this.props.onEvent({ "type": "on-cancel-wizard"});
  }

  buildList(list, fnOnClick) {

    if(list == null || list.length == 0) return null;

    var self = this;
    var items = _.map(list, (c, i) => {
        return <Code key={c.Id} item={c} idx={i} onEvent={self.onCodeSelection} cssClass="list-group-item list-group-item-secondary" />;
    });
    return <ul className="list list-group">{items}</ul>;
  }

  buildPath(selected, path, pathIdx) {    
    var items = null;
    var pos = path.length - pathIdx;
    var section = <div>{(selected.Children == null || selected.Children.length == 0) ? "Complete: " : "Incomplete: " }<a href="#" onClick={(e) => this.onPartSelection(pos, selected.Id)}>{selected.Id}: {selected.Description}</a></div>;    

    if(pos == 0) {
      items = <li className="list-group-item list-group-item-secondary">{section}{this.buildList(selected.Children)}</li>
    } else {
      items = <li className="list-group-item list-group-item-secondary">{section}{this.buildPath(selected.Children[path[pathIdx]], path, pathIdx+1)}</li>
    }

    return <ul className="list list-group">{items}</ul>
  }

  buildRules(rules) {

    var cleanRules = _.filter(rules, x => x != null);

    var codeFirst = _.map(_.filter(cleanRules, c => c.CodeFirst != null), function(c, i) { return <div key={i}>{c.CodeFirst}</div> });
    var useAdditionalCodes = _.map(_.filter(cleanRules, c => c.UseAdditionalCodes != null), function(c, i) { return <div key={i}>{c.UseAdditionalCodes}</div> });
    var excludes1 = _.map(_.filter(cleanRules, c => c.Excludes1 != null), function(c, i) { return <div key={i}>{c.Excludes1}</div> });
    var excludes2 = _.map(_.filter(cleanRules, c => c.Excludes2 != null), function(c, i) { return <div key={i}>{c.Excludes2}</div> });

    return <div>
      <h5>Code First</h5>
      {(codeFirst.length == 0) ? "None" : codeFirst}
      
      <h5>Additional Codes</h5>
      {(useAdditionalCodes.length == 0) ? "None" : useAdditionalCodes}

      <h5>Excludes 1</h5>
      {(excludes1.length == 0) ? "None" : excludes1}
      
      <h5>Excludes 2</h5>
      {(excludes2.length == 0) ? "None" : excludes2}
    </div>
  }

  render() {
    var context = this.props.context;
    var selected = this.props.selected;

    var html = this.buildPath(selected.item, context.path, 0);
    var htmlRules = this.buildRules(context.pathRules);

    var billBtn = (context.isLastNode) ? <div><button className="btn btn-primary" onClick={this.onBilCode}>Bill {context.code}</button></div> : <div></div>
    var status = (context.isLastNode) ? "alert alert-success" : "alert alert-danger";

    return (
          <div>
            <a href="#" onClick={this.onCancelWizard}>Cancel</a>
            <div className={status}>
              <h4>Current Code: {context.code}</h4>
            </div>
            {billBtn}
            <br />
            {html}
            <br />
            {htmlRules}
          </div>
    );
  }
}
export default Wizard