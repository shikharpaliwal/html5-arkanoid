function Game(context, questionGenerator){

  this.context = context;
  this.context_width = context.canvas.width;
  this.context_height = context.canvas.height;

  this.questionGenerator = questionGenerator;

  this.score = 0;
  this.timeLeft = 30;

  this.questionCoordinates = [
    [this.context_width*0.22,this.context_height*0.1 + this.context_width*0.57],
    [this.context_width*0.47,this.context_height*0.1 + this.context_width*0.28],
    [this.context_width*0.82,this.context_height*0.1 + this.context_width*0.45]
  ];

  this.answerCoordinates = [
    [this.context_width*0.255,this.context_height*0.885],
    [this.context_width*0.755,this.context_height*0.885]
  ];

  this.onLowScoreMessages = [
    ['We feel for you bro!', 'Try Again'],
    ['Haar ke jeetne wale ko Baazigar kehte hain!',''],
    ['Keep calm and try again!',''],
    ['Bade bade deshon mein aisi choti choti baatein', 'hoti rehti hain! Phir se try karo'],
    ['Kapoor Saab kya kahenge ?', 'Phir se try karo'],
    ['Sharmaji ke bete ne 15 score kiya!', 'Aur tum ?'],
    ['Log kya kahenge ?', 'Try Again']
  ]

  this.questionSet;

  this.timerStarted = false;

  this.setIntervalId;

  this.init = function(){
    this.drawObjects();
    window.addEventListener("mousedown", this.onOptionClick, false);
  };

  this.onOptionClick = function(event){
    if (!game.timerStarted){
      game.setIntervalId = window.setInterval(function(){
        game.timeLeft -= 1;
        if (game.timeLeft < 0){
          window.removeEventListener("mousedown", game.onOptionClick, false);
          window.clearInterval(game.setIntervalId);
          game.gameOver();
        }
        else{
          game.printTime();
        }
      }, 1000);
      game.timerStarted = true;
    }
    x = event.pageX;
    y = event.pageY;
    if ( x >= 0 && x < game.context_width*0.5 && y >= game.context_height*0.75 && y <= game.context_height) {
      if (game.questionSet[3] === 1){
        game.selectRightOption();
      }
      else {
        game.selectWrongOption();
      }
    }
    else if ( x >= game.context_width*0.5 && x < game.context_width && y >= game.context_height*0.75 && y <= game.context_height) {
      if (game.questionSet[3] === 2){
        game.selectRightOption();
      }
      else {
        game.selectWrongOption();
      }
    }
  }

  this.selectRightOption = function(){
    this.score += 1;
    this.drawObjects();
  }

  this.selectWrongOption = function(){
    this.score -= 1;
    this.drawObjects();
  }

  this.drawObjects = function(){

    this.drawRect(0,0,this.context_width,this.context_height,'#D3F4F3');

    // Display score
    this.printScore();

    // Display time
    this.printTime();

    // Draw Question kite
    var questionKiteImg = document.getElementById('question-kite-img');
    this.context.drawImage(questionKiteImg, 0, this.context_height*0.1, this.context_width, this.context_width);

    // Draw Option Rolls
    var rollImg = document.getElementById('roll-img');
    this.context.drawImage(rollImg, 0, this.context_height*0.75, this.context_width, this.context_height*0.25);

    // Get question and print it
    this.setQuestion();
    this.printQuestion();
  };

  this.printScore = function(){
    // Set writing style
    this.context.fillStyle = "#A457E6";
    this.context.font = "20px Arial";
    this.context.textAlign = 'center';
    // Display score
    this.context.fillText("SCORE : " + this.score.toString(), this.context_width*0.2, this.context_height*0.07);
  }

  this.printTime = function(){
    this.drawRect(this.context_width*0.7,0,this.context_width,this.context_height*0.1,'#D3F4F3');
    // Set writing style
    this.context.fillStyle = "#EF5E3C";
    this.context.font = "20px Arial";
    this.context.textAlign = 'center';
    // Display score
    this.context.fillText("00:" + this.timeLeft.toString(), this.context_width*0.85, this.context_height*0.07);
  }

  this.printQuestion = function(){
    var randomKite = Math.floor( Math.random()*3);
    var questionCoordinate = this.questionCoordinates[randomKite];
    // Set writing style
    this.context.fillStyle = "white";
    this.context.font = "27px Arial";
    this.context.textAlign = 'center';
    this.context.fillText(this.questionSet[0], questionCoordinate[0], questionCoordinate[1]);
    this.context.fillText(this.questionSet[1], this.answerCoordinates[0][0], this.answerCoordinates[0][1]);
    this.context.fillText(this.questionSet[2], this.answerCoordinates[1][0], this.answerCoordinates[1][1]);
  }

  this.drawRect = function(x,y,w,h,color){
    this.context.beginPath();
    this.context.strokeStyle = "#D3F4F3";
    this.context.fillStyle = color;

    this.context.lineWidth = 1;
    this.context.moveTo(x,y);
    this.context.lineTo(x,y + h);
    this.context.lineTo(x + w,y + h);
    this.context.lineTo(x + w,y);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
  }

  this.setQuestion = function(){
    this.questionSet = this.questionGenerator.generate();
  }

  this.gameOver = function(){
    var scoreImg = document.getElementById('score-img');
    this.context.drawImage(scoreImg, 0, 0, canvas.width, canvas.height);

    this.context.fillStyle = "#685545";
    this.context.font = "bold 27px Arial";
    this.context.textAlign = 'center';
    this.context.fillText("GAME OVER", this.context_width*0.5, this.context_height*0.1);

    this.context.font = "23px Arial";
    this.context.fillText("Your Score", this.context_width*0.5, this.context_height*0.17);

    this.context.fillStyle = "#EF5E3C";
    this.context.font = "bold 90px Arial";
    if (this.score < 0){
      this.score = 0;
    }
    this.context.fillText(this.score, this.context_width*0.5, this.context_height*0.34);

    this.context.fillStyle = "#685545";
    this.context.font = "12px Arial";

    if(this.score <= 0){
      this.context.font = "15px Arial";
      displayMessage = this.onLowScoreMessages[Math.floor( Math.random()*7)];
      this.context.fillText(displayMessage[0], this.context_width*0.5, this.context_height*0.5);
      this.context.fillText(displayMessage[1], this.context_width*0.5, this.context_height*0.56);
      this.context.fillStyle = "white";
      this.context.font = "12px Arial";
      this.context.fillText("Score more than 10 to unlock a reward!", this.context_width*0.5, this.context_height*0.82);
    }
    else{
      var discount = 0;
      if (this.score > 0 && this.score <= 17){
        discount = 5;
        this.context.fillText("You unlocked FLAT 5% off for your next order", this.context_width*0.5, this.context_height*0.42);
        this.context.fillStyle = "white";
        this.context.font = "12px Arial";
        this.context.fillText("Score more than 17 to unlock a better reward!", this.context_width*0.5, this.context_height*0.82);
      }
      else if (this.score > 17 && this.score <= 25){
        discount = 10;
        this.context.fillText("You unlocked FLAT 10% off for your next order", this.context_width*0.5, this.context_height*0.42);
        this.context.fillStyle = "white";
        this.context.font = "12px Arial";
        this.context.fillText("Score more than 25 to unlock a better reward!", this.context_width*0.5, this.context_height*0.82);
      }
      else if (this.score > 25){
        discount = 20;
        this.context.fillText("You unlocked FLAT 20% off for your next order", this.context_width*0.5, this.context_height*0.42);
        this.context.fillStyle = "white";
        this.context.font = "12px Arial";
        this.context.fillText("Mogambo khush hua!", this.context_width*0.5, this.context_height*0.82);
      }
      this.context.beginPath();
      this.context.moveTo(this.context_width*0.15,this.context_height*0.45);
      this.context.lineTo(this.context_width*0.85,this.context_height*0.45);
      this.context.lineWidth = 0.3;
      this.context.strokeStyle = '#685545';
      this.context.stroke();

      this.context.font = "12px Arial";
      this.context.fillStyle = "#685545";
      this.context.fillText("Use Code", this.context_width*0.5, this.context_height*0.5);
      this.context.font = "10px Arial";
      this.context.fillText("Fetching your reward..", this.context_width*0.5, this.context_height*0.55);

      var xhttp;
      if (window.XMLHttpRequest) {
          xhttp = new XMLHttpRequest();
          } else {
          // code for IE6, IE5
          xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          code = xhttp.responseText;
          console.log(code);
          if (code.length < 14){
            var replayImg = document.getElementById('promo-img');
            game.context.drawImage(replayImg, game.context_width*0.3, game.context_height*0.52, game.context_width*0.4, game.context_height*0.07);

            game.context.fillStyle = "white";
            game.context.font = "20px Arial";
            game.context.fillText(code.toUpperCase(), game.context_width*0.5, game.context_height*0.57);
          }
          else {
            game.drawRect(0, game.context_height*0.52,game.context_width,game.context_height*0.04,'#D3F4F3');
            game.context.font = "10px Arial";
            game.context.fillStyle = "#685545";
            game.context.fillText(code, game.context_width*0.5, game.context_height*0.54);
            //game.context.fillText("Or write to us at query@tinyowl.co.in to know more", game.context_width*0.5, game.context_height*0.56);
          }
        }
      };
      var scoreValue = game.getScoreValue(discount);
      var url = "http://0.0.0.0:3000/restaurant/growth_hacks/sankrant_game_coupon?score_value="+scoreValue;
      xhttp.open("GET", url, true);
      xhttp.send();

      this.context.beginPath();
      this.context.moveTo(this.context_width*0.15,this.context_height*0.62);
      this.context.lineTo(this.context_width*0.85,this.context_height*0.62);
      this.context.lineWidth = 0.3;
      this.context.strokeStyle = '#685545';
      this.context.stroke();

      this.context.fillStyle = "#685545";
      this.context.font = "11px Arial";

      this.context.fillText("Get extra 15% cashback when you", this.context_width*0.5, this.context_height*0.67);
      this.context.fillText("pay through MobiKwik", this.context_width*0.5, this.context_height*0.70);
    }

    // Adding listner on Play button
    window.addEventListener("mousedown", this.onPlayAgainClick, false);

    // Making play button
    var replayImg = document.getElementById('replay-img');
    this.context.drawImage(replayImg, this.context_width*0.4, this.context_height*0.84,this.context_width*0.2,this.context_width*0.2*replayImg.height/replayImg.width);
  }

  this.onPlayAgainClick = function(event) {
    x = event.pageX;
    y = event.pageY;
    if ( x >= game.context_width*0.4 && x <= game.context_width*0.6 && y >= game.context_height*0.8 && y <= game.context_height*0.8 + game.context_width*0.3) {
       window.removeEventListener("mousedown", game.onPlayAgainClick, false);
       game = new Game(ctx, question);
       game.init();
    }
  }

  // JS excryptor function
  // discount = 5,10,20

  this.getScoreValue = function (discount) {
    var ts = Math.round((new Date()).getTime() / 1000)*2;
    var d = discount.toString();
    var calculated_discount;
      if (d.length == 1) {
        calculated_discount = d + ts;
      }
      else {
        calculated_discount = d[0] + ts + d[1];
      }
    return calculated_discount;
  }
}
