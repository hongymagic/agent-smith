
//
// Storage interface for user-agents

var db = (function () {
  var defaultUserAgents = [],
      makeUserAgent = function (alias, string) {
        return {
          alias: alias,
          string: string
        };
      },
      addUserAgent = function (alias, string) {
        defaultUserAgents.push(makeUserAgent(alias, string));
        return defaultUserAgents[defaultUserAgents.length - 1];
      },
      findUserAgentByAlias = function (alias) {
        var index = 0,
            length = defaultUserAgents.length,
            ua;

        for (; index < length; index++) {
          ua = defaultUserAgents[index];

          if (ua.alias === alias) {
            return ua;
          }
        }
      };

//
// This database comes with prepopulated data!
// Populate list of default user agents
// TODO: possibly move it off to another JS/JSON file

  addUserAgent('Default', '');
  addUserAgent('iOS 5', 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3');

//
// This is the DB API, use it wisely

  return {
    getDefaultUserAgents: function () {
      return defaultUserAgents;
    },

    getUserAgentForTab: function (tabId) {
      return JSON.parse(localStorage.getItem('tab-' + tabId));
    },

    setUserAgentForTab: function (tabId, alias) {
      console.log('Saving user-agent for tab', tabId, alias);
      localStorage.setItem('tab-' + tabId, JSON.stringify(findUserAgentByAlias(alias)));
      return alias;
    },

    clear: function () {
      localStorage.clear();
    }
  };
}());

//
// Events

var Events = (function () {
  var events = {};

  return {
    add: function (name, handler) {
      var queue = events[name];
      if (!queue) {
        queue = [];
      }

      queue.push(handler);
      events[name] = queue;
    },

    trigger: function (name) {
      var queue = events[name],
          args = [].slice.call(arguments),
          index,
          length;

      if (!queue) {
        return;
      }

      for (index = 0, length = queue.length; index < length; index++) {
        queue[index].apply(this, args.slice(1));
      }
    }
  };
}());


//
// Popup UI rendering is done via this API

var UI = (function (container) {
  var
    
    renderListItem = function (list, option, current) {
      var li = document.createElement('li'),
          a = document.createElement('a');

      a.setAttribute('href', 'javascript:;');
      a.setAttribute('data-alias', option.alias);
      a.textContent = option.alias;
      a.addEventListener('click', function (event) {
        Events.trigger('save', this, event);
      }, false);

      if (current) {
        li.setAttribute('class', 'current');
      }

      li.appendChild(a);
      list.appendChild(li);
    };

  return {
    displayOptions: function (options, selected) {
      console.log(options, selected);

      var index = 0,
          length = options.length,
          option,
          list = document.createElement('ul'),
          current;

      for (; index < length; index++) {
        option = options[index];
        current = selected ? selected.alias === option.alias : option.alias === 'Default';
        renderListItem(list, option, current);
      }

      container.innerHTML = '';
      container.appendChild(list);
    }
  };
}(document.getElementById('container')));


//
// Add internal events

Events.add('init', function () {
  chrome.tabs.getSelected(null, function (tab) {
    UI.displayOptions(db.getDefaultUserAgents(), db.getUserAgentForTab(tab.id));
  });
});

Events.add('save', function (sender, event) {
  chrome.tabs.getSelected(null, function (tab) {
    db.setUserAgentForTab(tab.id, sender.dataset.alias);
    UI.displayOptions(db.getDefaultUserAgents(), db.getUserAgentForTab(tab.id));
    chrome.tabs.reload(tab.id, { bypassCache: true});
  });
});

//
// When active tab changes, re-display the options again

chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {
  UI.displayOptions(db.getDefaultUserAgents(), db.getUserAgentForTab(tabId));
});

chrome.tabs.onCreated.addListener(function (tab) {
  UI.displayOptions(db.getDefaultUserAgents(), db.getUserAgentForTab(tab.id));
});

Events.trigger('init');

