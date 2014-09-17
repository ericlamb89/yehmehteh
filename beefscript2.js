$(document).ready(function(){

	var apostrophes = [["dn't","d|nt"],["n't","nt"],["'re","re"]];
	var weird = [["yes ","y| "],["oul","|"],["ia","|"],["the ","th| "],["le ","|l "],["led ","|*d"],["be ","b| "],["we ","w| "],["she ","sh| "],["he ","h| "],[" me "," m| "]];
	
	
	//takes in chr and determines if it is a vowel 
	function isVowel(chr){
		var isVowel = false;
		var vowels = ["a","e","i","o","u"];	
		
		if (vowels.indexOf(chr) != -1){
			isVowel = true;
		}
		
		return isVowel;	
		
	}
	//get info about the preceding and succeeding character
	function charInfo(str,start){	
		
		var charInfo = {
			chr: str[start],
			chrPrec: str[start-1],
			chrSucc: str[start+1],
			chrSucc2: str[start + 2],
			chrTrio: str[start-1]+ str[start] + str[start+1],
			//2 characters preceding 
			chrsPrec2: str[start-2]+str[start-1],
			
			//3 characters preceeding
			chrsPrec3: str[start-3]+str[start-2]+str[start-1],
			//followed by vowel
			fbv: false,
			//preceded by vowel
			pbv: false
			
			}
			
		if (isVowel(charInfo.chrPrec)){
			charInfo.pbv = true;
		}
		
		if (isVowel(charInfo.chrSucc)){
			charInfo.fbv = true;
		}
		
		return charInfo;
	}
		
	//handle Ws 
	function processWY(str,start,chr){
		while(str.indexOf(chr,start) != -1){
			start = str.indexOf(chr,start);
			var strStats = charInfo(str,start);
			
			//only process if not the first letter in a word
			if(strStats.chrPrec != " " && strStats.chrPrec != null){
				//if preceded by a vowel...
				if(strStats.pbv){
					//if followed by ed
					if(strStats.chrSucc+strStats.chrSucc2 == "ed"){
						str= str.substring(0,start-1) + "|" + str.substring(start+2)
					}
					//if not followed by a vowel 
					if(!strStats.fbv && strStats.chrSucc != "h"){
						str= str.substring(0,start-1) +  "|" + str.substring(start+1);
					}
				}
				
				//if y and not preceded by a vowel
				if(!strStats.pbv && chr == "y"){
					str = str.substring(0,start)+"|"+str.substring(start+1);
				}	
			}	
			
			start += 1;
		}
		return str;
	}
		
		
	//handle words ending in ed"
	function processED(str,start){
		while(str.indexOf("ed ",start) != -1){
			start = str.indexOf("ed ",start);
			var strStats = charInfo(str,start);
			//if preceeded by vowel
			if(!strStats.pbv){
				if(strStats.chrPrec == "t" || strStats.chrPrec == "d" || strStats.strchrsPrec2 == "tf" || strStats.chrsPrec3 == "nak"){
					str=str.substring(0,start)+"|"+str.substring(start+1);
				}
				else
				{
					str=str.substring(0,start)+"*"+str.substring(start+1);
				}
			}
			start += 1;
		}
		return str;
	}
					
		
	//handle "es"
	function processE(str,start){
		while(str.indexOf("e",start) != -1){
			start = str.indexOf("e",start);
			var strStats = charInfo(str,start);
			//remove if at the end of a word
			if(strStats.chrSucc == " " || strStats.chrSucc + strStats.chrSucc2 =="s "){
				str = str.substring(0,start)+str.substring(start+1);
			}
			else if(strStats.fbv){
				str = str.substring(0,start)+"|"+str.substring(start+2);
			}
			else if(!strStats.fbv && strStats.chrSucc != " " && strStats.chrSucc != null){
				str=str.substring(0,start)+"|"+str.substring(start+1);
			}		
			start += 1;
		}
		return str;
	}	
					
					
	
	function processVowels(str){
	//loop through each vowel
		var vowelSounds = ["a","i","o","u"];
		for(var i = 0; i < vowelSounds.length; i++){
			//check each letter in str against current vowel
			//replace with | if it's a vowel
			while(str.indexOf(vowelSounds[i])!=-1){
				str = str.replace(vowelSounds[i],"|");	
			}
		}
		while(str.indexOf("|")!= -1){
			str = str.replace("|","eugh");
		}
		while(str.indexOf("eugheugh")!= -1){
			str = str.replace("eugheugh","eugh");
		}
		while(str.indexOf("eughgh")!= -1){
			str = str.replace("eughgh","eugh");
		}
		
		while(str.indexOf("*")!=-1){
			str = str.replace("*","e");
		}

		return str;
	}
		
		
	

	//generic function - takes in 2D array of search / replace pairs - applies to string
	function loopReplace(array,str){
		for (var i = 0; i < array.length; i++){
			while(str.indexOf(array[i][0])!= -1){
				str = str.replace(array[i][0],array[i][1]);
			}
		}
		return str;
	}
	



	function translate(input){
	
		//set to lowercase
		var output = input.toLowerCase();
		
		//adds space to the end of the string to make sure last word is treated correctly 
		output = output + " ";
		
		
		//check for / remove apostrophes not including possessive
		if(output.indexOf("'")!=-1){
			output = loopReplace(apostrophes,input);
		
		}
		
		//remove weird cases
		output = loopReplace(weird,output);
		
		//process ws
		
		if(output.indexOf("w",1)!= -1){
			output = processWY(output,output.indexOf("w",1),"w");
		}
		
		//process ys
		if(output.indexOf("y",1)!= -1){
			output = processWY(output,output.indexOf("y",1),"y");
		}
		
		//process ed
		if(output.indexOf("ed ",1)!= -1){
			output = processED(output,output.indexOf("ed ",1));
		}
		
		//process e
		if(output.indexOf("e") != -1){
			output = processE(output,output.indexOf("e"));
		}
		
		
		output = processVowels(output);
		
		
		
		
		
		return output;
	
	}
	
	

	

		
		
	$("#input").keydown(function(e){
		if(e.which == 13){
			$("#results").remove();
			var input = $("#input").val();
			input = translate(input);
			var $jumbotron = $(".jumbotron");
			var $results = $("<div id =\"results\" class=\"panel panel-default\"><div class=\"panel-body\">"+input+"</div></div>");
			$results.hide().appendTo($jumbotron).fadeIn("slow");	
		}
	});
});
