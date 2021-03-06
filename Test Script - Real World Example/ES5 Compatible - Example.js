/*
    This is an example of the ES5 JavaScript Only validation script embedded into a Web Form's source code, via any means, as long as it executes the script with the DOM Content where the field is nested. This particular example has been modified for and appended onto a HTML Form that was deployed from a Web Form Deployment System, where the targeted field required users to only be allowed to enter a date in the past (to report an accident that has occurred). Further to this the form also allows the submission of any past date, while also compares to see whether the users entered date is within three days of todays date, and if it is not, reveals a hidden section that poses another question.
*/


//<script>

// Global Scope Declarations set.
var todayDD;
var todayMM;
var todayYYYY;


document.addEventListener('DOMContentLoaded', function() {
    
    if(window.location.href.indexOf("internal") > -1) { // Hide Extra Question by default on page load, until decision is made from the dates.
        document.getElementById("section_Not reported within 72 hours").style.display = "none";
        document.getElementById("section_Not reported within 72 hours").style.visibility = "hidden";
    } else {
        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.display = "none";
        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.visibility = "hidden";
    }
    
    var todayDate = new Date(); // Build today's date constituent parts.
    todayDD = todayDate.getDate();
    todayMM = todayDate.getMonth()+1; // Computing months begin index 0, so we need to plus 1 to it, so it's equivalent to human months.
    todayYYYY = todayDate.getFullYear();
    
    var todayDateField = document.getElementById('qc746fede1ba2175add76d9611f85cf34db1f29c3'); // Today's Date Hidden Field from form.
    if (todayMM.toString().length == 1) {
        todayMM = '0' + todayMM; // Prepend '0' to month if it is single digit, i.e. '2' would become '02'.
    }
    if (todayDD.toString().length == 1) {
        todayDD = '0' + todayDD; // Prepend '0' to date if it is single digit, i.e. '2' would become '02'.
    }
    todayDateField.value = todayYYYY + '-' + todayMM + '-' + todayDD; // Construct date and add into form's hidden field.
    
    datesDifference(); // Call function to check dates when ready to.
});


