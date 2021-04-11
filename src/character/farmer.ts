import Phaser from 'phaser'

declare global
{ 
  namespace Phaser.GameObjects
  {
    interface GameObjectFactory
    {
      farmer(x: number, y: number, texture: string, frame?: string | number): Farmer
    }
  }
}

export default class Farmer extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.anims.play('farmer-idle-down')
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    
    if (!cursors) {
      return
    }

    const speed = 150;
    let charVelocity = new Phaser.Math.Vector2();

    if (cursors.left?.isDown) {

      this.play('farmer-run-left', true)
      charVelocity.x -= 1;

    } else if (cursors.right?.isDown) {

      this.play('farmer-run-right', true)
      charVelocity.x += 1;
    } 
    
    if (cursors.up?.isDown) {
      
      this.play('farmer-run-up', true)
      charVelocity.y -= 1;
      
    } else if (cursors.down?.isDown) {
      
      this.play('farmer-run-down', true)
      charVelocity.y += 1;

    }

    if (charVelocity.x === 0 && charVelocity.y === 0 ) {

      const parts = this.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.play(parts.join('-'))
      this.setVelocity(0, 0)

    } else {
      charVelocity.normalize();
      charVelocity.scale(speed);
      this.setVelocity(charVelocity.x, charVelocity.y);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('farmer', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame: string | number) {
  var sprite = new Farmer(this.scene, x, y, texture, frame);
  this.displayList.add(sprite)
  this.updateList.add(sprite)

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
  sprite.body.setSize(sprite.width * 0.4, sprite.height * 0.4)
  sprite.body.offset.y = 18
  sprite.scale = 1.3

  return sprite;
})
