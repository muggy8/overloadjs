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
		var executionContext = this;
		var inputs = arguments;
		if (arguments.length === 1){
			inputs = arguments[0];
		}
        //inputs = Array.prototype.slice.call(inputs, 0);

		var exeArgs = [];
        var exefake = function (){};
        exefake.use = exefake.args = function(){return exefake;};

		var exe = function () {
			for (var key in exeArgs ) {
				var matchAndRun = exeArgs[key]
				if (matchType(arguments, matchAndRun.match)){
					return matchAndRun.execute.apply(this, arguments);
				}
			}
		};
		var argsFn = function() {
			var useArgs = arguments;

			return {use: function(callback){
				exeArgs.push({match: useArgs, execute: callback});
				if (inputs.length && matchType(inputs, useArgs)) {
					callback.apply(executionContext, inputs);
					return exefake;
				}
				else {
					return exe;
				}

			}};
		};
		exe.args = argsFn;
        return exe;
	}

	if (typeof module != 'undefined' && module.exports) {module.exports = context["overload"];}
})(this)