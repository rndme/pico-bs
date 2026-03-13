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

/* base vars */
--pbs-unit : 1rem;
--pbs-0:0;
--pbs-1:calc(var(--pbs-unit) * 0.25);
--pbs-2:calc(var(--pbs-unit) * 0.5);
--pbs-3:var(--pbs-unit);
--pbs-4:calc(var(--pbs-unit) * 1.5);
--pbs-5:calc(var(--pbs-unit) * 3);

/* base color vars */
--danger: #dc3545;
--warning: #ffc107;
--success: #198754;
--info: #0dcaf0;
--white: var(--pico-color);
--gray: #888888;
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
.h1,.fs-1 { font-size: 2rem; }
.h2,.fs-2 { font-size: 1.75rem; }
.h3,.fs-3 { font-size: 1.5rem; }
.h4,.fs-4 { font-size: 1.25rem; }
.h5,.fs-5 { font-size: 1.125rem; }
.h6,.fs-6 { font-size: 1rem; }

/* bs text styling */
.text-lowercase { text-transform: lowercase; }
.text-uppercase { text-transform: uppercase; }
.text-capitalize { text-transform: capitalize; }

.fw-bold { font-weight: 700!important;}
.fw-bolder { font-weight: bolder!important;}
.fw-semibold { font-weight: 600!important;}
.fw-medium { font-weight: 500!important;}
.fw-normal { font-weight: 400!important;}
.fw-light { font-weight: 300!important;}
.fw-lighter { font-weight: lighter!important;}
.fst-normal { font-style: normal !important; }
.fst-italic { font-style: italic !important; }

.font-monospace { font-family: monospace; }
.text-reset { color: inherit; }

.text-start {text-align: left !important;}
.text-center {text-align: center !important;}
.text-end {text-align: right !important;}

/* BS padding and margin classes */
.mt-0{margin-top:0;}
.mt-1{margin-top:var(--pbs-1);}
.mt-2{margin-top:var(--pbs-2);}
.mt-3{margin-top:var(--pbs-3);}
.mt-4{margin-top:var(--pbs-4);}
.mt-5{margin-top:var(--pbs-5);}
.mb-0{margin-bottom:0;}
.mb-1{margin-bottom:var(--pbs-1);}
.mb-2{margin-bottom:var(--pbs-2);}
.mb-3{margin-bottom:var(--pbs-3);}
.mb-4{margin-bottom:var(--pbs-4);}
.mb-5{margin-bottom:var(--pbs-5);}
.ms-0{margin-block-start:0; margin-inline-start:0;}
.ms-1{margin-block-start:var(--pbs-1); margin-inline-start:var(--pbs-1);}
.ms-2{margin-block-start:var(--pbs-2); margin-inline-start:var(--pbs-2);}
.ms-3{margin-block-start:var(--pbs-3); margin-inline-start:var(--pbs-3);}
.ms-4{margin-block-start:var(--pbs-4); margin-inline-start:var(--pbs-4);}
.ms-5{margin-block-start:var(--pbs-5); margin-inline-start:var(--pbs-5);}
.me-0{margin-block-end:0;}
.me-1{margin-block-end:var(--pbs-1);}
.me-2{margin-block-end:var(--pbs-2);}
.me-3{margin-block-end:var(--pbs-3);}
.me-4{margin-block-end:var(--pbs-4);}
.me-5{margin-block-end:var(--pbs-5);}
.ml-0{margin-left:0;}
.ml-1{margin-left:var(--pbs-1);}
.ml-2{margin-left:var(--pbs-2);}
.ml-3{margin-left:var(--pbs-3);}
.ml-4{margin-left:var(--pbs-4);}
.ml-5{margin-left:var(--pbs-5);}
.mr-0{margin-right:0;}
.mr-1{margin-right:var(--pbs-1);}
.mr-2{margin-right:var(--pbs-2);}
.mr-3{margin-right:var(--pbs-3);}
.mr-4{margin-right:var(--pbs-4);}
.mr-5{margin-right:var(--pbs-5);}

.mx-0{margin-left:0; margin-right: 0;}
.mx-1{margin-left:var(--pbs-1); margin-right:var(--pbs-1);}
.mx-2{margin-left:var(--pbs-2); margin-right:var(--pbs-2);}
.mx-3{margin-left:var(--pbs-3); margin-right:var(--pbs-3);}
.mx-4{margin-left:var(--pbs-4); margin-right:var(--pbs-4);}
.mx-5{margin-left:var(--pbs-5); margin-right:var(--pbs-5);}

