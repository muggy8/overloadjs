"use strict";
(function(context){
	
	var matchType = function (inputArray, matchArray){
		for (var key in matchArray) {
			var runningMatch = true;
			if (typeof inputArray[key] === "object" && typeof matchArray[key] === "object") {
				runningMatch = matchType(inputArray[key], matchArray[key]) && runningMatch
			}
			else if (typeof inputArray[key] === matchArray[key]) {
				runningMatch = true && runningMatch;
			}
			return runningMatch;
		}
	}
	
	context.overload = function(){
		var inputs = arguments;
		if (arguments.length === [1]){
			inputs = arguments[0];
		}
		console.log(inputs);
		
		var exe = function () {
			
		};
		var argsFn = function() {
			console.log("logsFn");
			return {use: useFn};
		}; 
		var useFn = function  () {
			console.log("useFn");
			return exe;
		};
		exe.args = argsFn;
		
		if (inputs.length && matchType(inputs, {length: "number", push: "function", indexOf: "function", splice: "function"})){
			console.log("overload in function", exe);
			return exe;
		} else if (inputs.length === 0) {
			console.log("overload as function")
			return {args: argsFn}
		}
	}
	
	if (typeof module != 'undefined' && module.exports) {module.exports = context["overload"];} 
})(this)