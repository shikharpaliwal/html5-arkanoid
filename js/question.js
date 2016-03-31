function Question() {

	this.AddSub = [
		["+Ss","-Ss"],
		["+SS","+dS","-SS","-dS"],
		["+DS","+Dd","-DS","-Dd"],
		["+SD","+DD","+td","-SD","-DD","-td"],
		["+tD","+tt","-tD","-tt"]
  ];

	this.MultDiv = [
		["xSs","/sS"],
		["xSS","xsd","/SS"],
		["xdS","/Sd"],
		["xdd","xdS","/SD","/dS"],
		["xDd","/dd"]
  ];

  this.level = 2;

	/* RANDOM QUESTION GENERATOR
	 * INPUT:: (integer)type, (integer)level
	 * ____________
	 *| ___type____|
	 *|1 | Add/Sub |
	 *|2 | Mult/Div|
	 *|3 | Any     |
	 *|____________|
	 *
	 * level - {1,2,3,4,5}
	 */

	this.generate = function(){
		rand_num = this.get_rand_num(0, 1);
		if(rand_num === 0){
			var type = this.AddSub[this.level];
		}
		else{
			var type = this.MultDiv[this.level];
		}
    return this.generateQues(type);
	}

	this.generateQues = function(set){
		var expr;
		var ans;

		set_length = set.length;
		sub_type = set[this.get_rand_num(0,set_length-1)].split('');

		var first = this.gen_num_from_char(sub_type[1]);
	  var second = this.gen_num_from_char(sub_type[2]);

    if (sub_type[0] === '-' & second > first){
			temp = second;
			second = first;
			first = temp;
		}

		if(sub_type[0] == '/'){
			ans = this.get_ans(first,second,'x');
			expr = ans.toString() + "/" + first.toString();
			ans = second;
		}
		else{
			ans = this.get_ans(first,second,sub_type[0]);
			expr = first.toString() + sub_type[0] + second.toString();
		}
    other_option = (this.get_rand_num(0,1) == 0) ? (ans+1) : (ans-1);
    var option1, option2, correct_option;

    if (this.get_rand_num(0,1) == 0){
      option1 = ans;
      option2 = other_option;
      correct_option = 1;
    }
    else{
      option2 = ans;
      option1 = other_option;
      correct_option = 2;
    }
		return [expr, option1, option2, correct_option];
	}

	// Takes two integer and computes answer using op
	// op can be {'+','-'','*','/'}
	this.get_ans = function(first, second, op){
		switch(op){
			case '+':
				return first + second;
			case 'x':
				return first * second;
			case '-':
				return first - second;
			case '/':
				return first / second;
			default:
				return -1;
		}
	}

	this.gen_num_from_char = function(input){
		switch(input){
			case 'S':
				return this.get_rand_num(1, 9);
			case 's':
				return this.get_rand_num(1, 5);
			case 'D':
				return this.get_rand_num(10, 99);
			case 'd':
				return this.get_rand_num(10, 20);
			case 'T':
				return this.get_rand_num(100, 999);
			case 't':
				return this.get_rand_num(100, 200);
			case 'F':
				return this.get_rand_num(1000, 9999);
			case 'f':
				return this.get_rand_num(1000, 2000);
			default	:
				return -1;
		}
	}

	this.get_rand_num = function(start, end){
		return Math.floor((Math.random()*(end - start + 1)) + start);
	}

}
