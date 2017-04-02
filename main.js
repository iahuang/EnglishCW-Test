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
	writeToBoard("Starting Game...&n");
}
function _write(text) {
	if (outputDone) {
		if (outputQueue.length == 0) {
			return;
		}
		currentOutput = outputQueue[0]+"&n";
		outputQueue = outputQueue.slice(1,outputQueue.length);
		outputDone = false;
		charIndex = 0;

	}
}
function writeToBoard(text) {
	outputQueue.push(text);
}
function onNext() { // When "Next" button is pressed in intro sequence
	if (!outputDone) {
		return;
	}
	introIndex+=1;
	var nextButton = document.getElementById("action_button");
	if (introIndex == strings.length-1) {
		nextButton.innerHTML = "Begin";
	}
	if (introIndex == strings.length) {
		gameInit();
		writeToBoard("Bloop");
		return;
	}
	currentOutput = strings[introIndex];
	outputDone = false;
	charIndex = 0;
	tbox.innerHTML = "";
}
function onConfirm() {
	ibox.value = "";

}
function onUpdate() {
	if (currentOutput == "") {
		return;
	}
	currentOutput = currentOutput.replace("&s","&&&&&");
	if (charIndex < currentOutput.length) {
		if (currentOutput[charIndex] == "&") {
			var nextChar = currentOutput[charIndex+1];
			if (nextChar == "n") {
				tbox.innerHTML += "<br>";
				charIndex+=1;
			}
		}
		else {

			tbox.innerHTML+=currentOutput[charIndex];
		}
		charIndex+=1;
	}
	else {
		outputDone = true;
	}

}
class Action {
	constructor(synonyms,onUse) {
		this.synonyms = synonyms;
		this.onUse = onUse;
	}
}
class GameObject { // Class for all objects able to be interacted with
	constructor(synonyms,actions) {
		this.synonyms = synonyms;
		this.onUse = onUse;
	}
}
class Room {
	constructor(objects,description) {
		this.objects = objects;
		this.description = description;
	}
}

var rooms = {"test_room":new Room([],"We are number one")};
var tbox = document.getElementById("canvas_main");
var ibox = document.getElementById("action_input");
var idiv = document.getElementById("input_div");
idiv.style.visibility = 'hidden';
var strings = ["foo","This is my first Creative Writing Assigment for Term 3",
"This is an interactive story programmed in 2 weeks by me",
"You will be provided with a description of your scenario",
"Enter the action you want to take in the space provided",
"Press 'Begin' when you are ready to start"];
var currentOutput = "";
var outputQueue = [];
var outputDone = true;
var introIndex = 0;
var charIndex = 0;
setInterval(function(){onUpdate();},40);
setInterval(function(){_write();},10);
//writeToBoard("Introduction");
gameInit();
writeToBoard(rooms["test_room"].description);
