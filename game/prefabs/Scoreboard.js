'use strict';

var Scoreboard = function(game) {
  var gameover;

  Phaser.Group.call(this, game);
  gameover = this.create(this.game.width/2, 100, 'gameover');
  gameover.anchor.setTo(0.5, 0.5);

  this.scoreboard = this.create(this.game.width/2, 200, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);

  this.scoreText = this.game.add.bitmapText(this.scoreboard.width-32, 180, 'flappyfont', '', 18);
  this.add(this.scoreText);

  this.bestScoreText = this.game.add.bitmapText(this.scoreboard.width-32, 230, 'flappyfont', '', 18);
  this.add(this.bestScoreText);


  this.selectSound = this.game.add.audio('select');
  //add our startbutton with a callback
  this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5, 0.5);

  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;
  // initialize your prefab here
  
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Scoreboard.prototype.show = function(score) {
    var medal, bestScore;

    //step 1
    this.scoreText.setText(score.toString());

    if(!!localStorage) {
        //step 2
        bestScore = localStorage.getItem('bestScore');

        if (!bestScore || bestScore < score) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
    } else {
        //fallback, localStorage isn't available
        bestScore = 'N/A';
    }

    //step 4
    this.bestScoreText.setText(bestScore.toString());

    //steps 5 &6
    if(score >= 10 && score < 20) {
        medal = this.game.add.sprite(-65, 7, 'medals', 1);
        medal.anchor.setTo(0.5, 0.5);
        this.scoreboard.addChild(medal);
    } else if(score >= 20) {
        medal = this.game.add.sprite(-65, 7, 'medals', 0);
        medal.anchor.setTo(0.5, 0.5);
        this.scoreboard.addChild(medal);
    }
    //step 7
    /*if (medal) {
        medal.anchor.setTo(0.5, 0.5);
        this.scoreboard.addChild(medal);

        var emitter = this.game.add.emitter(medal.x, medal.y, 400);
        this.scoreboard.addChild(emitter);
        emitter.width = medal.width;
        emitter.height = medal.height;

        emitter.makeParticles('particle');

        emitter.setRotation(-100, 100);
        emitter.setXSpeed(0,0);
        emitter.setYSpeed(0,0);
        emitter.minParticleScale = 0.25;
        emitter.maxParticleScale = 0.5;
        emitter.setAll('body.allowGravity', false);

        emitter.start(false, 1000, 1000);
        console.log('emitter start');
    }*/
    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
};

Scoreboard.prototype.startClick = function() {
    this.selectSound.play();
    this.game.state.start('play');
}

module.exports = Scoreboard;
