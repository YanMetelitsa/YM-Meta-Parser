'use strict';

window.addEventListener( 'load', e => {
	chrome.tabs.query({ active: true, currentWindow: true })
		.then( tabs => {
			return chrome.scripting.executeScript({
				target: { tabId: tabs[ 0 ].id },
				func: () => {
					return {
						head: document.head.innerHTML,
						body: document.body.innerHTML,
					};
				},
			});
		}).then( results => {
			/* Get HTML */
			const HTML = results[ 0 ].result;

			/* Parse DOM */
			const parser = new DOMParser();
			const head   = parser.parseFromString( HTML.head, 'text/html' );
			const body   = parser.parseFromString( HTML.body, 'text/html' );

			/* Init tests */
			const tests = {
				/* Common */
				'Common': {
					'Title Tag': {
						element: head.querySelector( 'title' ),
						cb: function () {
							return this.element.innerText;
						},
					},
					'Meta Title': {
						element: head.querySelector( 'meta[ name=title ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'H1 Tag': {
						element: body.querySelector( 'h1' ),
						cb: function () {
							return this.element.innerText;
						},
					},
					'Meta Description': {
						element: head.querySelector( 'meta[ name=description ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Canonical URL': {
						element: head.querySelector( 'link[ rel=canonical ]' ),
						cb: function () {
							return this.element.getAttribute( 'href' );
						},
					},
					'Meta Robots': {
						element: head.querySelector( 'meta[ name=robots ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
				},
				'Open Graph': {
					'Site Name': {
						element: head.querySelector( 'meta[ property=og\\:site_name ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Title': {
						element: head.querySelector( 'meta[ property=og\\:title ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Description': {
						element: head.querySelector( 'meta[ property=og\\:description ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Image': {
						element: head.querySelector( 'meta[ property=og\\:image ]' ),
						cb: function () {
							return `<img src="${this.element.getAttribute( 'content' )}">`;
						},
					},
				},
				'Twitter Cards': {
					'Title': {
						element: head.querySelector( 'meta[ name=twitter\\:title ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Description': {
						element: head.querySelector( 'meta[ name=twitter\\:description ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Card Type': {
						element: head.querySelector( 'meta[ name=twitter\\:card ]' ),
						cb: function () {
							return this.element.getAttribute( 'content' );
						},
					},
					'Image': {
						element: head.querySelector( 'meta[ name=twitter\\:image ]' ),
						cb: function () {
							return `<img src="${this.element.getAttribute( 'content' )}">`;
						},
					},
				},
			};

			let isFirstGroup = true;

			/* Loop tests */
			for ( const [ groupName, groupTests ] of Object.entries( tests ) ) {
				let details = document.createElement( 'details' );
				let table   = document.createElement( 'table' );
				let summary = document.createElement( 'summary' );

				if ( isFirstGroup ) {
					details.setAttribute( 'open', 'open' );
				}

				summary.innerText = groupName;

				details.append( summary );

				/* Loop group tests */
				for ( const [ testName, test ] of Object.entries( groupTests ) ) {
					let tr = document.createElement( 'tr' );
					let th = document.createElement( 'th' );
					let td = document.createElement( 'td' );

					th.innerText = testName;
					td.innerText = '–';

					if ( test.element ) {
						const result = test.cb();

						if ( result.match( /^<img/ ) ) {
							td.innerHTML = result;
						} else {
							td.innerText = result;
						}
					}

					tr.append( th, td );
					table.append( tr );
				}

				details.append( table );
				document.body.append( details );

				isFirstGroup = false;
			}
		});
});