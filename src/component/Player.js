import Entity from './Entity';
import PlayerLaser from './PlayerLaser';

export default class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'Player');
    this.setData({
      'speed': 200,
      'isShooting': false,
      'timerShootDelay': 15
    });
    this.setData('timerShootTick', (this.getData('timerShootDelay') - 1));
    // console.log("Player Created: " + this.getData('timerShootTick'));
  }

  moveRight(){
    this.body.setVelocityX(this.getData('speed'));
  }

  moveLeft(){
    this.body.setVelocityX(-this.getData('speed'));
  }

  moveUp(){
    this.body.setVelocityY(-this.getData('speed'));
  }

  moveDown(){
    this.body.setVelocityY(this.getData('speed'));
  }

  onDestroy(){
    this.scene.time.addEvent({ // go to game over scene
      delay: 1000,
      callback: () => {
        this.scene.scene.start("SceneGameOver");
      },
      loop: false
    });
  }

  update(){
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(
      this.x,
      0 + (this.displayWidth/2),
      window.global.width - (this.displayWidth/2)
    );
    // this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    if (this.getData("isShooting") && !this.isDead()) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
        this.setData("timerShootTick", this.getData("timerShootTick") + 1);
      }
      else { // when the "manual timer" is triggered:
        let laser = new PlayerLaser(this.scene, this.x, this.y);
        let sfxType = 0; //Phaser.Math.Between(0, 1);
        this.scene.playerLasers.add(laser);
        this.scene.sfx.laser[sfxType].play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
      }
    } // End of isShooting

    for (let i = 0; i < this.scene.playerLasers.getChildren().length; i++) {
      let laser = this.scene.playerLasers.getChildren()[i];
      if (laser.y < 0){
        this.scene.playerLasers.remove(laser);
        laser.destroy();
      }
    } // End of looping playerLasers group
  } // End of update
}