.my-0{margin-top:0; margin-bottom: 0;}
.my-1{margin-top:var(--pbs-1); margin-bottom:var(--pbs-1);}
.my-2{margin-top:var(--pbs-2); margin-bottom:var(--pbs-2);}
.my-3{margin-top:var(--pbs-3); margin-bottom:var(--pbs-3);}
.my-4{margin-top:var(--pbs-4); margin-bottom:var(--pbs-4);}
.my-5{margin-top:var(--pbs-5); margin-bottom:var(--pbs-5);}


 .pt-0{padding-top:0;}
 .pt-1{padding-top:var(--pbs-1);}
 .pt-2{padding-top:var(--pbs-2);}
 .pt-3{padding-top:var(--pbs-3);}
 .pt-4{padding-top:var(--pbs-4);}
 .pt-5{padding-top:var(--pbs-5);}
 .pb-0{padding-bottom:0;}
 .pb-1{padding-bottom:var(--pbs-1);}
 .pb-2{padding-bottom:var(--pbs-2);}
 .pb-3{padding-bottom:var(--pbs-3);}
 .pb-4{padding-bottom:var(--pbs-4);}
 .pb-5{padding-bottom:var(--pbs-5);}
 .ps-0{padding-block-start:0; padding-inline-start:0;}
 .ps-1{padding-block-start:var(--pbs-1); padding-inline-start:var(--pbs-1);}
 .ps-2{padding-block-start:var(--pbs-2); padding-inline-start:var(--pbs-2);}
 .ps-3{padding-block-start:var(--pbs-3); padding-inline-start:var(--pbs-3);}
 .ps-4{padding-block-start:var(--pbs-4); padding-inline-start:var(--pbs-4);}
 .ps-5{padding-block-start:var(--pbs-5); padding-inline-start:var(--pbs-5);}
 .pe-0{padding-block-end:0;}
 .pe-1{padding-block-end:var(--pbs-1);}
 .pe-2{padding-block-end:var(--pbs-2);}
 .pe-3{padding-block-end:var(--pbs-3);}
 .pe-4{padding-block-end:var(--pbs-4);}
 .pe-5{padding-block-end:var(--pbs-5);}
 .pl-0{padding-left:0;}
 .pl-1{padding-left:var(--pbs-1);}
 .pl-2{padding-left:var(--pbs-2);}
 .pl-3{padding-left:var(--pbs-3);}
 .pl-4{padding-left:var(--pbs-4);}
 .pl-5{padding-left:var(--pbs-5);}
 .pr-0{padding-right:0;}
 .pr-1{padding-right:var(--pbs-1);}
 .pr-2{padding-right:var(--pbs-2);}
 .pr-3{padding-right:var(--pbs-3);}
 .pr-4{padding-right:var(--pbs-4);}
 .pr-5{padding-right:var(--pbs-5);}

 .px-0{padding-left:0; padding-right: 0;}
 .px-1{padding-left:var(--pbs-1); padding-right:var(--pbs-1);}
 .px-2{padding-left:var(--pbs-2); padding-right:var(--pbs-2);}
 .px-3{padding-left:var(--pbs-3); padding-right:var(--pbs-3);}
 .px-4{padding-left:var(--pbs-4); padding-right:var(--pbs-4);}
 .px-5{padding-left:var(--pbs-5); padding-right:var(--pbs-5);}

 .py-0{padding-top:0; padding-bottom: 0;}
 .py-1{padding-top:var(--pbs-1); padding-bottom:var(--pbs-1);}
 .py-2{padding-top:var(--pbs-2); padding-bottom:var(--pbs-2);}
 .py-3{padding-top:var(--pbs-3); padding-bottom:var(--pbs-3);}
 .py-4{padding-top:var(--pbs-4); padding-bottom:var(--pbs-4);}
 .py-5{padding-top:var(--pbs-5); padding-bottom:var(--pbs-5);}

/* BS width and height utils */
.w-25 {	width: 25%!important;}
.w-50 {	width: 50%!important;}
.w-75 {	width: 75%!important;}
.w-100 { width: 100%!important;}
.w-auto { width: auto!important;}

.h-25 {	height: 25%!important;}
.h-50 {	height: 50%!important;}
.h-75 {	height: 75%!important;}
.h-100 { height: 100%!important;}
.h-auto { height: auto!important;}




/* btn styling - not quite "real" buttons, but workable */
.btn {
	border: 1px solid #888;
	padding: 0.1rem 0.5rem;
	background-color: var(--black);
	color: var(--white);
	cursor: pointer;
	border-radius: 0.1rem;
	text-decoration: none;
}
.btn:hover {
	background-color: color-mix(in srgb, var(--black), #000);
	border-color: var(--pico-secondary-hover-border);
}
.btn:focus-visible {
	border-color: var(--pico-secondary-border);
}
.btn:active {
	background-color: var(--pico-secondary);
}

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

/* seamlessly shim a button inside details/summary */
.button-dropdown {
	position: relative;
	top: -0.35em;
	left: -0.5em;
}

/* columns */
[data-pbs-cols]{ 
	column-count: attr(data-pbs-cols type(<number>));
}
[data-pbs-cols][data-pbs-gap] {
	column-gap: attr(data-pbs-gap type(<length>));
}
[data-pbs-cols][data-pbs-width] {
	column-width: attr(data-pbs-width type(<length>));
}

/* flexbox */
.flex {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-between;
}
.flex.reverse {	 flex-direction: row-reverse;}
.flex.columns {	 flex-direction: column;}
.flex.columns.reverse {	 flex-direction: column-reverse;}
.flex.center {align-items: center; justify-content: center;}
.flex[data-pbs-gap] {
	gap: attr(data-pbs-gap type(<length>));
}


/* various enhancments */
dialog {
	overscroll-behavior: contain;
}
body:has(dialog[open]){
	overflow: hidden;
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
