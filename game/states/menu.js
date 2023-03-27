
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0,0, 'background');
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
    this.ground.autoScroll(-200,0);

    //create a group to put the title assets in so they can be manipulated as a whole
    this.titleGroup = this.game.add.group();

    //create the title sprite and add to group
    this.title = this.game.add.sprite(0,0,'title');
    this.titleGroup.add(this.title);

    //create the bird sprite
    this.bird = this.game.add.sprite(this.game.width/2,-50,'bird');
    this.titleGroup.add(this.bird);

    //add animation to bird, begin animation
    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 12, true);

    //set the location of the group
    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
    

    this.selectSound = this.game.add.audio('select');
    //add our star button with a callback 
    this.startButton = this.game.add.button(this.game.width/2, 320, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);

    this.music = this.game.add.audio('gamemusic');
    this.music.override = true;
    this.music.play('',0,1,true);
  },

	startClick: function() {
    this.selectSound.play();
		this.game.state.start('play');
	},
  update: function() {
    
  }
};

module.exports = Menu;
