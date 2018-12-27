function rewriteAcceptLanguage(e) {

    function glob(pattern, input) {
        var re = new RegExp(pattern.replace(/([.?+^$[\]\\(){}|\/-])/g, "\\$1").replace(/\*/g, '.*'));
        return re.test(input);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    function onGot(keys) {
        // Check if request domain matches pattern
        if (Object.keys(keys).length > 0) {
            var patterns = keys.patterns;
            // Create table row for each item
            for (var i = 0; i < patterns.length; i++) {
                var patt = patterns[i][0];
                var lang = patterns[i][1];

                var host;
                // Get host name from headers
                for (var header of e.requestHeaders) {
                    if (header.name.toLowerCase() === "host") {
                        host = header.value;
                      }
                    }

                // If there is a match, modify headers, return (= stop here)
                if ( glob(patt, host) ) {
                    for (var header of e.requestHeaders) {
                        if (header.name.toLowerCase() === "accept-language") {
                          header.value = lang;
                        }
                    }
                    return {requestHeaders: e.requestHeaders};
                }
            }
        }
    }

    var getting = browser.storage.sync.get("patterns");
    return getting.then(onGot, onError);
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeSendHeaders
browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteAcceptLanguage,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);
