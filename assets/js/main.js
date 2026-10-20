/**
 * davidszabo.online — main.js (statikus verzió)
 * Mobilmenü, sticky fejléc, dark/light kapcsoló, GitHub repók betöltése
 * kliens oldalról, Web3Forms kapcsolat űrlap, scroll-reveal.
 */
( function () {
	'use strict';

	/* ================== KONFIGURÁCIÓ ================== */
	var CST_CONFIG = {
		/* GitHub felhasználónév — a portfólió ezen user publikus repóit mutatja */
		githubUser: 'szxbodavee23',
		/* Ennyi repót listáz a főoldal */
		repoCount: 9,
		/* Web3Forms access key — https://web3forms.com (ingyenes, e-mail cím kell hozzá).
		   A kulcsot ide írd be, és a kapcsolat űrlap azonnal működik. */
		web3formsKey: 'b00ac53e-b215-4eac-9cb2-d0e9c59531c1',
	};
	/* ================================================= */

	var STRINGS = {
		sending: 'Küldés folyamatban…',
		sent: 'Köszönjük! Üzeneted megérkezett, hamarosan jelentkezünk.',
		error: 'Hiba történt a küldés során. Kérlek, próbáld újra később.',
		toLight: 'Váltás világos módra',
		toDark: 'Váltás sötét módra',
		noKey: 'Az űrlap még nincs bekötve — a main.js-ben add meg a Web3Forms kulcsot.',
		repoError: 'A repók betöltése most nem sikerült — nézd meg a GitHub profilomat!',
	};

	var LANG_COLORS = {
		JavaScript: '#f1e05a', TypeScript: '#3178c6', PHP: '#4f5d95',
		HTML: '#e34c26', CSS: '#8f6fc4', SCSS: '#c6538c',
		Python: '#3572a5', Java: '#b07219', 'C#': '#178600',
		'C++': '#f34b7d', C: '#9b9b9b', Go: '#00add8', Rust: '#dea584',
		Shell: '#89e051', Vue: '#41b883', Swift: '#f05138', Kotlin: '#a97bff',
		Dart: '#00b4ab', Ruby: '#701516', 'Jupyter Notebook': '#da5b0b', Blade: '#f7523f',
	};

	document.addEventListener( 'DOMContentLoaded', function () {
		initStickyHeader();
		initThemeToggle();
		initMobileNav();
		initPortfolioFilter();
		initGithubRepos();
		initContactForm();
		initScrollReveal();
		initTypewriter();
		initFooterYear();
	} );

	/* ------------------------------------------------------------------
	 * Gépelődő kódablak a hero-ban — React / Java / Spring snippetek
	 * rotálva, egyszerű syntax highlighttal.
	 * ------------------------------------------------------------------ */
	function initTypewriter() {
		var code = document.getElementById( 'typewriter-code' );
		if ( ! code ) {
			return;
		}

		var snippets = [
			'// portfolio.jsx\nconst david = {\n  stack: [ \'React\', \'Java\', \'Spring\' ],\n  passion: \'web & film\',\n  hireable: true\n};',
			'// PortfolioApp.java\n@SpringBootApplication\npublic class PortfolioApp {\n    public static void main( String[] args ) {\n        SpringApplication.run( PortfolioApp.class, args );\n    }\n}',
			'// App.jsx\nexport default function Hero() {\n    return (\n        <h1>Szia, David vagyok</h1>\n    );\n}'
		];

		var escHtml = function ( s ) {
			return s.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
		};

		var highlight = function ( t ) {
			return escHtml( t )
				.replace( /(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>' )
				.replace( /('[^'\n]*'?)/g, '<span class="tok-str">$1</span>' )
				.replace( /(@[A-Za-z_]+)/g, '<span class="tok-ann">$1</span>' )
				.replace( /\b(const|return|new|public|class|import|from|export|default|function|static|void)\b/g, '<span class="tok-kw">$1</span>' )
				.replace( /\b(true|false|null)\b/g, '<span class="tok-lit">$1</span>' )
				.replace( /(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="tok-tag">$2</span>' );
		};

		if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
			code.innerHTML = highlight( snippets[ 0 ] );
			return;
		}

		var idx = 0;
		var pos = 0;
		var erasing = false;

		var tick = function () {
			var text = snippets[ idx ];

			if ( ! erasing ) {
				pos++;
				if ( pos >= text.length ) {
					erasing = true;
					code.innerHTML = highlight( text );
					setTimeout( tick, 3800 );
					return;
				}
				code.innerHTML = highlight( text.slice( 0, pos ) );
				setTimeout( tick, 34 + Math.random() * 40 );
			} else {
				pos = Math.max( 0, pos - 4 );
				code.innerHTML = highlight( text.slice( 0, pos ) );
				if ( 0 === pos ) {
					erasing = false;
					idx = ( idx + 1 ) % snippets.length;
					setTimeout( tick, 500 );
					return;
				}
				setTimeout( tick, 14 );
			}
		};

		tick();
	}

	/* ------------------------------------------------------------------
	 * Sticky fejléc
	 * ------------------------------------------------------------------ */
	function initStickyHeader() {
		var header = document.getElementById( 'site-header' );
		if ( ! header ) {
			return;
		}
		var onScroll = function () {
			header.classList.toggle( 'is-scrolled', window.scrollY > 24 );
		};
		onScroll();
		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	/* ------------------------------------------------------------------
	 * Dark/Light téma kapcsoló — localStorage + data-theme attribútum.
	 * ------------------------------------------------------------------ */
	function initThemeToggle() {
		var btn = document.getElementById( 'theme-toggle' );
		if ( ! btn ) {
			return;
		}
		var root = document.documentElement;

		var syncButton = function () {
			var isLight = 'light' === root.getAttribute( 'data-theme' );
			btn.setAttribute( 'aria-pressed', isLight ? 'true' : 'false' );
			btn.setAttribute( 'aria-label', isLight ? STRINGS.toDark : STRINGS.toLight );
		};

		btn.addEventListener( 'click', function () {
			var next = 'light' === root.getAttribute( 'data-theme' ) ? 'dark' : 'light';
			root.setAttribute( 'data-theme', next );
			try {
				localStorage.setItem( 'cst-theme', next );
			} catch ( e ) {}
			syncButton();
		} );

		syncButton();
	}

	/* ------------------------------------------------------------------
	 * Mobilmenü
	 * ------------------------------------------------------------------ */
	function initMobileNav() {
		var toggle = document.querySelector( '.nav-toggle' );
		var nav = document.getElementById( 'site-nav' );
		if ( ! toggle || ! nav ) {
			return;
		}

		var closeNav = function () {
			nav.classList.remove( 'is-open' );
			toggle.classList.remove( 'is-active' );
			toggle.setAttribute( 'aria-expanded', 'false' );
			document.body.classList.remove( 'nav-open' );
		};

		toggle.addEventListener( 'click', function () {
			var isOpen = nav.classList.toggle( 'is-open' );
			toggle.classList.toggle( 'is-active', isOpen );
			toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
			document.body.classList.toggle( 'nav-open', isOpen );
		} );

		nav.addEventListener( 'click', function ( event ) {
			if ( event.target.closest( 'a' ) ) {
				closeNav();
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' === event.key && nav.classList.contains( 'is-open' ) ) {
				closeNav();
				toggle.focus();
			}
		} );
	}

	/* ------------------------------------------------------------------
	 * Portfólió szűrő — data-filter gombok ↔ data-categories kártyák.
	 * ------------------------------------------------------------------ */
	function initPortfolioFilter() {
		var sections = document.querySelectorAll( '[data-portfolio]' );

		sections.forEach( function ( section ) {
			var grid = section.querySelector( '.portfolio-grid' );
			var buttons = section.querySelectorAll( '.filter-btn' );
			if ( ! grid || ! buttons.length ) {
				return;
			}

			var cards = grid.querySelectorAll( '.project-card' );

			section.addEventListener( 'click', function ( event ) {
				var btn = event.target.closest( '.filter-btn' );
				if ( ! btn || ! section.contains( btn ) ) {
					return;
				}

				buttons.forEach( function ( b ) {
					b.classList.remove( 'is-active' );
				} );
				btn.classList.add( 'is-active' );

				var filter = btn.getAttribute( 'data-filter' );

				cards.forEach( function ( card ) {
					var cats = ( card.getAttribute( 'data-categories' ) || '' ).split( /\s+/ ).filter( Boolean );
					var show = 'all' === filter || cats.indexOf( filter ) !== -1;

					card.classList.toggle( 'is-filtered-out', ! show );
					card.classList.remove( 'pop-in' );

					if ( show ) {
						void card.offsetWidth;
						card.classList.add( 'pop-in' );
					}
				} );
			} );
		} );
	}

	/* ------------------------------------------------------------------
	 * GitHub repók — publikus API, kliens oldali renderelés.
	 * Szűrés: létrehozott sorrend nem garantált a JS miatt,
	 * ezért itt rendereljük a filtereket is.
	 * ------------------------------------------------------------------ */
	function initGithubRepos() {
		var grid = document.getElementById( 'repo-grid' );
		var filters = document.getElementById( 'repo-filters' );
		if ( ! grid ) {
			return;
		}

		var slugify = function ( str ) {
			var s = str.toLowerCase().replace( /[^a-z0-9]+/g, '-' ).replace( /^-+|-+$/g, '' );
			return s || 'egyeb';
		};

		var esc = function ( str ) {
			return String( str ).replace( /[&<>"']/g, function ( c ) {
				return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ c ];
			} );
		};

		var cardHtml = function ( repo ) {
			var lang = repo.language || '';
			var langSlug = lang ? slugify( lang ) : 'egyeb';
			var langColor = LANG_COLORS[ lang ] || '#8b8b9e';
			var ogImage = 'https://opengraph.githubassets.com/1/' + encodeURIComponent( repo.owner.login ) + '/' + encodeURIComponent( repo.name );

			var langHtml = lang
				? '<span class="repo-stat repo-card__lang"><span class="lang-dot" style="background:' + langColor + '"></span>' + esc( lang ) + '</span>'
				: '';
			var descHtml = repo.description
				? '<p class="repo-card__desc">' + esc( repo.description ) + '</p>'
				: '';

			return '<article class="project-card repo-card pop-in" data-categories="' + esc( langSlug ) + '">'
				+ '<a class="project-card__media" href="' + esc( repo.html_url ) + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">'
				+ '<img src="' + esc( ogImage ) + '" alt="" loading="lazy">'
				+ '<span class="project-card__overlay"><span class="project-card__view">Megnyitás GitHubon</span></span>'
				+ '</a>'
				+ '<div class="project-card__body">'
				+ '<h3 class="project-card__title"><a href="' + esc( repo.html_url ) + '" target="_blank" rel="noopener noreferrer">' + esc( repo.name ) + '</a></h3>'
				+ descHtml
				+ '<div class="project-card__meta repo-card__stats">'
				+ langHtml
				+ '<span class="repo-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' + esc( repo.stargazers_count || 0 ) + '</span>'
				+ '<span class="repo-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>' + esc( repo.forks_count || 0 ) + '</span>'
				+ '</div></div></article>';
		};

		fetch(
			'https://api.github.com/users/' + encodeURIComponent( CST_CONFIG.githubUser ) +
			'/repos?sort=pushed&direction=desc&per_page=' + CST_CONFIG.repoCount
		)
			.then( function ( res ) {
				if ( ! res.ok ) {
					throw new Error( 'GitHub API ' + res.status );
				}
				return res.json();
			} )
			.then( function ( repos ) {
				repos = repos.filter( function ( r ) {
					return ! r.fork && ! r.archived && r.name;
				} );
				if ( ! repos.length ) {
					throw new Error( 'no repos' );
				}

				/* Nyelv szűrőgombok dinamikusan */
				if ( filters ) {
					var langs = {};
					var hasOther = false;
					repos.forEach( function ( r ) {
						if ( r.language ) {
							langs[ slugify( r.language ) ] = r.language;
						} else {
							hasOther = true;
						}
					} );

					Object.keys( langs ).forEach( function ( slug ) {
						var b = document.createElement( 'button' );
						b.type = 'button';
						b.className = 'filter-btn';
						b.setAttribute( 'data-filter', slug );
						b.textContent = langs[ slug ];
						filters.appendChild( b );
					} );
					if ( hasOther ) {
						var other = document.createElement( 'button' );
						other.type = 'button';
						other.className = 'filter-btn';
						other.setAttribute( 'data-filter', 'egyeb' );
						other.textContent = 'Egyéb';
						filters.appendChild( other );
					}
				}

				grid.innerHTML = repos.map( cardHtml ).join( '' );
				initPortfolioFilter();
			} )
			.catch( function () {
				grid.innerHTML = '<div class="portfolio-empty" style="grid-column:1/-1"><p>'
					+ STRINGS.repoError
					+ ' <a href="https://github.com/' + esc( CST_CONFIG.githubUser ) + '?tab=repositories" target="_blank" rel="noopener noreferrer">github.com/' + esc( CST_CONFIG.githubUser ) + '</a></p></div>';
				if ( filters ) {
					filters.style.display = 'none';
				}
			} );
	}

	/* ------------------------------------------------------------------
	 * Kapcsolat űrlap → Web3Forms (ingyenes, backend nélküli levélküldés).
	 * ------------------------------------------------------------------ */
	function initContactForm() {
		var form = document.getElementById( 'cst-contact-form' );
		if ( ! form ) {
			return;
		}

		var status = form.querySelector( '.form-status' );
		var submitBtn = form.querySelector( 'button[type="submit"]' );
		var btnLabel = submitBtn ? submitBtn.textContent : '';

		var setStatus = function ( message, type ) {
			if ( ! status ) {
				return;
			}
			status.textContent = message;
			status.className = 'form-status' + ( type ? ' form-status--' + type : '' );
		};

		form.addEventListener( 'submit', function ( event ) {
			event.preventDefault();

			if ( ! form.checkValidity() ) {
				form.reportValidity();
				return;
			}

			if ( ! CST_CONFIG.web3formsKey ) {
				setStatus( STRINGS.noKey, 'error' );
				return;
			}

			var data = new FormData( form );
			data.set( 'access_key', CST_CONFIG.web3formsKey );

			setStatus( '', '' );
			if ( submitBtn ) {
				submitBtn.disabled = true;
				submitBtn.textContent = STRINGS.sending;
			}

			fetch( 'https://api.web3forms.com/submit', {
				method: 'POST',
				body: data,
			} )
				.then( function ( res ) {
					return res.json();
				} )
				.then( function ( json ) {
					if ( json && json.success ) {
						setStatus( STRINGS.sent, 'success' );
						form.reset();
					} else {
						setStatus( ( json && json.message ) || STRINGS.error, 'error' );
					}
				} )
				.catch( function () {
					setStatus( STRINGS.error, 'error' );
				} )
				.finally( function () {
					if ( submitBtn ) {
						submitBtn.disabled = false;
						submitBtn.textContent = btnLabel;
					}
				} );
		} );
	}

	/* ------------------------------------------------------------------
	 * Scroll-reveal — IntersectionObserver.
	 * ------------------------------------------------------------------ */
	function initScrollReveal() {
		var items = document.querySelectorAll( '.reveal' );
		if ( ! items.length ) {
			return;
		}

		if ( ! ( 'IntersectionObserver' in window ) ) {
			items.forEach( function ( el ) {
				el.classList.add( 'is-visible' );
			} );
			return;
		}

		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{
				threshold: 0.12,
				rootMargin: '0px 0px -40px 0px',
			}
		);

		items.forEach( function ( el ) {
			observer.observe( el );
		} );
	}

	/* ------------------------------------------------------------------
	 * Lábléc évszám.
	 * ------------------------------------------------------------------ */
	function initFooterYear() {
		var el = document.getElementById( 'footer-year' );
		if ( el ) {
			el.textContent = new Date().getFullYear();
		}
	}
} )();
