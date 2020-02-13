/*
!! See 'ES6 - String Field Date Validation.html', the main intended version, for more info & upcoming features !!

A simple date validation tool, for any basic string input element(s), that validates dynamically as the end-user types in a UK date, and will react accordingly. It is designed to be as compatible as possible (both backwards & cross-browser), while covering all user inputs that could be attempted when typing in a date (both valid or invalid).


There are 11 functions in this file.
Function with the largest signature take 1 arguments, while the median is 0.
Largest function has 20 statements in it, while the median is 2.
The most complex function has a cyclomatic complexity value of 41 while the median is 1.
*/


// Global Scope Declaration Space.
var inputField = document.getElementById('#');

// Call 'initialised' function, when document is ready/fully-loaded.
if (document.addEventListener) document.addEventListener("DOMContentLoaded", initialised, false);
else if (document.attachEvent) document.attachEvent("onreadystatechange", initialised);
else window.onload = initialised;

// Set/Unset Event Listeners when function called (some are nested). Active listeners will call relevant function, based on event/action.
function initialised() {
	inputField.addEventListener('focus', function() {
		
		inputField.addEventListener('keydown', function() {
			keyDownEv(event);
		});
		
		inputField.addEventListener('keyup', function() {
			checkInputtedChr(inputField);
			outputBox(false);
		});
	});
	
	inputField.addEventListener('blur', function() {
		outputBox(true); // Pass through truthy argument with call, to indicate field has no focus, so conditional will determine incomplete dates are now unacceptable.
		
		inputField.removeEventListener('keydown', function() {
			keyDownEv(event);
		});
		
		inputField.removeEventListener('keyup', function() {
			checkInputtedChr(inputField);
			outputBox(false);
		});
	});
}

// Call function on keydown event. Disable certain navigation keys, and pass keydown event as an argument to access properties. Prevent a key from being held down and producing many characters in the field. Also remove created elements from the output div/area, if the date is changed in any way (so to initialise output).
function keyDownEv(event) {
	if ([17, 36, 37, 40].indexOf(event.keyCode) > -1) { // [ctrl, home, left arrow, down arrow]
		event.preventDefault();
	} else if (event.repeat) {
		inputField.value = inputField.value.substring(0, inputField.value.length - 1);
	}
}

