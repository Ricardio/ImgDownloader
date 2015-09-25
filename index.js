var request = require("request");
var fs = require("fs");

String.prototype.regexIndexOf = function(regex, startpos) {
	var indexOf = this.substring(startpos || 0).search(regex);
	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}
var lastIndexOf = String.prototype.lastIndexOf;
var regexLastIndexOf = String.prototype.regexLastIndexOf;

var i = 0,  max = 100;

function Website(srcPatt, urlPatt, filters, urlFix, name) {
	this.srcPatt = srcPatt;
	this.urlPatt = urlPatt;
	this.filters = filters;
	this.urlFix = urlFix;
	this.name = name;
}
eval(fs.readFileSync('websites.js')+'');
//delete line above and add own websites using example below

/* 	Example
	var allImgsOnPage = new Website("srcPatt", [], ["s."], "http:", "nameinlink");
	var recursionPages = new Website("srcPatt", ["/", ""], [], "", "nameinlink");
	var websites = [allImgOnPage, recursionPages];
	var link = "http://www://nameinlinkddowddsds.com";
*/

var website = checkIn(link, websites); /*debug*/ console.log(website.name);
var newLink = replaceAt(link, website.urlPatt, "*");

var num1 = isolate(website.urlPatt, link, lastIndexOf);
request(link, function(error, response, body){
	htmlParser(body);
});

function htmlParser(html) {
	var regex = new RegExp("\"(https?:)?/?/" + website.srcPatt + "(.*?)\"", "g");
	html.replace(regex, cb);

	if(website.urlPatt.length > 0)
		request(numLink(num1, newLink, ++i), function(error, response, body){
			htmlParser(body);
		});

	function cb(match) {
		var url = website.urlFix + match.replace("\"", "").replace("\"","");
		var fileName = isolate(["/", url.length], url, lastIndexOf);

		if (website.filters.length > 0)
			if(checkIn(website.filters, "extFix") === "extFix"){
				var extenFix = isolate(["jpg", fileName.length], fileName, lastIndexOf);
				fileName = fileName.replace(extenFix, "");
			} else if(checkIn(fileName, website.filters))
				return;

		if (!fs.existsSync(path)) {
			var path = "C:/Users/Ricardio/Downloads/" + fileName;
			var file = fs.createWriteStream(path);
			request(url).pipe(file);
		}
		/*debug*/ console.log(url); console.log(fileName);
	}
}


function checkIn(str, item){
	var check;
	for(var i = 0; i < str.length; i++){
		if(typeof str !== "string"){
			check = str[i].indexOf(item);
			if(check > -1) return str[i];
		}

		if(typeof item[i] === "object")
			check = str.indexOf(item[i].name);
		else
			check = str.indexOf(item[i]);
		if(check > -1) return item[i];
	}
}

function isolate(arr, item, func){
	var bef = arr[0];
	var aft = arr[1];
	if(typeof arr[0] !== "number")
		bef = func.call(item, arr[0]) + arr[0].length;
	if(typeof arr[1] !== "number")
		aft = func.call(item, arr[1]);
	return item.substring(bef, aft);
}

function replaceAt(str, arr, char){
	var bef = str.substring(0, str.lastIndexOf(arr[0]) + arr[0].length)
	var aft = str.substring(str.lastIndexOf(arr[1]) + char.length);
	return bef + char + aft;
}

function numLink(strNum, item, iter){
	var num = +strNum + iter;
	if(strNum.indexOf("0") === 0){
		var size = "1"
		for(var i = 0; i < strNum.length - 1; i++)
			size += "0"
		if(num < +size){
			var pad = strNum.replace("0", "1");
			pad = +pad + iter + "";
			num = pad.replace("1", "0");
		}
	}
	return item.replace("*", num) + "";
}