function datesDifference() {
    var inputField = document.getElementById('q3d99f664557fe6d2d755c4644e7b839874a85999'); // Date of Accident Field from form.
    
    initialised();
    
    // Set/Unset Event Listeners within this function (some nested). The active listeners will call relevant the function, based on action/event.
    function initialised() {
        inputField.addEventListener('focus', function() {
            
            inputField.addEventListener('keydown', function() {
                keyDownEv(event); // Pass through key press event, for property access later.
            });
            
            inputField.addEventListener('keyup', function() {
                checkInputtedChr(inputField);
                outputBox(false); // Pass through falsey argument to indicate still building up date, and not delete the improper date yet.
            });
        });
        
        inputField.addEventListener('blur', function() {
            outputBox(true); // Pass through truthy argument to indicate field has no focus, so conditional will determine incomplete dates are now unacceptable.
            
            inputField.removeEventListener('keydown', function() {
                keyDownEv(event);
            });
            
            inputField.removeEventListener('keyup', function() {
                checkInputtedChr(inputField);
                outputBox(false);
            });
        });
    }
    
    // 1) Some generic user input error handling, in that it; (i) disables certain navigation keys, and (ii) by passing the keydown event as an argument, prevents a key from being held down and producing many characters in the field.
    // 2) Removes our created elements in the output div/area, if the date is changed in any way (so to partially-initialise output).
    function keyDownEv(event) {
        if ([17, 36, 37, 40].indexOf(event.keyCode) > -1) { // [ctrl, home, left arrow, down arrow]
            event.preventDefault();
        } else if (event.repeat) {
            inputField.value = inputField.value.substring(0, inputField.value.length - 1);
        }
    }
    
    //Function is called on a key-by-key press basis, to check each inputted character is valid (through a series of conditionals, and one overarching switch conditional). If invalid, deletes said character.
    function checkInputtedChr() {
        var fieldVal = inputField.value;
        var n = fieldVal.length;
        var chr = fieldVal[n-1], prevChr = fieldVal[n-2], thirdReversedChr = fieldVal[n-3];
        var int = parseInt(chr);
        
        //Function is called whenever an invalid character is conditionally detected during the date inputting, and simply deletes it. Further more when truthy argument is passed in with the call, the conditional with replace the removed character with a actual date separator (and will match the user's separator if there is one already present).
        function delChr(a) {
            inputField.value = fieldVal.substring(0, n-1);
            
            if (a) {
                var separator = fieldVal[fieldVal.search(/[-/.]/)] || '/';
                inputField.value = inputField.value + separator;
            }
        }
        
        // Bulk of the validation checks occur using this switch conditional statement, which uses a case for each instance of a character being entered into field.
        switch(true) {
            case (n < 3):
                if ((n == 1 && isNaN(int)) ||
                (n == 2 && ((prevChr == 3 && int > 1) ||
                (prevChr == 0 && (isNaN(int) || int == 0))))) {
                    delChr();
                } else if (n == 2 && ['/','-','.'].indexOf(chr) == -1 && (isNaN(int) || prevChr > 3)) {
                    delChr(1);
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
        
        // Conditional block, that deals with any invalid input (but) that conflicts with any of the above conditions in the switch statement, or any other invalid entries that can be determined at any and all time during the user input. Checking for two consecutive characters that are not numbers, or if a 'keyboard mash' has occurred.
        if (inputField.value.length > 1 &&
        inputField.value[n-1] !== undefined &&
        inputField.value[n-1].search(/[-/.]/) > -1 &&
        fieldVal.substring(0, n-1).search(/[-/.]/) > -1) {
            delChr(1);
        } else if (inputField.value.search(/([A-Z])/i) > -1 || inputField.value.search(/[\D]{2}/g) > -1) {
            inputField.value = ''; // This is necessary as this condition being met indicates that a load of keys at the same time (mash the keyboard) and bypassing the above key-press by key-press checks on the preceding characters inputted.
        }
    }
    
    // Construct the output div/area further, by setting the instructional text dynamically, while also building the html elements that will host the further dates/data manipulated from the user's entered date, when it has been completed. Also counters incomplete dates, by emptying the field. Default parameter is falsey for passing through during field input to avoid meeting the conditions for this (incomplete dates wouldn't be deleted at this early stage).
    function outputBox(blur) {
        if (blur && inputField.value.length == 0) {
            inputField.value = '';
            alert('Please enter a date into the field.');
        } else if (blur &&
        (inputField.value.length < 6 || isNaN(inputField.value[inputField.value.length - 2]) || isNaN(inputField.value[inputField.value.length - 4]))) {
            inputField.value = '';
            alert('Invalid Date Entered!');
        } else {
            if (blur && inputField.value.split(/[-/.]/).length == 3) {
                var dateConstistuentsArray = inputField.value.split(/[-/.]/);
                for (var i = 0; i < 3; i++) {
                    switch (dateConstistuentsArray[i].toString().length) {
                        case 1:
                            dateConstistuentsArray[i] = '0' + dateConstistuentsArray[i];
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
                
                var dd = parseInt(dateConstistuentsArray[0]);
                var mm = parseInt(dateConstistuentsArray[1]);
                var yyyy = parseInt(dateConstistuentsArray[2]);
                inputField.value = dd + '-' + mm + '-' + yyyy;
                
                if (parseInt(dd) > parseInt(todayDD) && parseInt(mm) == parseInt(todayMM) && parseInt(yyyy) == parseInt(todayYYYY)) {
                    inputField.value = '';
                    alert('Please enter a date in the past.');
                } else if (parseInt(mm) > parseInt(todayMM) && parseInt(yyyy) == parseInt(todayYYYY)) {
                    inputField.value = '';
                    alert('Please enter a date in the past.');
                } else if (parseInt(yyyy) > parseInt(todayYYYY)) {
                    inputField.value = '';
                    alert('Please enter a date in the past.');
                }
                
                if (parseInt(todayMM) == parseInt(mm) && parseInt(todayYYYY) == parseInt(yyyy) &&
                (parseInt(todayDD) - parseInt(dd) > 3 || parseInt(todayDD) - parseInt(dd) < 0)) {
                    
                    if(window.location.href.indexOf("internal") > -1) {
                        document.getElementById("section_Not reported within 72 hours").style.display = "block";
                        document.getElementById("section_Not reported within 72 hours").style.visibility = "visible";
                    } else {
                        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.display = "block";
                        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.visibility = "visible";
                    }
                    
                } else if (parseInt(todayMM) !== parseInt(mm) && parseInt(todayYYYY) == parseInt(yyyy) &&
                (parseInt(todayDD) - parseInt(dd) < -27 || parseInt(todayDD) - parseInt(dd) > -30)) {
                    
                    if(window.location.href.indexOf("internal") > -1) {
                        document.getElementById("section_Not reported within 72 hours").style.display = "block";
                        document.getElementById("section_Not reported within 72 hours").style.visibility = "visible";
                    } else {
                        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.display = "block";
                        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.visibility = "visible";
                    }
                    
                } else {
                    
                    if(window.location.href.indexOf("internal") > -1) {
                        document.getElementById("section_Not reported within 72 hours").style.display = "none";
                        document.getElementById("section_Not reported within 72 hours").style.visibility = "hidden";
                    } else {
                        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.display = "none";
                        document.getElementById("section_sa9936b0364dc3048629a9429bf50144a6cc8df8c").style.visibility = "hidden";
                    }
                    
                }
            }
        }
    }
}
//</script>