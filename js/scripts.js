'use strict';

window.addEventListener( 'load', e => {
	chrome.tabs.query({ active: true, currentWindow: true })
		.then( tabs => {
			var activeTab   = tabs[ 0 ];
			var activeTabId = activeTab.id;

			return chrome.scripting.executeScript({
				target: {
					tabId: activeTabId,
				},
				func: () => document.querySelector( 'head' ).outerHTML,
			});
		}).then( results => {
			const headHTML = results[ 0 ].result;

			const parser = new DOMParser();
			const doc    = parser.parseFromString( headHTML, 'text/html' );

			document.querySelector( '#title-tag' ).innerHTML        = doc.querySelector( 'title' ).innerHTML;
			document.querySelector( '#meta-title' ).innerHTML       = doc.querySelector( 'meta[ name=title ]' ).getAttribute( 'content' );
			document.querySelector( '#meta-description' ).innerHTML = doc.querySelector( 'meta[ name=description ]' ).getAttribute( 'content' );
			document.querySelector( '#meta-canonical' ).innerHTML   = doc.querySelector( 'link[ rel=canonical ]' ).getAttribute( 'href' );
			document.querySelector( '#meta-robots' ).innerHTML      = doc.querySelector( 'meta[ name=robots ]' ).getAttribute( 'content' );

			document.querySelector( '#og-title' ).innerHTML       = doc.querySelector( 'meta[ property=og\\:title ]' ).getAttribute( 'content' );
			document.querySelector( '#og-description' ).innerHTML = doc.querySelector( 'meta[ property=og\\:description ]' ).getAttribute( 'content' );
			document.querySelector( '#og-image' ).innerHTML       = `<img src="${doc.querySelector( 'meta[ property=og\\:image ]' ).getAttribute( 'content' )}">`;

			document.querySelector( '#twitter-title' ).innerHTML       = doc.querySelector( 'meta[ name=twitter\\:title ]' ).getAttribute( 'content' );
			document.querySelector( '#twitter-description' ).innerHTML = doc.querySelector( 'meta[ name=twitter\\:description ]' ).getAttribute( 'content' );
			document.querySelector( '#twitter-image' ).innerHTML       = `<img src="${doc.querySelector( 'meta[ name=twitter\\:image ]' ).getAttribute( 'content' )}">`;
		});
});