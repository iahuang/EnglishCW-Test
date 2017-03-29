function doThing() {
	var tbox = document.getElementById("canvas_main");

	tbox.innerHTML = "Loadisng...";
}
function typewriterText(string,tbox){
    tbox.innerHTML+=string;
}
function sleep(milliseconds) {
 	var start = new Date().getTime();
  	for (var i = 0; i < 1e7; i++) {
    	if ((new Date().getTime() - start) > milliseconds){
      		break;
    	}
  	}
}
function type() {
    text = str.slice(0, ++i);
    if (text === str) return;

    document.getElementById('').innerHTML = text;

    var char = text.slice(-1);
    if( char === '<' ) isTag = true;
    if( char === '>' ) isTag = false;

    if (isTag) return type();
    setTimeout(type, 80);
}
function onStart() {
    var tbox = document.getElementById("canvas_main");
    var text = "This is my English Creative Writing Assignment";

	for (var i=0;i<text.length;i++) {
		tbox.innerHTML+=text[i];
	}
}
