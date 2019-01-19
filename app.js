// InputController
var InputController = (function() {
	var guess = [];
	var answer = [];

	return {
		getInput: function(inputGuess) {
			guess = [];
			for (var i = 1; i <= 4; i++) {
	        	var inputClass = inputGuess + i;
	        	guess.push(parseFloat(document.querySelector(inputClass).value));
	        }
	        console.log(guess);
	        return guess;
	        
		},

		setup: function() {
			answer = [];
			while(answer.length < 4) {
				var temp = Math.floor(Math.random() * 10);
				if(answer.includes(temp) || temp === 0) {
					continue;
				}
				answer.push(temp);
			}
			console.log(answer);
			return answer;
			
		},

		produceHint: function() {
			var hint = [0, 0];
			for (var i = 0; i < 4; i++) {
				if(answer.includes(guess[i])) {
					hint[0] += 1;
				}
				if(answer[i] === guess[i]) {
					hint[1] += 1;
				}
			}
			return hint;
		}
	}

})();




// UI CONTROLLER
var UIController = (function() {

	var DOMstrings = {
        inputGuess: '.guess_num_',
        guessBtn: '.guess_btn',
        hintCon: '.hintContainer',
        h: '.hints',
        newGame: '.new_game_btn'
    };

    return {
    	getDOMstrings: function() {
    		return DOMstrings;
    	},

    	clearInput: function(inputGuess) {
    		for (var i = 1; i <= 4; i++) {
	        	var inputClass = inputGuess + i;
	        	document.querySelector(inputClass).value = '';
	        	document.querySelector(inputClass).classList.remove('validInput');
	        }
    	},

    	printHint: function(hint, guess, times, answer) {
    		var html;
    		if(hint[1] === 4) {
    			html = '<div></div><span class = "red">Sucess!</span> The answer is <span class = "blue">%guess%</span>.';
    		} else {
    			html = '<li>%guess% --> <span class = "red">%A%</span><span class = "blue">%B%</span></li>';
    			if(times == 6) {
    				html += '<div></div><span class = "red">Fail!</span> The answer is <span class = "blue">%answer%</span>.';
    			}
    		}
    		var g = '';
    		var a = '';
    		var b = '';
    		var ans = '';
    		for(var i = 0; i < guess.length; i++) {
    			g += guess[i];
    		}
    		for(var i = 0; i < answer.length; i++) {
    			ans += answer[i];
    		}
    		for(var i = 0; i < hint[0]; i++) {
    			a += 'A';
    		}
    		for(var i = 0; i < hint[1]; i++) {
    			b += 'B';
    		}
    		newHtml = html.replace('%guess%', g);
    		newHtml = newHtml.replace('%A%', a);
    		newHtml = newHtml.replace('%B%', b);
    		newHtml = newHtml.replace('%answer%', ans);
    		document.querySelector(DOMstrings.hintCon).insertAdjacentHTML('beforeend', newHtml);

    		if(hint[1] === 4 || times == 6) {
    			document.querySelector(DOMstrings.h).insertAdjacentHTML('beforeend', '<button class="new_game_btn" type = "button">New Game</button>');
    			return true;
    		}
    		return false;
    	}
    };

})();




// GLOBAL APP CONTROLLER
var controller = (function(InputCtrl, UICtrl) {

	var DOM = UICtrl.getDOMstrings();
	var times = 0;
	var answer;
	var valid = -4;

	var setupEventListeners = function() {
        for (var i = 1; i <= 4; i++) {
        	var inputClass = DOM.inputGuess + i;
        	document.querySelector(inputClass).addEventListener('input', ctrlInputGuess);
        	document.querySelector(inputClass).disabled = false;  
        } 
        // if(valid === 0) {
        	document.querySelector(DOM.guessBtn).addEventListener('click', displayHint);
        // }     
    };

    var ctrlInputGuess = function(e) {
    	var query = e.path[0];
    	var input = parseFloat(query.value);
    	if(!input || input <= 0 || input > 9) {
    		query.classList.remove('validInput');
    		valid = (valid === -4) ? valid : valid - 1;
    	} else {
    		query.classList.add('validInput');
    		valid += 1;
    	}
    	console.log(valid);
    	
    }

    var displayHint = function(e) {
    	var guess = InputCtrl.getInput(DOM.inputGuess);
    	UICtrl.clearInput(DOM.inputGuess);
    	var hint = InputCtrl.produceHint();
    	times += 1;
    	console.log(times);
    	if(UICtrl.printHint(hint, guess, times, answer)) {
    		document.querySelector(DOM.guessBtn).removeEventListener('click', displayHint);
    		for (var i = 1; i <= 4; i++) {
	        	var inputClass = DOM.inputGuess + i;
	        	document.querySelector(inputClass).disabled = true; 
	        }
    		document.querySelector(DOM.newGame).addEventListener('click', newGame); 
    	}
    }
    var newGame = function() {
		times = 0;
		var toRemove = document.querySelector(DOM.hintCon);
		while(toRemove.firstChild){
  			toRemove.removeChild(toRemove.firstChild);
		}
		var newGameBtn = document.querySelector(DOM.newGame);
		newGameBtn.parentNode.removeChild(newGameBtn);
		answer = InputCtrl.setup();
    	setupEventListeners();
    }

    return {
        init: function() {
            console.log('Application has started.');
            answer = InputCtrl.setup();
            setupEventListeners();
        }
    };
})(InputController, UIController);


controller.init();