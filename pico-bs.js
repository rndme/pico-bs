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

  // support dialog open via html 
  if(elm.matches("[data-pbs-modal]")) return document.querySelector("#"+elm.dataset.pbsModal).showModal();
	
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

document.addEventListener("input", function(e) {
	var elm = e.target;

	if (elm.matches("[data-pbs-value]")) {// make current input value available to css [value] selectors
		elm.setAttribute('value', elm.value); 
		return true;
	}

	if (elm.matches("[data-pbs-filter-items]")) {// filters elements by matching text
		var sel = elm.dataset.pbsFilterItems;
		var term = elm.value.trim();
		var prop = elm.dataset.pbsFilterProperty || "textContent";
		var kids = document.querySelectorAll(sel);
		//console.info({elm,sel,term,prop,kids});
		if (prop[0] == "@") {
			prop = prop.slice(1);
			
			kids.forEach(a=>	a.hidden = !(a.getAttribute(prop) || "").includes(term));

		} else {
			kids.forEach(a=> a.hidden = !a[prop].includes(term));
		}
		return true;
	} //end if filter?

	return true;
}); // end input observer


document.addEventListener("DOMContentLoaded", function(e){
	// bind popovers to targets:
	document.querySelectorAll("[data-pbs-popover]").forEach( msgElm =>{
		var id = msgElm.dataset.pbsPopover;
		document.getElementById(id).style.anchorName = '--' + id; // set to it's own id
		msgElm.style.setProperty('--anchor', '--' + id ); // set --anchor var with target's anchor-name value
	});

});//end load event()
	
if(!document.querySelector("link[href*='pico']")){
	let lnk = document.head.appendChild( document.createElement("link") );
	lnk.rel="stylesheet";
	lnk.href=`https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.${document.documentElement.dataset.pbsColor || "blue"}.min.css`;	
}

var ss = document.head.appendChild( document.createElement("style") );
ss.innerHTML = `
:root{ /* utlities */

/* base color vars */
--danger: #dc3545;
--warning: #ffc107;
--success: #198754;
--info: #0dcaf0;
--white: var(--pico-color);
--black: var(--pico-background-color);
--primary: var(--pico-primary-background);
--secondary: var(--pico-secondary-background);


/* bs bg color classes */
.primary[class] {background-color: var(--primary); }
.secondary[class]{background-color: var(--secondary); }
.danger[class]{ background-color: var(--danger); color: var(--white);}
.warning[class]{ background-color: var(--warning); color: var(--white);}
.success[class]{ background-color: var(--success); color: var(--white); }
.info[class]{ background-color: var(--info); color: var(--black); }


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

 /* create choosers via wrapping <aside> around the nav/.nav in a .tab component */
.tabs:has(aside) {	
	position: relative;
	border: 1px solid;
	padding: 1em;
	
	aside,	main {	float: left;}
	aside {	width: 10%;}
	main {	width: 90%;}
} /* end chooser */


/* grid updates */
/* allow data- attrib to customize column count in grids */
.grid[data-pbs-cols] {
	grid-template-columns: repeat(attr(data-pbs-cols type(<number>)), auto);
}
/* allow data- attrib to customize gaps grids */
.grid[data-pbs-gap] {
	gap: attr(data-pbs-gap type(<length>));
}

/* support popovers */
[data-pbs-popover] {
  position-anchor: var(--anchor);
  position-area: top;  
}

/* add easy tooltip popovers w/.tooltip class */
[data-pbs-popover].tooltip {
	border-radius: 1rem;
	background: var(--pico-form-element-background-color);
	color: var(--pico-form-element-color);
	padding: 0.5rem 1rem;
	box-shadow: 0 0 2em #888d;
	position: relative;
	cursor: default;
	user-select: none;
	pointer-events: none;
	border: 1px solid var(--pico-form-element-placeholder-color);
}
[data-pbs-popover].tooltip:after {
	content: "i";
	font-style: italic;
	font-size: 0.85rem;
	position: absolute;
	margin: -1rem;
	top: 1.3rem;
	left: 1.4rem;
	border: 1px solid #888;
	padding: 0 0.7rem;
	border-radius: 2rem;
	color: var(--pico-form-element-color);
	opacity: 0.75;
}
[data-pbs-popover].tooltip>*:first-child:first-letter {
	padding-left: 1rem;
}



/* dupe aria-invalid rules to html5 :invalid */
:where(input, select, textarea):invalid {
	--pico-border-color: var(--pico-form-element-invalid-border-color)
}
:where(input, select, textarea):invalid:is(:active, :focus) {
	--pico-border-color: var(--pico-form-element-invalid-active-border-color) !important
}
:where(input, select, textarea):invalid:is(:active, :focus):not([type=checkbox], [type=radio]) {
	--pico-box-shadow: 0 0 0 var(--pico-outline-width) var(--pico-form-element-invalid-focus-color) !important
}



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
x -chooser
x -search/filter
x -popovers
x -validation

x support data-color on html to customize pico base color
x [data-pbs-popover=targId], [data-pbs-filter-items], [data-pbs-filter-property], [data-pbs-value]
*/
}());
