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
function newLine() {
	outputQueue.push(" ");
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
function isIn(array,value) {
	for (var i=0;i<array.length;i++) {
		if (array[i] == value) {
			return true;
		}
	}
	return false;
}
function removeFromArray(array, value) {
	var index = array.indexOf(value);
	if (index > -1) {
		array.splice(value,1);
	}
}
function getGameObject(room,name) {
	for (var i=0;i<room.objects.length;i++) {
		var obj = room.objects[i];
		if (isIn(obj.synonyms,name)) {
			return obj;
		}
	}
	return undefined;
}
function actionGeneric(actionName,onDo,input) {
	if (isIn(actions[actionName],input[0])) {
		var lastWord = input[input.length-1];
		var selectedObj = getGameObject(rooms[currentRoom],lastWord);

		if (selectedObj == undefined) {
			writeToBoard("There is no "+lastWord+" in this area.");
			return true;
		} else {
			onDo(selectedObj);
			return true;
		}
	}
	return false;
}
function onActionExamine(obj) {
	writeToBoard(obj.description);
}
function onActionEat(obj) {
	writeToBoard("You ate the "+obj.synonyms[0]);
	removeFromArray(rooms[currentRoom].objects,obj);
}
function onActionTake(obj) {
	writeToBoard("You took the "+obj.synonyms[0]);
	removeFromArray(rooms[currentRoom].objects,obj);
}
function onConfirm() {
	var input = ibox.value.toLocaleLowerCase().split(" ");
	var lastWord = input[input.length-1];
	if (isIn(input,"please")) {
		writeToBoard("How polite of you. However, it is recommended that you make your actions as concise as possible.");
	} else if (actionGeneric("examine",onActionExamine,input)) {
	} else if (actionGeneric("eat",onActionEat,input)) {
	} else if (actionGeneric("take",onActionTake,input)) {
	} else {
		writeToBoard("You cannot do that here.");
	}
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
	constructor(synonyms,roomDescriptions,description) {
		this.synonyms = synonyms;
		this.description = description;
		this.roomDescriptions = roomDescriptions;
	}
}
class Room {
	constructor(objects,description) {
		this.objects = objects;
		this.description = description;
	}
	getId() {
		for (var room in rooms) {
			if (this.description == rooms[room].description) {
				return room;
			}
		}
	}
	display() {
		writeToBoard(this.description);

		for (var i=0;i<this.objects.length;i++) {
			var object = this.objects[i];
			writeToBoard(object.roomDescriptions[this.getId()]);
		}
	}

}

var rooms = {"test_room":new Room([
	new GameObject(["cookie","biscuit"],
	{"test_room":"There is a cookie sitting on a table"},"It is an oatmeal-raisin cookie")
],"Welcome to the testroom.&nIt's like a restroom, but for testing.")};
var actions = {"examine":["examine","look","check","inspect"],
"eat":["eat","consume"],
"take":["take","grab","steal","pocket"]};
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

currentRoom = "test_room";

setInterval(function(){onUpdate();},40);
setInterval(function(){_write();},10);
//writeToBoard("Introduction");
gameInit();
rooms["test_room"].display();
