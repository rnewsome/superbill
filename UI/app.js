import "babel-polyfill";

import React from 'react'
import { render } from 'react-dom'
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux'

import reducer from './reducer'
import Root from './views/root'
import State from './icd10_13.js'

(function(app) {
    let _store = null;

    app.init = function() {

        const _dispatcher = function(action) { _store.dispatch(action); };
        const loggerMiddleware = store => next => action => { next(action); };

        _store = createStore(reducer, State, applyMiddleware(loggerMiddleware, thunk));
        _store.subscribe(function() {
            app.render(_store, _dispatcher);
		});
        app.render(_store, _dispatcher);
    };

    app.render = function(_store ,_dispatcher) {
        const state = _store.getState();
        return render(
            <Root state={state} _dispatcher={_dispatcher} />, document.getElementById("wrapper")
        )
    };

    app.init();

})( window.app = window.app || {} );