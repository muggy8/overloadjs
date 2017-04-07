# overloadjs

Overload.js is a small JS library that mimics and emulates method overloading in JavaScript that many other typed languages would allow for. Overload JS is heavily inspired by JosephClay's implementation of Overloading in JavaScript. 

## general usage

There's 3 different ways of using Overload JS. Listed below are the 3 different methods.

### Method 1: As a standalone function
```javascript
var testfn = overload()
	.args("string", "string").use(function(firstName, lastName){
		console.log(`Hi ${firstName} ${lastName}`)
	})
	.args("number", "number").use(function(x, y){
		console.log(`${x} + ${y} = ${x+y}`);
	})
	.args().use(function(){
		console.log("no appropriate method signature");
	});
```

### Method 2: As a part of the function receiving all the arguments
```javascript
var testfn2 = function(){
	overload(arguments)
		.args("string", "string").use(function(firstName, lastName){
			console.log(`Hi ${firstName}, ${lastName}`)
		})
		.args("number", "number").use(function(x, y){
			console.log(`${x} + ${y} = ${x+y}`);
		})
		.args().use(function(){
			console.log("no appropriate method signature");
		});
}
```

### Method 3: As a part of the function receiving some to all of the arguments
```javascript
var testfn3 = function(a,b,c){
	overload(a,b,c)
		.args("string", "string", "string").use(function(firstName, middleName, lastName){
			console.log(`Hi ${firstName}, ${lastName}`)
		})
		.args("number", "number", "number").use(function(x, y, z){
			console.log(`${x} + ${y} + ${z} = ${x+y+z}`);
		})
		.args().use(function(){
			console.log("no appropriate method signature");
		});
}
```

### When to use one or the other?

All 3 methods are going to work for the common function however if you are using the function as a class constructor, I would personally use method 2 or 3 over method one as the `new` command is often quite finicky and I really wouldn't take my chances with it. For example I would personally do the following

```javascript
var person = function(){
	var context = this;
	overload(arguments)
		.args(/*...*/).use(/*...*/)
		.args(/*...*/).use(/*...*/)
		.args(/*...*/).use(/*...*/)
		.args().use(function(){
			// build default object
		});
};

person.prototype.method = overload()
	.args(/*...*/).use(function(/*...*/){/*...*/})
	.args(/*...*/).use(function(/*...*/){/*...*/})
	.args().use(function(){
		throw "My error message";
	});
```

## Type check and execution
The type checker checks for types recursively using `typeof` and if it hits an object, it will type check the object as well. This means that you can pass an Object of types into the args function.

```javascript
var myObjectFactory = overload()
	.args({offset: "number", duration: "number"}, "function").use(function(options, callback){/*...*/}
	.args("function").use(function(callback){/*...*/})
	.args().use(function(){/*...*/})
```

In the above example, you'll notice that you can place regular objects inside the args function and the library will make sure that the predefined conditions are met before calling the function in the following use block. Additionally after calling the function in in a use block, the rest of the functions wont be called anymore. You'll also notice that the overloading happens in reverse where you have the most specific inputs at the top and then less specific as the line goes down. This is because if you have a less specific function signature, (like No arguments) it will fit the bill of more input as the matcher does not check that the actual input matches the expected inputs but rather the actual inputs covers all the requirements of an expected input. This means that you should put your most demanding function at the top and your least demanding ones at the bottom. 

When overloading a function, you must also call use immediately after args as that will link the function and method signature together. 

## Other Objects?
You may have noticed that because of the use of typeof operator on variables, we are not able to get some other crucial objects such as Date or Array. However they do fortunately have some unique functions that you are able to take advantage of like below:

```javascript
var dateDef = {now: "function", parse: "function"}
var arrayDef = {length: "number", splice: "function", push:"function"}

var insertDateIntoArray = overload()
	.args(arrayDef, dateDef).use(function(array, date){/*...*/})
	.args(arrayDef).use(function(array){/*...*/})
	.args().use(function(){throw "no array"});
```

Because the Date and the Array objects have unique prototype functions that we know should exist, we can then identify the object that we are expecting. This is especially useful if you are making an API call to a server and you can use this method to check that all expected values are present in the response before executing on it. 

## What about my own custom Classes?

You can actually automatically get a class definition with the overload.define() function which accepts an instance of a class or the class constructor. Note though that the constructor of this class will needs to be able to be called with New and also be able to be produce a valid output with no inputs. As a result it might be better to just use an instance of the object. 

```javascript
var Person = function (name, powerLevel){
	this.name = name || "nameless"; 
	this.powerLevel = powerLevel || 1;
}

Person.prototype.scan = function(){
	console.log(`${this.name}'s power level is ${(this.powerLevel <= 9000)? this.powerLevel : "Over 9000"}`)
}

var goku = new Person("Goku", 9001);

var personDefinition = overload.define(goku);
/*  personDefinition will be
*   {
*		name: "string",
*		powerLevel: "number",
*		scan: "function"
*   }
*/
```

With that out of the way, you are now able to use the personDefinition in the future code. And if you happen to be making changes to the class as your code base progress, this should be able to catch that. Additionally if any future classes happen to inherit from the person class, because of the requirements of the typeof and object definition, they will be able to match the requirements quite nicely. With our definition of what a person object is, we can now use it in our future functions that expects a valid person object

```javascript
var powerUp = Overload()
	.args(personDefinition, "number").use(function(person, amount){
		person.powerLevel += amount;
		console.log(`${person.name}'s power level increased by ${amount} and is now ${person.powerLevel}`)
	})
	.args(personDefinition).use(function(person){
		person.powerLevel++;
		console.log(`${person.name}'s power level increased by 1 and is now ${person.powerLevel}`)
	})
	.args().use(function(){
		console.log("You cannot power up nobody");
	});
```

## Cool! what else does it do?
Nothing

## Licence?
MIT = free for all yay~!