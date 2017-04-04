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
	writeToBoard("Starting Game...&nType help at anytime for a list of useful actions&n");
}
function _write(text) {
	if (outputDone) {
		if (outputQueue.length == 0) {
			return;
		}
		if (outputQueue[0] != "&clear") {
			currentOutput = outputQueue[0]+"&n";
		} else {
			currentOutput = "";
			tbox.innerHTML = "";
		}

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
function getIn(array,value) {
	for (var i=0;i<array.length;i++) {
		if (array[i] == value) {
			return array[i];
		}
	}
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
function getGameObjectFromInventory(name) {
	for (var i=0;i<inventory.length;i++) {
		var obj = inventory[i];
		if (isIn(obj.synonyms,name)) {
			return obj;
		}
	}
	return undefined;
}
function actionGeneric(actionName,onDo,input,useInventory) {
	var lastWord = input[input.length-1];
	var selectedObj;

	if (isIn(actions[actionName],input[0])) {
		if (useInventory != undefined) {
			console.log(inventory);
			console.log(lastWord);
			selectedObj = getGameObjectFromInventory(lastWord);
		}
		if (selectedObj == undefined) {
			selectedObj = getGameObject(rooms[currentRoom],lastWord);
		}
		if (selectedObj == undefined) {
			writeToBoard("Could not find: "+lastWord);
			return true;
		} else {
			onDo(selectedObj);
			return true;
		}
	}

	return false;
}
function actionGo(input) {
	if (!isIn(actions["go"],input[0])) {
		return false;
	}
	if (tutorialLimiter(3)) {
		return true;
	}
	var direction = -1;
	var directions = [
		['left','l'],
		['forward','f','fwd'],
		['right','r'],
		['back','backwards','b']
	];

	var proposedDirection = input[input.length-1];

	for (var i=0;i<directions.length;i++) {
		if (isIn(directions[i],proposedDirection)) {
			if (rooms[currentRoom].connected[i] != undefined) {
				loadRoom(rooms[currentRoom].connected[i]);
				return true;
			}
		}
	}
	writeToBoard("You cannot go that way.");
	return true;
}
function onActionExamine(obj) {
	writeToBoard(obj.description);
}
function tutorialLimiter(state) {
	if (currentRoom == "test_room") {
		if (tutorialState < state) {
			writeToBoard("Don't do that yet.");
			return true;
		}
	}
	return false;
}
function onActionEat(obj,useInventory) {
	if (tutorialLimiter(2)) {
		return;
	}
	writeToBoard("You ate the "+obj.synonyms[0]);
	removeFromArray(rooms[currentRoom].objects,obj);
	removeFromArray(inventory,obj);
	if (currentRoom == "test_room") {
		writeToBoard("Excellent.&nYou can exit the room through the door on your right by typing 'go right' or simply 'go r'");
		tutorialState = 3;
	}
}
function onActionTake(obj) {
	if (tutorialLimiter(1)) {
		return;
	}
	writeToBoard("You took the "+obj.synonyms[0]);
	inventory.push(obj);
	removeFromArray(rooms[currentRoom].objects,obj);
	if (currentRoom == "test_room" && tutorialState == 1) {
		tutorialState = 2;
		writeToBoard("Good job!&nThe cookie has been added to your inventory.&nYou may check your inventory at any time\
		by typing 'inventory'.&nNow, as a reward, you can eat the cookie by typing 'eat cookie'.&s Five second rule, right?");
	}
}
function onActionThrow(obj,useInventory) {
	writeToBoard("You threw the "+obj.synonyms[0]);
	removeFromArray(inventory,obj);
	if (currentRoom == "test_room" && tutorialState == 0) {
		tutorialState = 1;
		writeToBoard("Great!&n\
		For future reference,&s you can always get more information about an object by typing 'examine <object>'.&n&sNow pick the cookie off the floor by typing 'pick up cookie', 'take cookie' etc.");
	}
}

function loadRoom(roomId) {
	if (currentRoom == "test_room" && tutorialState == 3) {
		clearBoard();
		writeToBoard("Tutorial finished.&n");
	}
	currentRoom = roomId;
	rooms[currentRoom].display();

}
function onConfirm() {
	if (ibox.value == "") {
		return;
	}
	var input = ibox.value.toLocaleLowerCase().split(" ");
	var lastWord = input[input.length-1];
	if (isIn(input,"please")) {
		writeToBoard("How polite of you. However, it is recommended that you make your actions as concise as possible.");
	} else if (actionGo(input)) {
	} else if (lastWord == "inventory") {
		if (inventory.length == 0) {
			writeToBoard("There is nothing in your inventory.");
		} else {
			writeToBoard("Inventory:");
			newLine();
			for (var i=0;i<inventory.length;i++) {
				var item = inventory[i];
				writeToBoard("- "+item.inventoryDescription);
			}
		}
	} else if (actionGeneric("examine",onActionExamine,input)) {
	} else if (actionGeneric("eat",onActionEat,input,true)) {
	} else if (actionGeneric("take",onActionTake,input)) {
	} else if (actionGeneric("throw",onActionThrow,input,true)) {
	} else if (input[0] == "help") {
		writeToBoard("Useful actions you can do at any time:&n&n\
		- Inventory: List all items in your inventory&n\
		- Clear: Clear all text");

	}
	else {
		writeToBoard("You cannot do that here.");
	}
	ibox.value = "";

}
function onUpdate() {
	if (currentOutput == "") {
		outputDone = true;
		return;
	}
	currentOutput = currentOutput.replace("&s","&&&");
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
function clearBoard() {
	outputQueue.push("&clear");
}
class GameObject { // Class for all objects able to be interacted with
	constructor(synonyms,roomDescriptions,description,inventoryDescription) {
		this.synonyms = synonyms;
		this.description = description;
		this.roomDescriptions = roomDescriptions;
		this.inventoryDescription = inventoryDescription;
	}
}
class Room {
	constructor(objects,description,connected) {
		this.objects = objects;
		this.description = description;
		this.connected = connected;
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
var objectCookie = new GameObject(["cookie","biscuit"],
{"test_room":"There is a cookie sitting on a table.&n\
First, try throwing the cookie across the room. &n\
You can do this by typing 'throw the cookie' or simply 'throw cookie'."},"It is an oatmeal-raisin cookie",
"A generic cookie");
var rooms = {"test_room":new Room([
	objectCookie
],"Welcome to the tutorial.&nThis is an introduction to the way \
you are able to interact with your enviroment.",[undefined,undefined,"start_room",undefined]),
"start_room":new Room([],"Test.",[undefined,undefined,undefined,undefined])};
var actions = {"examine":["examine","look","check","inspect","read"],
"eat":["eat","consume"],
"take":["take","grab","steal","pocket","pick"],
"throw":["throw","hurl","chuck","toss"],
"go":["go","move"]};
var inventory = [];
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

var tutorialState = 0;

currentRoom = "test_room";

setInterval(function(){onUpdate();},30);
setInterval(function(){_write();},10);
//writeToBoard("Introduction");
gameInit();
loadRoom(currentRoom);
