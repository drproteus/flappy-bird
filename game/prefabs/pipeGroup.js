'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  // initialize your prefab here
  this.topPipe = new Pipe(this.game, 0, 0, 0);
  this.add(this.topPipe);
  // y = pipe.height + (bird.height * 5) = 440
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.bottomPipe);

  this.width = this.topPipe.width;
  
  this.hasScored = false;
  
  this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  
  // write your prefab's specific update code here
  this.checkWorldBounds();
};

PipeGroup.prototype.checkWorldBounds = function() {
    if(!this.topPipe.inWorld) {
        this.exists = false;
    }
};

PipeGroup.prototype.reset = function(x, y) {
    this.topPipe.reset(0,0);
    this.bottomPipe.reset(0,440);
    this.x = x;
    this.y = y;

    this.setAll('body.velocity.x', -200);
    this.hasScored = false;

    this.exists = true;
};

PipeGroup.prototype.stop = function() {
  this.setAll('body.velocity.x', 0);
}

module.exports = PipeGroup;
