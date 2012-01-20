var 

	requestFilter = {
		urls: ['<all_urls>']
	},
	blocker = ['requestHeaders', 'blocking'];

chrome.experimental.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders,
			userAgent = JSON.parse(localStorage.getItem('tab-' + details.tabId));

	if (!userAgent) {
		return;
	}
		
	for (var i = 0, l = headers.length; i < l; ++i) {
		if (headers[i].name == 'User-Agent') {
			break;
		}
	}

// If request header contains User-Agent and settings
// exist, change the User-Agent value before sending headers

	if (i < headers.length && userAgent.string) {
		headers[i].value = userAgent.string;
	}

	return { requestHeaders: headers };
}, requestFilter, blocker);

