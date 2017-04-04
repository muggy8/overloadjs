"use strict";
(function(context){
	
	var matchType = function (inputArray, matchArray){
		var runningMatch = true;
		for (var key in matchArray) {
			if (typeof inputArray[key] === "object" && typeof matchArray[key] === "object") {
				runningMatch = matchType(inputArray[key], matchArray[key]) && runningMatch;
			}
			else if (typeof inputArray[key] !== matchArray[key]) {
				runningMatch = false;
			}
		}
		return runningMatch;
	}
	
	context.overload = function(){
		var inputs = arguments;
		if (arguments.length === 1){
			inputs = arguments[0];
		}
		
		var exeArgs = [];
		
		var exe = function () {
			for (var key in exeArgs ) {
				var matchAndRun = exeArgs[key]
				if (matchType(arguments, matchAndRun.match)){
					return matchAndRun.execute.apply(null, arguments);
				}
			}
		};
		var argsFn = function() {
			var useArgs = arguments;
			
			return {use: function(callback){
				exeArgs.push({match: useArgs, execute: callback});
				if (inputs.length && matchType(inputs, useArgs)) {
					return callback.apply(null, inputs);
				}
				else {
					return exe;
				}
				
			}};
		}; 
		exe.args = argsFn;
		
		if (inputs.length && matchType(inputs, {length: "number", push: "function", indexOf: "function", splice: "function"})){
			console.log("overload in function");
			return exe;
		} else if (inputs.length === 0) {
			console.log("overload as function")
			return exe;
		}
	}
	
	if (typeof module != 'undefined' && module.exports) {module.exports = context["overload"];} 
})(this)