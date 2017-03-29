function doThing() {
	var tbox = document.getElementById("canvas_main");

	tbox.innerHTML = "Test 2";
}
function typewriterText(string,tbox){
    tbox.innerHTML+=string
}
function onStart() {
    var tbox = document.getElementById("canvas_main");
    var text = "This is my English Creative Writing Assignment";
    for (int i=0;i<text.length;i++) {
        setTimeout(typewriterText(text[i],tbox),10);

    }
}
