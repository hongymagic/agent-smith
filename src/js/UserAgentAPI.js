
/**
 * UserAgent storage interface
 *
 * Use this object to set, get, and delete user agent information
 * TODO: sub-type global/tabs/url get/set/delete
 */
var UserAgentAPI = (function (localStorage) {
	'use strict';
	
	var
	
		GLOBAL_KEY = 'GLOBAL',
	
// localStorage helpers
	
		serialise = function (value) {
			return JSON.stringify(value);
		},
		deserialise = function (value) {
			return JSON.parse(value);
		},
		set = function (key, value) {
			localStorage.setItem(key, serialise(value));
		},
		get = function (key) {
			return deserialise(localStorage.getItem(key));
		},
		remove = function (key) {
			localStorage.removeItem(key);
		},
		
// Getter and setter for Tab specific settings
		
		makeKeyForTab = function (tab) {
			return 'tab' + tab;
		},
		setForTab = function (tab, id) {
			set(makeKeyForTab(tab), id);
		},
		getForTab = function (tab) {
			return get(makeKeyForTab(tab));
		},
		deleteForTab = function (tab) {
			remove(makeKeyForTab(tab));
		},
		
// Getter and setter for global settings
		
		setGlobal = function (id) {
			set(GLOBAL_KEY, id);
		},
		getGlobal = function () {
			return get(GLOBAL_KEY);
		},
		deleteGlobal = function () {
			remove(GLOBAL_KEY);
		},

// Parameter helpers (TODO: better with subtyping)

		isGlobal = function (params) { 
			return params.global === true;
		},
		isTab = function (params) {
			return typeof params.tab === 'number';
		};
	
	return {
		'SET': function (params, agent) {
			var id = agent.id;
			
			if (isGlobal(params)) {
				setGlobal(id);
			} else if (isTab(params)) {
				setForTab(params.tab, id);
			}
		},
		
		'GET': function (params) {
			if (isGlobal(params)) {
				return getGlobal();
			} else if (isTab(params)) {
				return getForTab(params.tab);
			}
			
			return null;
		},

    'LIST': function () {
    },
		
		'DELETE': function (params) {
			if (isGlobal(params)) {
				deleteGlobal();
			} else if (isTab(params)) {
				deleteForTab(params.tab);
			}
		}
	};
}(window.localStorage));
