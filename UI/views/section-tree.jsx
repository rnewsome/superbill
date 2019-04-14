import React from 'react'
import _ from 'lodash'

class SectionTree extends React.Component {

    constructor(props) {
        super(props);
        this.onSelectItem = this.onSelectItem.bind(this);
    }

    onSelectItem(idx){
        this.props.onEvent({ "type": "on-favorites-group-add", "index": idx});
    }

    
    buildTree(children, level, fnContent) {
        var self = this;
        var nodes = _.map(children, c => {

            if(level != null && c.Index.Digit > level) return;

            var self = this;
            var content = fnContent(c);

            return <li key={c.Id} className="list-group-item list-group-item-secondary">
                {content}
                {self.buildTree(c.Children, level, fnContent)}
            </li>
        });
        return <ul className="branch list-group">{nodes}</ul>
    }

    render() {

        var dataSet = this.props.children;

        var nodes = _.map(dataSet, s => {
            var self = this;
            var fnContent = function(c) {
                return (c.Index.Digit == 4) ? <a href="#" onClick={(e) => self.onSelectItem(c.Index)} data-selectable="true">{c.Id}: {c.Description}</a>
                                            : <span>{c.Id}: {c.Description}</span>
            }
        
            return <li key={s.Id} className="list-group-item list-group-item-secondary">
                <span>{s.Id}: {s.Description}</span>
                {self.buildTree(s.Children, 4, fnContent)}
            </li>
        });

    return <ul className="tree-view list-group">{nodes}</ul>
  }
}
export default SectionTree