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

			/** Common */
			if ( doc.querySelector( 'title' ) ) {
				document.querySelector( '#title-tag' ).innerText = doc.querySelector( 'title' ).innerText;
			}
			if ( doc.querySelector( 'meta[ name=title ]' ) ) {
				document.querySelector( '#meta-title' ).innerText = doc.querySelector( 'meta[ name=title ]' ).getAttribute( 'content' );
			}
			if ( doc.querySelector( 'meta[ name=description ]' ) ) {
				document.querySelector( '#meta-description' ).innerText = doc.querySelector( 'meta[ name=description ]' ).getAttribute( 'content' );
			}
			if ( doc.querySelector( 'link[ rel=canonical ]' ) ) {
				document.querySelector( '#meta-canonical' ).innerText = doc.querySelector( 'link[ rel=canonical ]' ).getAttribute( 'href' );
			}
			if ( doc.querySelector( 'meta[ name=robots ]' ) ) {
				document.querySelector( '#meta-robots' ).innerText = doc.querySelector( 'meta[ name=robots ]' ).getAttribute( 'content' );
			}

			/** Open Graph */
			if ( doc.querySelector( 'meta[ property=og\\:title ]' ) ) {
				document.querySelector( '#og-title' ).innerText = doc.querySelector( 'meta[ property=og\\:title ]' ).getAttribute( 'content' );
			}
			if ( doc.querySelector( 'meta[ property=og\\:description ]' ) ) {
				document.querySelector( '#og-description' ).innerText = doc.querySelector( 'meta[ property=og\\:description ]' ).getAttribute( 'content' );
			}
			if ( doc.querySelector( 'meta[ property=og\\:image ]' ) ) {
				document.querySelector( '#og-image' ).innerHTML = `<img src="${doc.querySelector( 'meta[ property=og\\:image ]' ).getAttribute( 'content' )}">`;
			}

			/** Twitter */
			if ( doc.querySelector( 'meta[ name=twitter\\:title ]' ) ) {
				document.querySelector( '#twitter-title' ).innerText = doc.querySelector( 'meta[ name=twitter\\:title ]' ).getAttribute( 'content' );
			}
			if ( doc.querySelector( 'meta[ name=twitter\\:description ]' ) ) {
				document.querySelector( '#twitter-description' ).innerText = doc.querySelector( 'meta[ name=twitter\\:description ]' ).getAttribute( 'content' );
			}
			if ( doc.querySelector( 'meta[ name=twitter\\:image ]' ) ) {
				document.querySelector( '#twitter-image' ).innerHTML = `<img src="${doc.querySelector( 'meta[ name=twitter\\:image ]' ).getAttribute( 'content' )}">`;
			}
			if ( doc.querySelector( 'meta[ name=twitter\\:card ]' ) ) {
				document.querySelector( '#twitter-card' ).innerText = doc.querySelector( 'meta[ name=twitter\\:card ]' ).getAttribute( 'content' );
			}
		});
});