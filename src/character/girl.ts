import Phaser from 'phaser'

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UPRIGHT,
  UPLEFT,
  DOWNRIGHT,
  DOWNLEFT
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3)
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3)
  }
  return newDirection
}

export default class Girl extends Phaser.Physics.Arcade.Sprite {
  
  private direction = Direction.RIGHT

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string | number) {
    super(scene, x, y, texture, frame)

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollison, this)

    scene.time.addEvent({
      delay: 4000,
      callback: () => {
        this.direction = Phaser.Math.Between(0, 3)
      },
      loop: true
    })
  }

  private handleTileCollison(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    if (go !== this)
    {
      return
    }

    this.direction = randomDirection(this.direction)
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    const speed = 50;
    let charVelocity = new Phaser.Math.Vector2();
    
    if (this.direction === 2) {
      
      this.play(`${this.texture.key}-run-left`, true)
      charVelocity.x -= 1;

    } else if (this.direction === 3) {
      
      this.play(`${this.texture.key}-run-right`, true)
      charVelocity.x += 1;

    } else if (this.direction === 0) {
      
      this.play(`${this.texture.key}-run-up`, true)
      charVelocity.y -= 1;
      
    } else if (this.direction === 1) {
      
      this.play(`${this.texture.key}-run-down`, true)
      charVelocity.y += 1;

    } 

    charVelocity.scale(speed);
    this.setVelocity(charVelocity.x, charVelocity.y);

  }
}
