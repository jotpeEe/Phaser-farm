import Phaser from 'phaser'

enum Direction {
  up,
  down,
  left,
  right,
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3)
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3)
  }
  return newDirection
}

export default class Girl extends Phaser.Physics.Arcade.Sprite {
  
  private direction = Direction.right

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

  private moveLeft = (charVelocity: Phaser.Math.Vector2) => {
    this.play(`${this.texture.key}-run-${Direction[this.direction]}`, true)
    charVelocity.x -= 1
  }

  private moveRight = (charVelocity: Phaser.Math.Vector2) => {
    this.play(`${this.texture.key}-run-${Direction[this.direction]}`, true)
    charVelocity.x += 1
  }

  private moveDown = (charVelocity: Phaser.Math.Vector2) => {
    this.play(`${this.texture.key}-run-${Direction[this.direction]}`, true)
    charVelocity.y += 1
  }

  private moveUp = (charVelocity: Phaser.Math.Vector2) => {
    this.play(`${this.texture.key}-run-${Direction[this.direction]}`, true)
    charVelocity.y -= 1
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    const speed = 50;
    let girlVelocity = new Phaser.Math.Vector2()
    
    const move = {
      0: () => this.moveUp(girlVelocity),
      1: () => this.moveDown(girlVelocity),
      2: () => this.moveLeft(girlVelocity),
      3: () => this.moveRight(girlVelocity),
    }[this.direction];
    move?.();
    
    girlVelocity.scale(speed);
    this.setVelocity(girlVelocity.x, girlVelocity.y);

  }
}
