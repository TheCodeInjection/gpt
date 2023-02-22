// ==UserScript==
// @name         ChatGPT_Unblock
// @namespace    http://tampermonkey.intercept
// @version      1.1
// @author       Iumi#5555
// @description  Remove Orange flagged status and restore keep messages from ChatGPT
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Intercept fetch GET requests and remove JSON attribute
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        if (options && options.method && options.method.toUpperCase() === 'GET') {
            console.log('Intercepted GET request:', url);
            const response = await originalFetch(url, options);
            if (response.headers.get('content-type').startsWith('application/json')) {
                const responseBody = await response.json();
                console.log('JSON response:', responseBody);
                // Remove specified attribute from JSON response
                delete responseBody.moderation_results;
                const modifiedResponse = new Response(JSON.stringify(responseBody), response);
                return Promise.resolve(modifiedResponse);
            }
            return Promise.resolve(response);
        } else if (options && options.method && options.method.toUpperCase() === 'POST' && url === 'https://chat.openai.com/backend-api/moderations') {
            console.log('Blocked POST request:', url);
            return Promise.resolve(new Response(null, { status: 403, statusText: 'Forbidden' }));
        }
        return originalFetch.apply(this, arguments);
    };
})();
