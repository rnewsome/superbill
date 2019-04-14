import _ from 'lodash'

function reducer(state = {}, action) {
    
    switch(action.type) {


        case "on-navigate":
            return Object.assign(state, { navigation: action.page })


            
        // *********************************************************
        // ICD10 Wizard Functions
        // *********************************************************

        case "on-favorites-select":

            var groupIdx = _.findIndex(state.groups, x=> x.name == action.group);
            if(groupIdx != -1) {

                var _item = state.groups.slice(groupIdx, groupIdx+1)[0];
                var fav = _.find(_item.favorites, x => x.id == action.id);
                var isLastNode = (fav.item.Children == null || fav.item.Children.length == 0);

                var initRules = (fav.rules == undefined) ? ((fav.item.Rules == undefined) ? [null] : fav.item.Rules.concat([])) : fav.rules.concat(fav.item.Rules);
                return Object.assign(state, { context: { "selected": { "group": action.group, "item": action.id }, "path": [], code: action.id, "isLastNode": isLastNode, "pathRules": initRules }})
            } else {
                return state;
            }


        case "on-cancel-wizard":
            return Object.assign(state, { context: { "selected": null, "path": [], code: "", "isLastNode": false }});



        case "on-wizard-select":
            
            var code = action.id.length == 1 ? state.context.code + '' + action.id : action.id;
            var tmpRules = (action.rules != null && (action.rules.CodeFirst != null || action.rules.UseAdditionalCodes != null || action.rules.Excludes1 != null || action.rules.Excludes2 != null)) ? state.context.pathRules.concat(action.rules) : state.context.pathRules.concat(null);
            
            return Object.assign(state, { context: { 
                "selected": state.context.selected, 
                "path": state.context.path.concat([action.idx]), 
                "code": code, 
                "isLastNode": action.isLastNode,
                "pathRules": tmpRules
            }});



        case "on-wizard-part-select":
    
            var numberToPop = action.idx;
            var tmpPath = [];

            if(numberToPop < state.context.path.length) {
                tmpPath = state.context.path.slice(0, state.context.path.length - numberToPop);
            } 

            return Object.assign(state, { context: { "selected": state.context.selected, "path": tmpPath, code: state.context.code, "isLastNode": state.context.isLastNode }});


        case "on-wizard-bill-code":
            console.log("onBilCode");
            return state;



        // *********************************************************
        // Grouping Functions
        // *********************************************************

        case "on-add-group":
            if(_.find(state.groups, x=> x.name == action.name) == undefined) {
                return Object.assign(state, { groups: state.groups.concat({ "name": action.name, "description": action.description, "favorites": [] }) })
            } else {
                return state;
            }



        case "on-delete-group":
            return Object.assign(state, { groups: _.filter(state.groups, function(x) { 
                    return x.name != action.name; 
                })
            })



        case "on-group-select-view":
            return Object.assign(state, { groupContext: { 
                "selected": ( state.groupContext.selected == action.name) ? "" : action.name,
                "mode": action.mode
            }});



        case "on-favorites-group-add":

            var groupIdx = _.findIndex(state.groups, x=> x.name == state.groupContext.selected);
            if(groupIdx != -1) {

                var _item = state.groups.slice(groupIdx, groupIdx+1)[0];
                var alreadySelected = _.find(_item.favorites, f => f.id == action.index.Id);
                
                if(alreadySelected == undefined) {
                    var fav = binarySearch(state.master.Sections, action.index, []);
                    if(fav.item == null || fav.item == undefined) {
                        console.log("binary-search-fail-alpha-character-bug");
                        return state;
                    } else {
                        _item.favorites.push(fav);
                        console.log("on-favorites-group-add", _item, fav);
                        return Object.assign(state, { groups: state.groups.slice(0, groupIdx).concat([_item]).concat(state.groups.slice(groupIdx + 1)) })
                    }
                } else { return state; }
                
            } else {
                return state;
            }


        default:
            return state;    
    }
}


  function binarySearch(list, index, rules) {
    var lo = 0,
        hi = list.length - 1, 
        mid = 0,
        idx = null,
        item = null,
        fcheck = null,
        scheck = null;

    while(item == null && lo <= hi) {

        mid = Math.floor((hi + lo)/2);
        idx = list[mid].Index;

        fcheck = getComparable(index.Digit - idx.Digit, index.First, idx.First);
        scheck = getComparable(index.Digit - idx.Digit, index.First, idx.Last);

        if(fcheck.first >= fcheck.second && scheck.first <= scheck.second) {
            item = list[mid];
        }
        else if(fcheck.first < fcheck.second) {
            hi = mid-1;
        } else {
            lo = mid+1;
        }
    }

    if(item != null) {
        if(item.Id == index.Id) {
            return { "id": item.Id, "item": item, "rules": rules };
        } else { 
            rules.concat(item.Rule);
            return binarySearch(item.Children, index, rules);
        }
    }

  }

  function getComparable(delta, first, second) {
      var result = false;

      // Algorithm is specific to 3 to 4 digit searches.
      // negative = second is more precise
      if(delta < 0) {
        result = { "first": first, "second": parseInt(second) };
      } 
      // positive = first is more precise
      else if(delta > 0) {
        result = { "first": parseInt(first), "second": second };
      } 
      // equal = same precision
      else if( delta == 0) {
        result = { "first": first, "second": second };
      }

      return result;
  }

export default reducer