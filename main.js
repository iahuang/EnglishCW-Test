/*
The Mansion

An interactive text-based adventure game programmed for 8th grade English class
Made by Ian Huang
*/

function doThing() {
	var tbox = document.getElementById("canvas_main");

	tbox.innerHTML = "Test 2";
}
function gameInit() { // Disable the "Next" button and initialize game
	var nextButton = document.getElementById("action_button");
	nextButton.disabled = true;
	nextButton.innerHTML = "";
	idiv.style.visibility = 'visible';
	tbox.innerHTML = "Bloop";
}
function onNext() { // When "Next" button is pressed in intro sequence
	introIndex+=1;
	var nextButton = document.getElementById("action_button");
	if (introIndex == strings.length-1) {
		nextButton.innerHTML = "Begin";
	}
	if (introIndex == strings.length) {
		gameInit();
		return;
	}
	tbox.innerHTML = strings[introIndex];
}
function onConfirm() {
	ibox.value = "";
}
class GameObject { // Class for all objects able to be interacted with
	constructor(synonyms,actions) {

	}
}
class Room {
	constructor(name,objects) {
		this.name = name;
		this.objects = objects;
	}
}
var tbox = document.getElementById("canvas_main");
var ibox = document.getElementById("action_input");
var idiv = document.getElementById("input_div");
idiv.style.visibility = 'hidden';
var strings = ["foo","This is my first Creative Writing Assigment for Term 3",
"This is an interactive story programmed in 2 weeks by me",
"You will be provided with a description of your scenario",
"Enter the action you want to take in space provided",
"Press 'Begin' when you are ready to start"];
var introIndex = 0;
