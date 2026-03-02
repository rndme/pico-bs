// pico-bs.js - pico.css upgrader, by dandavis. MIT applies.

(function(){

// util class tools:
function ac(elm,cls){elm.classList.add(cls); return elm;}
function rc(elm,cls){elm.classList.remove(cls); return elm;}

document.addEventListener("click", function(e){
  var elm = e.target;
 
  // support dissmissable alerts and dialog closings
  if(elm.matches(".alert [role=dismiss]")) return elm.parentNode.remove();
  if(elm.matches("dialog [role=dismiss]")) return elm.closest("dialog").close();
  if(elm.matches("dialog [rel=prev]")) return elm.closest("dialog").close();
  
  // tab features:
  if(elm.matches(".tabs nav a, .tabs nav [for]")){

	var tabCont = elm.closest(".tabs");
	
	// active  handle indication
  	tabCont.querySelectorAll(".active").forEach(c=>rc(c,"active"));
	elm.classList.add("active");
	
	// non-anchor functionality using [for]
	 if(elm.matches(".tabs nav [for]")){
	 	tabCont.querySelectorAll(".open").forEach(c=>rc(c,"open"));
		ac(tabCont.querySelector("#" + elm.getAttribute("for")), "open");
	 }
	
	return false;
  }
  
return true;
}); // end click observer

if(!document.querySelector("link[href*='pico']")){
	let lnk = document.head.appendChild( document.createElement("link") );
	lnk.rel="stylesheet";
	lnk.href=`https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.${document.documentElement.dataset.color || "blue"}.min.css`;	
}

var ss = document.head.appendChild( document.createElement("style") );
ss.innerHTML = `
:root{ /* utlities */

/* base color vars */
--danger: #dc3545;
--warning: #ffc107;
--success: #198754;
--info: #0dcaf0;
--white: #ffffff;
--primary: var(--pico-primary-background);
--secondary: var(--pico-secondary-background);


/* bs bg color classes */
.primary[class] {background-color: var(--primary); }
.secondary[class]{background-color: var(--secondary); }
.danger[class]{ background-color: var(--danger); color: var(--white);}
.warning[class]{ background-color: var(--warning); color: var(--white);}
.success[class]{ background-color: var(--success); color: var(--white); }
.info[class]{ background-color: var(--info); }


/* bs text color classes */
.text-primary[class]{ color: var(--primary); }
.text-secondary[class]{ color: var(--secondary); }
.text-danger[class]{ color: var(--danger); }
.text-warning[class]{ color: var(--warning); }
.text-success[class]{ color: var(--success); }
.text-info[class]{ color: var(--info); }


/* bs utils */
.pull-right { float: right; }
.clear { clear: both; }
.hidden { display: none; }
.small { font-size: 0.8rem; }


/* bs header classes */
.h1, .h2, .h3, .h4, .h5, .h6 {
	font-weight: 700;
	font-family: var(--pico-font-family);
}
.h1 { font-size: 2rem; }
.h2 { font-size: 1.75rem; }
.h3 { font-size: 1.5rem; }
.h4 { font-size: 1.25rem; }
.h5 { font-size: 1.125rem; }
.h6 { font-size: 1rem; }


/* bs badges */
.badge {
display: inline-block;
padding: 0.35em 0.65em;
font-size: 0.75em;
font-weight: 700;
line-height: 1;
text-align: center;
color: #fff;
white-space: nowrap;
vertical-align: baseline;
border-radius: 0.4em;
}


/* bs pill and our pills */
.pills { 
	button, a, [role='button'] { border-radius: 1rem; }
}
body .pill { border-radius: 1rem; }


/* bs list groups, no child classes needed */
.list-group { margin: 0; padding:0; }
body .list-group > * { 
	list-style: none; 
	margin-bottom:1px; 
	border: 1px solid rgba(129,129,129,0.2);
}


/* bs little containers, match article tags in pico */
.card, .alert, .list-group>* {
	margin-bottom: var(--pico-block-spacing-vertical);
	padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
	border-radius: var(--pico-border-radius);
	background: var(--pico-card-background-color);
	box-shadow: var(--pico-card-box-shadow);
}


/* force succsessive articles into a bs list-group appearence */
article:has(+article),
article+article { margin-bottom: 1px; }


/* bs alerts */
.alert { 	
	padding: calc(var(--pico-block-spacing-vertical) / 1.5) ;
	background: var(--primary); 
}
.alert.dismissible {
	padding-right: 1em;
}
.alert.dismissible button, .alert.dismissible [type="button"]{
	padding: unset;
	float: right;
	background: transparent;
	border: 0;
}


/* tabs */
.tabs {
	display: inline-block;

	nav [for], .nav [for] { cursor: pointer; }

	section { display: none; }

	section[id].open, /* << js version selector.
				VVV	 js-less ONLY version selector VVV */
	&:not(:has(nav [for], .nav [for])) section[id]:target { 
		display: block; 
	}
}/* end tabs */


}/* end utlities */

/* fix minor missing dark mode stuff */
[data-theme="dark"] hr {filter: invert(1);}


`;



/*add missing pico things in js and css:
X -text color classes
x -badge
x -pills
X -alerts
X -modal behavior 
x -tabs
x -listgroup

support data-color on html to customize pico base color

*/
}());
