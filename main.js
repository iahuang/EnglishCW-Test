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
function writeImmediate(string) {
	if (outputDone) {
		tbox.innerHTML+=string+"<br>";
	} else {
		tbox.innerHTML+="...<br>"+string+"<br>...";
	}
}
function actionGeneric(actionName,onDo,input,useInventory) {
	var lastWord = input[input.length-1];
	var selectedObj;

	if (isIn(actions[actionName],input[0])) {
		if (useInventory != undefined) {
			selectedObj = getGameObjectFromInventory(lastWord);
		}
		if (selectedObj == undefined) {
			selectedObj = getGameObject(rooms[currentRoom],lastWord);
		}
		if (selectedObj == undefined) {
			writeToBoard("Could not find: "+lastWord);
			return true;
		} else {
			if (isIn(selectedObj.allowedActions,actionName)) {
				onDo(selectedObj);
			} else {
				writeToBoard("You cannot "+actionName+" the "+selectedObj.synonyms[0]+".");
			}

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
	if (inCombat) {
		writeToBoard("You cannot flee while in combat");
	}
	var direction = -1;
	var directions = [
		['left','l','port'],
		['forward','f','fwd','straight'],
		['right','r','starboard'],
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
		writeToBoard("Excellent.&nYou can exit the room through the door on your right by typing 'go right' or simply 'go r'&n\
		Please note that all directions in this game are RELATIVE to you");
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
	if (obj.synonyms[0] == "bomb") {
		writeToBoard("The bomb exploded.&s&s");
	}
	if (currentRoom == "outside_1" && !roomFlags["outsideGuardsDead"]) {
		writeToBoard("You hear a shout, but no explosion.&n&sIt appears the guard had vaporized the bomb before it detonated.&s");
		writeToBoard("Did you honestly think it would be that easy?&s&s");
		writeToBoard("You see flashlights sweep the air.&nYou are suddenly illuminated by a blinding beam of light.&s");
		writeToBoard("The guard comes running up the hill at you.&s");
		enterCombat();
		writeToBoard("Type help for information on combat");
	}
}

function loadRoom(roomId) {
	if (currentRoom == "test_room" && tutorialState == 3) {
		clearBoard();
		writeToBoard("Tutorial finished.&n&s&s&s&s&s");
		clearBoard();
		writeToBoard("&s&s&s&sWelcome to Infiltrator, an interactive text-based video game.&n\
		Your goal, as you may have guessed: Infiltrate the enemy base, and destroy it.&n&s. ");
	}
	currentRoom = roomId;
	rooms[currentRoom].display();

}
function equip(items) {
	inventory = [];

	for (var i=0;i<items.length;i++) {
		inventory.push(gameObjects[items[i]]);
	}
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function onHurt() {
	var damage = getRandomInt(1,3);
	writeImmediate("Ouch! You lost "+damage+" health");
	plrHealth-=damage;
	if (plrHealth <= 0) {
		exitCombat(true);
		return true;
	}
	return false;
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
	} else if (actionGeneric("examine",onActionExamine,input,true)) {
	} else if (actionGeneric("eat",onActionEat,input,true)) {
	} else if (actionGeneric("take",onActionTake,input)) {
	} else if (actionGeneric("throw",onActionThrow,input,true)) {
	} else if (input[0] == "help") {
		if (inCombat) {
			writeToBoard("This is how combat works:&n");
			writeToBoard("You can make any action you want, including combat-exclusive actions.");
			writeToBoard("However, taking a combat action will prompt your opponent to take an action as well.");
			writeToBoard("The combat-exclusive actions are as follows:&n\
			s (strike opponent with active weapon; fist by default)&n\
			b (block with your)&n\
			j (jump back;dodge)&n\
			d (disarm enemy)");
			writeToBoard("Type the abreviated action to perform it.&nThe quicker, the more effective.&n\
			For instance, if the enemy swings a sword at you, and you do not dodge quick enough, the dodge will fail.");
		} else{
			writeToBoard("Useful actions you can do at any time:&n&n\
			- Inventory: List all items in your inventory&n\
			- Clear: Clear all text");
		}


	} else if (inCombat) {
		var action = input[0];
		if (action == "s") {
			if (battleTick <= 2000) {
				var damage = getRandomInt(2,6);
				var loc = "";
				if (damage > 4) {
					loc = "kick to the face!";
				} else {
					loc = "punch to the gut!";
				}
				writeImmediate("You deliver a swift "+loc);
				enemyHealth-=damage;
				if (!firstTurn) {
					if (onHurt()) {
						return;
					}
				}
				if (enemyHealth <= 0) {
					writeToBoard("You win!");
					if (currentRoom == "outside_1") {
						roomFlags["outsideGuardsDead"] = true;
						rooms[currentRoom].description = "You are on a hill overlooking the enemy base.&nThe entrance is now unguarded.";
						rooms[currentRoom].connected[1] = "base_1";
					}
					exitCombat();
					loadRoom(currentRoom);
				}
			} else {
				writeImmediate("Blocked.");
				if (!firstTurn) {
					onHurt();
				}
			}
		} else if (action == "b") {
			if (battleTick <= 1500) {
				writeImmediate("You deflect the bullet with your electromagnetic gauntlet!");
			} else {
				writeImmediate("You try to deflect the bullet with your electromagnetic gauntlet, but you don't react in time!");
				if (!firstTurn) {
					onHurt();
				}
			}
		} else if (action == "j") {
			if (battleTick <= 1000) {
				writeImmediate("You quickly jump back, and the plasma bolt flies past you harmlessly.<br>The guard stumbles for a moment.");
				firstTurn = true;
			} else {
				writeImmediate("You fail to react in time and are hit with the bullet!");
				if (!firstTurn) {
					onHurt();
				}
			}
		} else if (action == "d") {
			if (battleTick <= 500) {
				if (enemyState != "disarmed") {
					writeImmediate("You violently kick the gun out of the man's hand!<br>It falls uselessly to the ground.");
					enemyState = "disarmed";
				} else {
					writeImmediate("You've already disarmed the guard");
				}

			} else {
				writeImmediate("You make a kick at the his weapon, but the guard had time to react!");
				if (!firstTurn) {
					onHurt();
				}
			}
		} else {
			writeImmediate("Unknown action!")
		}
		battleTick = 0;
		if (enemyState == "onguard") {
			writeImmediate("The guard fires at you!");
		} else {
			writeImmediate("The guard is disarmed and unable to fire!")
		}
		if (firstTurn) {
			firstTurn = false;
			writeImmediate("The guard raises his weapon to fire.");
		}


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
	currentOutput = currentOutput.replace("&s","&&&&&&&&&&&&&&&");
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
	constructor(synonyms,roomDescription,description,inventoryDescription,allowedActions) {
		this.synonyms = synonyms;
		this.description = description;
		this.roomDescription = roomDescription;
		this.inventoryDescription = inventoryDescription;
		this.allowedActions = allowedActions;
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
			writeToBoard(object.roomDescription);
		}
	}
}
function battleUpdate() {
	battleTick += 10; // in milliseconds

}
// Object declarations

var gameObjects = {"cookie":new GameObject(["cookie","biscuit"],
"There is a cookie sitting on a table.&n\
First, try throwing the cookie across the room. &n\
You can do this by typing 'throw the cookie' or simply 'throw cookie'.","It is an oatmeal-raisin cookie",
"A generic cookie",["take","eat","throw"]),

"letter":new GameObject(["letter","envelope"],"There is a letter sitting in your inbox.","Dear reader,&n&n\
The code for this game was written in a matter of days, and may contain bugs.&n\
The program can also only understand rudimentary commands, and cannot answer questions.&n\
If you have any questions, comments, or concerns, you may contact me on Schoology or in person.&n\
Thank you!","A letter",["take","examine"]),

"bomb":new GameObject(["bomb"],"There is an unactivated bomb on the ground.","A bomb, when detonated, emits a short blast of highly concentrated gamma radiation, blinding, and destroying the nervous cells of, any living organisms within 15 feet.","A radiation bomb",["take","examine","throw"])};

var roomFlags = {"outsideGuardsDead":false};

function buildRdFile(content) {
	var lines = content.split("\n");
	var roomName = lines[0].replace(">","");
	console.log("Building room "+roomName);
	var roomObjects = [];
	var roomDescription = "";
	var roomLinks = [];
	for (var i=1;i<lines.length;i++) {
		var line = lines[i];
		if (line == "") {
			continue;
		}
		if (line.startsWith("obj>")) {
			roomObjects.push(gameObjects[line.replace("obj>","")]);
		}
		if (line.startsWith("desc>")) {
			roomDescription += line.replace("desc>","")+"&n";
		}
		if (line.startsWith("link>")) {
			roomLinks = eval(line.replace("link>",""));
		}
	}
	rooms[roomName] = new Room(roomObjects,roomDescription,roomLinks);
}
function enterCombat() {
	inCombat = true;
	writeToBoard("&n------You are now in combat-------");
	tickCount = 0;
	firstTurn = true;
}
function exitCombat(dead) {
	inCombat = false;
	if (dead == undefined) {
		writeToBoard("&n------Exiting combat-------&nYou have "+plrHealth+"/20 health");
	} else {
		writeToBoard("&n------You died-------");
		loadRoom("start_room");
		plrHealth = 20;
	}
	enemyState = "onguard";
	enemyHealth = 10;
}
var rooms = {};
var roomFiles = ["test_room","start_room","outside_1","base_1"];
for (var i=0;i<roomFiles.length;i++) {
    $.ajax({ url: "rooms/"+roomFiles[i]+".rd", async: false, success: function(file_content) {
        buildRdFile(file_content);
      }
    });
}
var inCombat = false;
var enemyState = "onguard";
var enemyHealth = 10;
var plrHealth = 20;
var battleTick = 0;
var firstTurn = true;
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

var startingLoadout = ["bomb"];

currentRoom = "outside_1";

setInterval(function(){onUpdate();},20);
setInterval(function(){_write();},10);
setInterval(function(){battleUpdate();},10);
//writeToBoard("Introduction");
gameInit();
loadRoom(currentRoom);
equip(startingLoadout);
