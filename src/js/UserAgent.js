var 

// Interface definition for UserAgent

	UserAgent = {
		'id': 0,
		'name': '',
		'string: ''
	},
	
// Easier way to generate User Agent object

	makeUserAgent = function (id, name, string) {
		var agent = Object.create(UserAgent);
		agent.id = id;
		agent.name = name;
		agent.string = string;
	
		return userAgent;
	};