// Call function on key-by-key press (event) basis, check each character is valid (through a nest of conditionals). If invalid, delete this.character, by function call.
function checkInputtedChr() {
	var fieldVal = inputField.value;
	var n = fieldVal.length;
	var chr = fieldVal[n-1], prevChr = fieldVal[n-2], thirdReversedChr = fieldVal[n-3];
	var int = parseInt(chr);
	
	// Call when invalid character is conditionally detected during input, and delete. Furthermore when truthy argument is passed in with the call, the conditional will replace the removed character with a suitable separator (and will match the user's separator if separator already present).
	function delChr(a) {
		inputField.value = fieldVal.substring(0, n-1);
		
		if (a) {
			var separator = fieldVal[fieldVal.search(/[-/.]/)] || '/'; // Assign user's separator, unless falsey then assigns '/' as separator instead.
			inputField.value = inputField.value + separator; // Appends what is already in the field.
		}
	}
	
	// Switch conditional check each instance of a character input. Each case is checking at set string lengths (n).
	switch(true) {
		case (n < 3):
			if ((n == 1 && isNaN(int)) ||
			(n == 2 && ((prevChr == 3 && int > 1) ||
			(prevChr == 0 && (isNaN(int) || int == 0))))) {
				
				delChr(); // Passes falsey argument to indicate separator is NOT needed in place of removed character.

			} else if (n == 2 && ['/','-','.'].indexOf(chr) == -1 && (isNaN(int) || prevChr > 3)) {
				
				delChr(1); // Passes truthy argument to indicate separator needed in place of removed character.
			}
			break;
		
		case (n == 3):
			if (isNaN(prevChr) && isNaN(int)) {
				delChr();
			} else if (!isNaN(prevChr) && ['/','-','.'].indexOf(chr) == -1) {
				delChr(1);
			}
			break;
			
		case (n == 4):
			if ((isNaN(prevChr) && isNaN(int)) || (prevChr == 0 && (isNaN(int) || int == 0))) {
				delChr();
			}else if ((prevChr == 1 && ['/','-','.'].indexOf(chr) == -1 && (int > 2 || isNaN(int))) ||
			(prevChr > 1 && ['/','-','.'].indexOf(chr) == -1)) {
				delChr(1);
			}
			break;
			
		case (n == 5):
			if ((isNaN(prevChr) && isNaN(int)) ||
			(prevChr == 1 && (int > 2 ||(!isNaN(thirdReversedChr) && !isNaN(int)))) ||
			(prevChr == 0 && ((isNaN(thirdReversedChr) && (isNaN(int) || int == 0)) || (!isNaN(thirdReversedChr) && !isNaN(int))))) {
				delChr();
			} else if ((prevChr < 2 && ['/','-','.'].indexOf(chr) == -1 && isNaN(int)) ||
			(prevChr > 1 && ['/','-','.'].indexOf(chr) == -1)) {
				delChr(1);
			}
			break;
		
		case (n == 6):
			if ((isNaN(prevChr) && isNaN(int)) ||
			(isNaN(thirdReversedChr) && isNaN(int))) {
				delChr();
			} else if (!isNaN(prevChr) &&
			((isNaN(thirdReversedChr) && isNaN(int)) || (!isNaN(thirdReversedChr) && ['/','-','.'].indexOf(chr) == -1))) {
				delChr(1);
			}
			break;
		
		case (n < 11):
			if ((n < 9 && isNaN(int)) ||
			(n == 9 && (isNaN(int) || fieldVal.lastIndexOf("/") == 3)) ||
			(n == 10 && (isNaN(int) || fieldVal.lastIndexOf("/") == 4))) {
				delChr();
			}
			break;
		
		default:
			delChr();
			inputField.blur();
		// End of cases for switch conditional.
	}
	
	// Conditional block, to deal with any invalid entry that can be determined at any point during input. Check for two consecutive characters that are not numbers, or if a number of keys pressed simultaneously (which can bypass key-by-key check above).
	if (inputField.value.length > 1 &&
	inputField.value[n-1] !== undefined &&
	inputField.value[n-1].search(/[-/.]/) > -1 &&
	fieldVal.substring(0, n-1).search(/[-/.]/) > -1) {
		delChr(1);
	} else if (inputField.value.search(/([A-Z])/i) > -1 || inputField.value.search(/[\D]{2}/g) > -1) {
		inputField.value = ''; // This condition being met indicates a number of keys pressed simultaneously, bypassing the above key-press by key-press checks, so clear field fully, rather than delete character.
	}
}

// Construct the output div/area further, by updating the instructional text dynamically during inputting, while also build the html elements to host the further data manipulated from the user's entered date. Also counter any incomplete dates, by emptying the field, with default parameter set falsey for pass through during key press event (to prevent incomplete dates being deleted whilst inputting).
function outputBox(blur) {
	if (blur && inputField.value.length == 0) {
		inputField.value = '';
		//alert('Please enter a date into the field.');
	} else if (blur &&
	(inputField.value.length < 6 || isNaN(inputField.value[inputField.value.length - 2]) || isNaN(inputField.value[inputField.value.length - 4]))) {
		inputField.value = '';
		//alert('Invalid Date Entered!');
	} else {
		var dateConstistuentsArray = inputField.value.split(/[-/.]/);
		if (blur && dateConstistuentsArray.length == 3) {
			for (var i = 0; i < 3; i++) {
				switch (dateConstistuentsArray[i].length) {
					case 1:
						dateConstistuentsArray[i] = '0' + dateConstistuentsArray[i]; // Prepend a literal string '0' to single digits dd or mm.
						break;
				}
			}

			// Check for double digit years, and append '20' or '19' string literal to the value of yyyy (years). Decision based upon the digits entered being less than or greater than the current year (last two digits).
			var year = new Date().getFullYear().toString();
			if (dateConstistuentsArray[2].length == 2 && parseInt(year[2] + '' + year[3]) >= dateConstistuentsArray[2]) {
				dateConstistuentsArray[2] = '20' + dateConstistuentsArray[2];
			} else if (dateConstistuentsArray[2].length == 2 && parseInt(year[2] + '' + year[3]) < dateConstistuentsArray[2]) {
				dateConstistuentsArray[2] = '19' + dateConstistuentsArray[2];
			}
			
			var dd = dateConstistuentsArray[0], mm = dateConstistuentsArray[1], yyyy = dateConstistuentsArray[2];
			alert('UK Date Format: ' + dd + '-' + mm + '-' + yyyy); // Construct data to output.
			alert('US Date Format: ' + mm + '-' + dd + '-' + yyyy);
			alert('ISO Date Format: ' + yyyy + '-' + mm + '-' + yyyy);
			return dd, mm, yyyy;
		}
	}
}
//github: tberey