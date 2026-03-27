
//////// pico-bs fallback JS (mainly for FF) ////////////////////////////////////
///////// adds support for advance attr() usage, monitors data-pbs-theme-color, polyfills ::scroll-marker and sibling-index()
(function(){

function parseCSS(strCSS){
   var rt = String(strCSS);
		rt = rt.replace(/\/\*[\w\W]+?\*\//g, "");
		rt = rt.replace(/[\r\n]{3,500}/g, "\n"); 
		rt = rt.replace(/\s*\{\s*/g, "		{"); 
		rt = rt.replace(/\s*\,\s*/g, ",");
		rt = rt.replace(/\s*\}\s*/g, "}\n");
		rt = rt.replace(/\s*\;\s{1,99}/g, ";"); 
		rt = rt.replace(/\:\ +/g, ":");		
	return rt.trim(); 
}// end parseCSS()

function getAttrFixList(strCSS) {
	return strCSS.split("\n").filter(x => x.match(/attr\([\w\W]+?\)[;}]/g)).map(function(a, i, r) {
		var sel = a.split("\t")[0].trim();
		return a.split(/[;}{]/).filter(Boolean).filter(x => /attr\(/.test(x)).map(function(rule, ruleIndex) {
			var prop = rule.split(":")[0].trim();
			var attr = rule.split(/attr\(\s*([\w\-]+)/)[1];
			return {sel, prop, attr};
		});
	}).flat();
}//end getAttrFixList()


function getScrollMarkerRules(strCSS){
  return strCSS.split("\n").filter(x=>x.match(/::scroll-marker/g)).map(function(a,i,r){
   var sel = a.split("\t")[0].trim(); 
   var rule = a.split("\t")[2].trim();//.slice(1,-1).trim(); 
   var newSel = sel.replaceAll(">*", "+ *>")
     .replace(/::scroll/g, " .scroll")
     .replace(".scroll-marker:target-current", " + * .target-current").replace(/\s+/g," ");
		
	
	if(sel.includes("+")) newSel = sel.split(/\s*,\s*/).filter(x=>x.includes("+")).join(", ").trim();
	
	if(sel.includes("[data-pbs-paginat")){
		
	  if(sel.includes(":not(:nth-child")){
		  let inds = [...new Set( sel.match(/\d+/g) )];
		  var buf = inds.map(n=>
			  `[data-pbs-paginate="${n}"] + .scroll-marker-group .scroll-marker:not(:nth-child(${n}n+1))`
		  );
		  newSel = buf.join(",\n");
	  }

	  if(sel.includes("]>:nth-last")){
		  let inds = [...new Set( sel.match(/\d+/g) )];
		  var buf = inds.map(n=>
			  `[data-pbs-paginate='${n}'] + * .scroll-marker:nth-last-child(${n}):before`
		  );
		  newSel = buf.join(",\n");		
	  }
	}//end paginate rules over-rides
	
  return newSel + rule;
}).flat().join("\n");
} // end getScrollMarkerRules()




function augmentMarkup(strCSS, sheet){

	// polyfill advance attr usages by setting relevant [style]s with compositied attr values:
	if(!CSS.supports("column-gap: attr(x type(<length>))")){	
	  getAttrFixList(strCSS).map(function(fix){	  
	  	if(fix.attr=="data-pbs-duration") fix.suffix = "s";	  	  
		try{
			document.querySelectorAll(fix.sel+":not([style*='"+fix.prop+"'])").forEach( elm =>{
				var oldStyle = elm.getAttribute("style") || "";			
				var attrValue = elm.getAttribute(fix.attr) || "";
				oldStyle+= ";"+ fix.prop +":"+ attrValue + (fix.suffix || "") +";";
				elm.setAttribute("style", oldStyle);
			});//end qsa forEach()
		}catch(y){
			// console.error(y, fix); // this finds only ::scroll-marker rules, which use simple attr
		}//end try/catch
	  });//end fixes map()
	  
	  
		// watch for theme changes on body attrib
	if(!document.documentElement._pbs_watch){
	  document.documentElement._pbs_watch = true;
	  new MutationObserver((mutations) => {
		for (const mutation of mutations) { 
		  if (mutation.attributeName === 'data-pbs-theme-color') {
			  document.documentElement.style.setProperty("--pbs", document.documentElement.dataset.pbsThemeColor);
		  }
		}
	  }).observe( document.documentElement,  {
		attributes: true, 
		attributeFilter: ['data-pbs-theme-color'] 
	  });
	}//end if first time?


	}//end if not advanced css5  attr support? 
		
	// rebuild css rules and generated content for browsers w/o ::scroll-marker support:
	if(!CSS.supports("selector(::scroll-marker:target-current)")){
	
		// duplicate and re-interpret rules for ::scroll-marker with class-like replacements
	  if(!document.querySelector("style[title='picobscompat']")){
		var sheetBuffer =document.head.insertBefore(document.createElement("style"), sheet);
		sheetBuffer.innerHTML = getScrollMarkerRules(strCSS);
		sheetBuffer.title = "picobscompat";
	  }
	
	// augment all chooser, tabbed, and carousel widgets with generated handles
	  document.querySelectorAll(".chooser,.tabbed,.carousel, [data-pbs-paginate], .gallery").forEach(function(cont){
	  	if(cont._picobs) return;
	  	cont._picobs = true;
		var kids = [...cont.children].flat();
		var tagName = kids[0].tagName.replace("IMG", "DIV");
		var group = document.createElement("div");
		var isButtons = cont.classList.contains("buttons");
		var wrap = document.createElement("div");
		wrap.className="pbs_smg_wrap";
		
		cont.parentNode.insertBefore(wrap, cont);
		wrap.appendChild(cont); 
		wrap.appendChild(group); 
		// if(cont.dataset.pbsPaginate)  // would like to change insert order, but that will break selectors
		
		//cont.appendChild(wrap); 
		group.className="scroll-marker-group";
		
		var manualWidth = cont.style.getPropertyValue("--pbs-carousel-item-width");
		if(manualWidth) group.style.setProperty("--pbs-carousel-item-width", manualWidth);
				
		var handles = kids.map(function(kid, index){
			var handle = document.createElement("span");
			group.appendChild(handle);
			handle.tabIndex = 0;
			handle.innerHTML = kid.getAttribute("name") || kid.getAttribute("data-name") || " ";
			handle.className = "scroll-marker";
			handle.onkeypress = handle.onclick= _actvte;
			
			function _actvte(e){
				if(e.keyCode && !{10:1,13:1}[e.keyCode]) return;
				
				var old = wrap.querySelector(".target-current");
				old?.classList.remove("target-current");
				handle.classList.add("target-current");					
				kid.scrollIntoView({container: "nearest", inline: "nearest", block:"nearest"});  
				
				if(isButtons){ 
					var dir = old.compareDocumentPosition(handle);
					setTimeout(x=>{
						if( dir == 2 && handle.previousElementSibling) handle.previousElementSibling.focus();
						if( dir == 4 && handle.nextElementSibling) handle.nextElementSibling.focus();
					}, 10);					
				}//end isButtons?
			};//end _actvte()			
			
			return handle;
		});// end kids forEach()
		kids[0].scrollIntoView({container: "nearest", inline: "nearest", block:"nearest"});  
		handles[0].classList.add("target-current");		
	  });//end container forEach()
	  
	   document.querySelectorAll(".carousel[data-pbs-advance]").forEach(function(cont){
	   		var period = cont.dataset.pbsAdvance * 1000;
			var roof = cont.parentElement;
			var handles = [...roof.querySelectorAll(".scroll-marker")];
			var pauser = roof.querySelector("[data-pbs-carousel-click-pauser]");
			if(pauser) handles.pop().remove();
			//console.info({cont, period, roof, handles, pauser});
			setInterval(function _adv(){
				if(pauser && pauser.checked) return;
				var cur = 	roof.querySelector(".scroll-marker.target-current");
				var nxt = cur.nextElementSibling || handles[0];
				//console.info({cur, nxt, handles});
				nxt.click();				
			}, period);
	   });
	  
	  
	}//end if ::scroll-marker:target-current support?
	
	// fix marquee in ff:
	if(!CSS.supports("z-index: sibling-index()")){
	
	  document.querySelectorAll(".marquee>*").forEach(function(elm, index){
		  if(elm._picobs) return;
		  elm._picobs = true;
		  var kids = [...elm.parentNode.children].flat();
		  var count = kids.length;	
		  var oldStyle = elm.getAttribute("style") || "";			
		  var css = ` left: max(calc(var(--marquee-width) * ${count}), 100%);  animation-delay: calc( var(--marquee-duration) / ${count} * (${count} - ${index}) * -1);  `;
		  oldStyle+= ";"+css +";";
		  elm.setAttribute("style", oldStyle);
	  })//end marquee map()

 document.querySelectorAll(".carousel[data-pbs-advance]>*").forEach(function(elm, index){
		  if(elm._picobs) return;
		  elm._picobs = true;
		  var kids = [...elm.parentNode.children].flat();
		  var count = kids.length;	
		  var oldStyle = elm.getAttribute("style") || "";			
		  var css = ``;
		  oldStyle+= ";"+css +";";
		  elm.setAttribute("style", oldStyle);
	  })//end marquee map()
	  
	  
 	document.querySelectorAll(".carousel[data-pbs-advance]").forEach(function(cont, index){
 		 var oldStyle = cont.getAttribute("style") || "";
		 var n = cont.children.length;
		 if(cont.querySelector("[data-pbs-carousel-click-pauser]")) n--;
		 var css = `--advanceCount: ${n}`;
		  oldStyle+= ";"+css +";";
		  oldStyle = oldStyle.replace(/advancePeriod\:\d+;/,"advancePeriod:"+cont.dataset.pbsAdvance+"s;");
		  cont.setAttribute("style", oldStyle);
 	});
 
	
	}//end sibling-index?
	
	// bypass FF's input value peristence across reload behavior:
	document.querySelectorAll(".alert input[type='checkbox']").forEach(check=> check.checked = check.defaultChecked);
	
	if(document.body.dataset.pbsThemeColor)	document.body.style.setProperty("--pbs", document.body.dataset.pbsThemeColor);
	
}//end augmentMarkup()


async function picobs(e){

	if( CSS.supports("z-index: sibling-index()") && CSS.supports("selector(::scroll-marker:target-current)") && CSS.supports("column-gap: attr(x type(<length>))") ) return;
	delete sessionStorage.picobscache;
	var sheet = document.querySelector("link[href*='pico-bs']");
	var css = sessionStorage.picobscache || await fetch( sheet.href ).then(c=>c.text());
	css+= "\n\n" + pag.textContent;
	augmentMarkup(sessionStorage.picobscache = parseCSS(css), sheet);
	
}//end picobs()
if(document.readyState == "loading"){
	document.addEventListener("DOMContentLoaded", picobs);
}else{
	setTimeout(picobs, 0);
}
  
window.picobs= picobs; // call this if/after you inject content that needs rescanned/hydrating/upgrading
  
}());//end wrqapper

