function Game(context){
	this.context = context;
	this.context_width = context.canvas.width;
	this.context_height = context.canvas.height;

	this.bar_height = 25;
	this.bar_width = 100;
	this.bar_x = 5;
	this.bar_y = this.context_height - this.bar_height - 5;
	this.move_bar = 30;

	this.ball_radius = 7;
	this.ball_x;
	this.ball_y;

	this.ball_vx;
	this.ball_vy;

	this.brick_area_width = this.context_width*0.7;
	this.brick_area_height = this.context_height*0.3;
	this.brick_area_x = 0.15*this.context_width;
	this.brick_area_y = 0.2*this.context_height;

	this.brick_height = 25;
	this.brick_width = 71;
	this.brick_status = new Array(9);

	this.brick_in_row = 7;
	this.brick_in_column = 5;
	this.brick_gap = 10;

	this.score;

	this.stop = false;
	this.space_active = true;

	this.init = function(){
		this.space_active = false;
		this.stop = false;
		this.score = 0;
		this.ball_x = this.context_width/3;
		this.ball_y = this.context_height/2;
		this.ball_vx = -5;
		this.ball_vy = -5;
		for (var i = 0; i < this.brick_in_row; i++){
			this.brick_status[i] = new Array(5);
			for (var j = 0; j < this.brick_in_column; j++){
				this.brick_status[i][j] = true;
			}
		}
		(function animloop(){
			request = requestAnimFrame(animloop);
			if (game.stop){
				cancelRequestAnimFrame(request);
				game.game_over();
  		}  
  		else {	
				game.update();
			}
		})();
	};

	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
	})();

	window.cancelRequestAnimFrame = (function() {
	  return window.cancelAnimationFrame         ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame    ||
      clearTimeout
	} )();

	this.update = function(){
		this.moveBall();
		this.check_collision();
		this.draw();
	};

	this.game_over = function(){
    this.context.fillStyle = "rgba(255, 255, 255,0.6)";
    this.context.fillRect(0, 0, this.context_width, this.context_width);
    this.context.fillStyle = "grey";
		this.context.font = "bold 15px Calibri";
		this.context.textAlign = 'center';
		this.context.fillText("YOUR SCORE!", this.context_width/2, this.context_height/2);
		this.context.font = "bold 30px Calibri";
		this.context.fillText(this.score, this.context_width/2, this.context_height/2 + 50);
		this.context.font = "bold 15px Calibri";
		this.context.fillText("Press spacebar to play again", this.context_width/2, this.context_height/2 + 100);
		this.space_active = true;
	}

	this.draw = function(){
		this.clearCanvas();
		this.drawBar();
		this.drawBrick();
		this.drawBall();
		this.printScore();
	};

	this.clearCanvas = function() {
		this.context.clearRect(0,0,this.context_width,this.context_height);
	};

	this.drawBrick = function() {
		for (var i = 0; i < this.brick_in_row; i++){
			for (var j = 0; j < this.brick_in_column; j++){
				if (this.brick_status[i][j] == true) {
					brick_x = this.brick_area_x + i*(this.brick_width+this.brick_gap);
					brick_y = this.brick_area_y + j*(this.brick_height+this.brick_gap);
					this.drawRect(brick_x, brick_y, this.brick_width, this.brick_height,"#00CED1");
				}
			}
		}
	};

	this.drawBar = function() {
		this.drawRect(this.bar_x, this.bar_y, this.bar_width, this.bar_height, "#32CD32");
	};

	this.drawBall = function() {
		this.context.beginPath();
	  this.context.strokeStyle="#DC143C";
	  this.context.lineWidth = 4;
	  this.context.arc(this.ball_x,this.ball_y,this.ball_radius,0,Math.PI*2,true);
	  this.context.stroke();
	  this.context.closePath();
	};

	this.printScore = function() {
		this.context.fillStyle = "grey";
		this.context.font = "15px Calibri";
		this.context.textAlign = 'center';
		this.context.fillText("SCORE : ", this.context_width - 180, 40);
		this.context.fillText(this.score, this.context_width - 100, 40);
	};

	this.drawRect = function(x,y,w,h,color){
		this.context.beginPath();
		this.context.strokeStyle = color;
		this.context.lineWidth = 3;    
		this.context.moveTo(x,y);
    this.context.lineTo(x,y + h);
    this.context.lineTo(x + w,y + h);
    this.context.lineTo(x + w,y);
    this.context.closePath();
    this.context.stroke();
	}

	this.check_collision = function (){
		wall_x = Math.max(this.ball_radius, this.ball_vx);
		wall_y = Math.max(this.ball_radius, this.ball_vy);
		if (this.ball_x > this.brick_area_x-wall_x && this.ball_x < this.brick_area_x+this.brick_area_width+wall_x && this.ball_y > this.brick_area_y-wall_y && this.ball_y < this.brick_area_y+this.brick_area_height+wall_y){
			for (var i = 0; i < this.brick_in_row; i++){
				for (var j = 0; j < this.brick_in_column; j++){
					if (this.brick_status[i][j] == true) {
						zone_x = this.brick_area_x + i*(this.brick_width+this.brick_gap) - wall_x;
						zone_y = this.brick_area_y + j*(this.brick_height+this.brick_gap) - wall_y;
						zone_width = this.brick_width + 2*wall_x;
						zone_height = this.brick_height + 2*wall_y;
						if (this.ball_x > zone_x && this.ball_x < zone_x + zone_width){
							if (this.ball_y > zone_y && this.ball_y < zone_y + zone_height){
								if (this.ball_y < zone_y + wall_y || this.ball_y > zone_y + zone_height - wall_y){
									this.ball_vy *= -1;
								}
								else {
									this.ball_vx *= -1;
								}
								this.brick_status[i][j] = false;
								this.score += 10;
								return;
							}
						}
					}
				}
			}
		}
	};

	this.moveBall = function(){
		this.ball_x += this.ball_vx;
		this.ball_y += this.ball_vy;
		wall_x = Math.max(this.ball_radius, this.ball_vx);
		wall_y = Math.max(this.ball_radius, this.ball_vy);
		if (this.ball_y < wall_y){
			if (this.ball_x < wall_x || this.ball_x > this.context_width - wall_x){
				this.ball_vx *= -1;
				this.ball_vy *= -1;
			}
			else {
				this.ball_vy *= -1;
			}
		}
		else if (this.ball_x < wall_x){
			if (this.ball_y > this.bar_y - wall_y && this.bar_x < wall_x){
				this.ball_vx *= -1;
				this.ball_vy *= -1;
			}
			else if (this.ball_y < this.bar_y - wall_y) {
				this.ball_vx *= -1;
			}
		}
		else if (this.ball_x > this.context_width - wall_x){
			if (this.ball_y > this.bar_y - wall_y && this.bar_x + this.bar_width > this.context_width - wall_x){
				this.ball_vx *= -1;
				this.ball_vy *= -1;
			}
			else if (this.ball_y < this.bar_y - wall_y) {
				this.ball_vx *= -1;
			}
		}
		else if (this.ball_x > this.bar_x && this.ball_x < this.bar_x + this.bar_width && this.ball_y > this.bar_y - wall_y && this.ball_y < this.bar_y){
			this.ball_vy *= -1;
		}
		else if (this.ball_y > this.context_height + this.ball_radius) {
			this.stop = true;
		}
	};

	this.onKeyLeft = function() {
		this.bar_x -= this.move_bar;
		if (this.bar_x < 0) {
			this.bar_x = 0;
		}
	};

	this.onKeyRight = function() {
		this.bar_x += this.move_bar;
		a = this.context_width - this.bar_width;
		if (this.bar_x > a) {
			this.bar_x = a;
		}
	};

	this.mouseMove = function(x) {
		this.bar_x = x - this.bar_width/2;
		a = this.context_width - this.bar_width;
		if (this.bar_x > a) {
			this.bar_x = a;
		}
		else if (this.bar_x < 0){
			this.bar_x = 0;
		}
	};
}