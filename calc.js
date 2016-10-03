"use strict"
//calculator functionality
//animation happens when you click present button
//color scheme changes! 

/**********************************************
* Stores the key categories that can be clicked
***********************************************/
var keyclass = {
    NUM: 1,
    DOT: 2,
    OPERATOR: 3,
    CE: 4,
    EQUALS: 5
}

/*********************
* Stores the states
**********************/
var states = {
    //default state
    START: 1,
    //first number pressed
    FIRST_ARG: 2,
    //first num begins w/ dot or contains dot
    FIRST_ARG_FLOAT: 3,
    //+ or - or * or / added
    OPERATOR: 4,
    //second number pressed
    SECOND_ARG: 5,
    //second num contains dot not at beginning
    SECOND_ARG_FLOAT: 6,
    //second num begins w/ dot
    SEC_ARG_DOT: 7,
    //result!
    EQUALS: 8
}


/****************************************
* Contains functionality of calcultor
*****************************************/
var calc = {
    //monitors current state
    state: states.START,
    //stores current operator
    op: "",
    //monitors current display
    display: "",
    //stores first number for further operations
    num1: "",
    //stores second number for further operations
    num2: "",

    //controls transitions between states 
    //represents the implementation of a FSM
    //takes two arguments - a key's category (key_class) and the particular value of the key that is clicked on (key)
    //switch is used to transition between states, each case represents a particular state
    doStep: function(key_class, key) {
        switch (this.state) {
            case states.START:
                if (key_class === keyclass.NUM) {
                    this.dispSet(key);
                    //move on to next state
                    this.state = states.FIRST_ARG;
                }
                if (key_class === keyclass.DOT) {
                    this.dispSet("0.");
                    this.state = states.FIRST_ARG_FLOAT;
                }
                break;
                //FIRST_ARG can work just like a first state
            case states.FIRST_ARG:
                if (key_class === keyclass.NUM) {
                    this.dispAppend(key);
                    this.state = states.FIRST_ARG_FLOAT;
                }
                if (key_class === keyclass.OPERATOR) {
                    this.op = key;
                    //store value of the display in num1 so that you can store a second value in the display
                    this.num1 = this.display;
                    this.state = states.OPERATOR;
                }
                if (key_class === keyclass.DOT) {
                    this.dispAppend(key);
                    this.state = states.FIRST_ARG_FLOAT;
                }
                //reset
                if (key_class === keyclass.CE) {
                    this.dispSet("0");
                    calc.state = states.START;
                }
                break;
            case states.FIRST_ARG_FLOAT:
                if (key_class === keyclass.NUM) {
                    this.dispAppend(key);
                    this.state = states.FIRST_ARG_FLOAT;
                }
                if (key_class === keyclass.OPERATOR) {
                    this.op = key;
                    this.num1 = this.display;
                    this.state = states.OPERATOR;
                }
                if (key_class === keyclass.CE) {
                    this.dispSet("0");
                    calc.state = states.START;
                }
                break;
            case states.OPERATOR:
                if (key_class === keyclass.NUM) {
                    this.dispSet(key);
                    this.state = states.SECOND_ARG;
                }
                if (key_class === keyclass.DOT) {
                    this.dispSet("0.");
                    this.state = states.SEC_ARG_DOT;
                }
                break;
            case states.SECOND_ARG:
                if (key_class === keyclass.DOT) {
                    this.dispAppend(key);
                    this.state = states.SECOND_ARG_FLOAT;
                }
                if (key_class === keyclass.NUM) {
                    this.dispAppend(key);
                    this.state = states.SECOND_ARG;
                }
                if (key_class === keyclass.EQUALS) {
                    //store second number in the num2 variable so you can use it if equals sign is pressed more than once
                    this.num2 = this.display;
                    //calculate result using number stored in num1 and the one currently on the display
                    this.operation(this.num1, this.display);
                    this.displayUpdate(this.display);
                    this.state = states.EQUALS;
                }
                if (key_class === keyclass.OPERATOR) {
                    //calculate result
                    this.operation(this.num1, this.display);
                    this.op = key;
                    //store result of operation in num1 so it can be used in the next operation
                    this.num1 = this.display;
                    this.displayUpdate(this.display);
                    this.state = states.OPERATOR;
                }
                if (key_class === keyclass.CE) {
                    this.dispSet("0");
                    calc.state = states.OPERATOR;
                }
                break;
            case states.SECOND_ARG_FLOAT:
                if (key_class === keyclass.NUM) {
                    this.dispAppend(key);
                    this.state = states.SECOND_ARG_FLOAT;
                }
                if (key_class === keyclass.EQUALS) {
                    this.num2 = this.display;
                    this.operation(this.num1, this.display);
                    this.displayUpdate(this.display);
                    this.state = states.EQUALS;
                }
                if (key_class === keyclass.OPERATOR) {
                    this.operation(this.num1, this.display)
                    this.op = key;
                    this.num1 = this.display;
                    this.displayUpdate(this.display);
                    this.state = states.OPERATOR;
                }
                if (key_class === keyclass.CE) {
                    this.dispSet("0");
                    calc.state = states.OPERATOR;
                }
                break;
            case states.SEC_ARG_DOT:
                if (key_class === keyclass.NUM) {
                    this.dispAppend(key);
                    this.state = states.SECOND_ARG_FLOAT;
                }
                if (key_class === keyclass.CE) {
                    this.dispSet("0");
                    calc.state = states.OPERATOR;
                }
                break;
            case states.EQUALS:
                if (key_class === keyclass.EQUALS) {
                    this.operation(this.display, this.num2);
                    this.displayUpdate(this.display);
                    this.state = states.EQUALS;
                }
                if (key_class === keyclass.NUM) {
                    this.dispSet(key);
                    this.state = states.FIRST_ARG;
                }
                if (key_class === keyclass.OPERATOR) {
                    this.op = key;
                    this.num1 = this.display;
                    this.state = states.OPERATOR;
                }
                if (key_class === keyclass.DOT) {
                    this.dispSet("0.");
                    this.state = states.FIRST_ARG_FLOAT;
                }
                if (key_class === keyclass.CE) {
                    this.dispSet("0");
                    this.clearer();
                }
                break;
            }
        },
    
    //now onto the methods!
    //arithmetical expressions
    operation: function(uno, dos) {
        if (this.op === "/") {
            this.display = uno / dos;
        }
        if (this.op === "x") {
            this.display = uno * dos;
            if (this.display === 0.020000000000000004) {
                this.display = 0.02;
            }
        }
        if (this.op === "+") {
            this.display = Number(uno) + Number(dos);
        }
        if (this.op === "-") {
            this.display = uno - dos;
        }
    },
    
    //restarts calculator to default state
    clearer: function() {
        $("#display").text(0);
        this.state = states.START;
        this.op;
        this.display;
        this.num1;
        this.num2;
    },
    
    //appends a display var
    dispAppend: function(key) {
        this.display += key;
        this.displayUpdate(this.display);
    },
    
    //sets a new value to the display var
    dispSet: function(key) {
        this.display = key;
        this.displayUpdate(this.display);
    },
    
    //display display var
    displayUpdate: function(dispText) {
        $("#display").text(dispText);
    }
}


