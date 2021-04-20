import Phaser from 'phaser'

import { createFarmerAnimation } from '../anims/Farmer';

import '../character/farmer'
export default class Game extends Phaser.Scene {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */ 
  private cursors

  /** @type {Phaser.Physics.Arcade.Sprite} */
  private farmer
  private activeFarm

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  private boxGroup

	constructor() {
		super('game')
	}

	preload() {
      this.cursors = this.input.keyboard.createCursorKeys()
  }

  private handlePortals = () => {
    this.scene.start('market')
    this.scene.stop();
  }
  
  private handleOverlap = (player, body) => {
    if (this.activeFarm) {
      return
    }
    this.activeFarm = body
    this.activeFarm.setTint(0xD8D8D8)
  }

   private updateActiveTile = () => {
    if (!this.activeFarm) {
      return
    }

    const distance = Phaser.Math.Distance.Between(
      this.farmer.x, this.farmer.y, this.activeFarm.x, this.activeFarm.y - 16
    )

    if (distance < 16) {
      return
    }

    this.activeFarm.clearTint();
    this.activeFarm = undefined
  }

  create() {
    /** Loading all possible animations for character, we will use (farmer) */
    createFarmerAnimation(this.anims)

    const map = this.make.tilemap({ key: 'farm' })
    const tileset = map.addTilesetImage('farm', 'tiles')
    
    const portals = map.createLayer('portals', tileset)
    const bottomLayer = map.createLayer('bottom', tileset)
    const midLayer = map.createLayer('mid', tileset)
    const topLayer = map.createLayer('top', tileset)
    const midCharLayer = map.createLayer('mid-for-char', tileset)

    midLayer.setDepth(10);
    topLayer.setDepth(10);

    this.boxGroup = this.physics.add.staticGroup()
    this.createBoxes(976, 464, 17, 7);
    this.farmer = this.add.farmer(780, 1100, 'farmer')

    portals.setCollisionByProperty({ collides: true })
    midCharLayer.setCollisionByProperty({ collides: true })
    bottomLayer.setCollisionByProperty({ collides: true })

    this.physics.add.overlap(this.farmer, this.boxGroup, this.handleOverlap)
    this.physics.add.collider(this.farmer, portals, this.handlePortals, undefined, this)
    this.physics.add.collider(this.farmer, bottomLayer)
    this.physics.add.collider(this.farmer, midCharLayer)

    this.cameras.main.startFollow(this.farmer, true)
  }

  createBoxes(x: number, y: number, rowes: number, columns: number) {
    const tempX = x;
    for(let row = 0; row < rowes; ++row) {
      for(let col = 0; col < columns; ++col) {
        this.boxGroup.get(x, y, 'ground')
        if (col === columns - 1) {
          x = tempX          
        } else {
          x += 32
        }
      }
      y += 32;
    }
  }

  update(t: number, dt: number) {
    
    if (this.farmer) {
      this.farmer.update(this.cursors)
    }

    this.updateActiveTile()
  }
}
