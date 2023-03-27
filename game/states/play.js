
  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var Pipe = require('../prefabs/pipe')
  var PipeGroup = require('../prefabs/pipeGroup');
  var Scoreboard = require('../prefabs/Scoreboard');
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 1200;

      this.background = this.game.add.sprite(0,0,'background');

      

      this.pipes = this.game.add.group();

      this.bird = new Bird(this.game, 100, this.game.height/2);

      this.game.add.existing(this.bird);

      this.ground = new Ground(this.game, 0, 400, 335, 112);
      this.game.add.existing(this.ground);

      //keep the spacebar from propogating up to the browser
      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

      //add keyboard controls
      this.flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.flapKey.onDown.addOnce(this.startGame, this);
      this.flapKey.onDown.add(this.bird.flap, this.bird);

      //add mouse/touch controls
      this.input.onDown.addOnce(this.startGame, this);
      this.input.onDown.add(this.bird.flap, this.bird);

      this.started = false;

      // add a timer
      //this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
      //       this.pipeGenerator.timer.start();

      this.instructionsGroup = this.game.add.group();
      this.instructionsGroup.add(this.game.add.sprite(this.game.width/2, 100, 'getReady'));
      this.instructionsGroup.add(this.game.add.sprite(this.game.width/2, 325, 'instructions'));
      this.instructionsGroup.setAll('anchor.x', 0.5);
      this.instructionsGroup.setAll('anchor.y', 0.5);

      this.score = 0;
      this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(), 24);
      this.scoreText.visible = false;

      this.gameover = false;

      this.scoreSound = this.game.add.audio('score');
      this.pipeSound = this.game.add.audio('pipeHit');
      this.groundSound = this.game.add.audio('groundHit');

    },
    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
      if (this.bird.alive) {
      this.pipes.forEach(function(pipeGroup) {
        this.checkScore(pipeGroup);
        this.game.physics.arcade.overlap(this.bird, pipeGroup, this.deathHandler, null, this)
      }, this);}
    },
    generatePipes: function() {
      //console.log('Generating pipes!');
      var pipeY = this.game.rnd.integerInRange(-100, 100);
      var pipeGroup = this.pipes.getFirstExists(false);
      if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);
      }
      pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY)
    },
    clickListener: function() {
      
    },
    deathHandler: function(bird, enemy) {
      if (enemy instanceof Ground && !this.bird.onGround) {
        this.groundSound.play();
        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.bird.onGround = true;
      }
      else if (enemy instanceof Pipe) {
        this.pipeSound.play();
      }
      if (!this.gameover) {
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
      }
    },
    shutdown: function() {
      this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
      this.bird.destroy();
      this.pipes.destroy();
      this.scoreboard.destroy();
    }, 
    startGame: function() {
      if (!this.started) {
        this.bird.body.allowGravity = true;
        this.bird.alive = true;
        this.scoreText.visible = true;
        this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
        this.pipeGenerator.timer.start();

        this.instructionsGroup.destroy();
        this.started = true;
      }
    }, 
    checkScore: function(pipeGroup) {
      if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
        pipeGroup.hasScored = true;
        this.score++;
        this.scoreText.setText(this.score.toString());
        this.scoreSound.play();
      } 
    }
  };
  
  module.exports = Play;