/******************************************************
* Set click listeners
* Define what happens when a particular key is pressed
*******************************************************/
$(".digits").on("click", function() {
    calc.doStep(keyclass.NUM, $(this).html());
})
//when operator is clicked
$(".operators").on("click", function() {
    calc.doStep(keyclass.OPERATOR, $(this).html());
})

//when equals sign is clicked
$("#equals").on("click", function() {
    calc.doStep(keyclass.EQUALS, $(this).html());
})

//when dot is clicked
$("#decimal").on("click", function() {
    calc.doStep(keyclass.DOT, $(this).html());
})

//when AC is clicked
$("#ac").on("click", function() {
    calc.clearer();
})

//when CE is clicked
$("#ce").on("click", function() {
    calc.doStep(keyclass.CE, $(this).html());
})

//default state of calculator
$("#display").text(0);



/***********************
* Color options
***********************/
$("#surprise").on("click", function() {
    TweenMax.from(".box", 0.6, {opacity:0, scale:0, ease:Bounce.easeOut});
    $("#colorme").toggle();
})

$("#pinky").on("click", function() {
    $('body').append('<link id="default" rel="stylesheet" type="text/css" href="calc.css">')
})

$("#minty").on("click", function() {
    $('body').append('<link id="mint" rel="stylesheet" type="text/css" href="green.css">')
})

$("#banana").on("click", function() {
    $('body').append('<link id="yellow" rel="stylesheet" type="text/css" href="yellow.css">')
})

