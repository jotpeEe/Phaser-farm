import Phaser from 'phaser'

import { createFarmerAnimation } from '../anims/Farmer'
import { createGirlAnimation } from '../anims/girl'
import '../character/farmer'
import Girl from '../character/girl'
export default class Market extends Phaser.Scene {
  /** @types {Phaser.Types.Input.Keyboard.CursorKeys} */ 
  private cursors
  /** @types {Phaser.Physics.Arcade.Sprite} */
  private farmer
  private activeTile
  
  constructor() {
    super('market')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  private handlePortal = (player, tile) => {
    if (tile.index < 100) {
      this.scene.start('game')
    }
  }

  private handleOverlap = (player, body) => {
    if (this.activeTile) {
      return
    }

    this.activeTile = body;
    this.activeTile.setTint(0x00FFFF)
  }

  private updateActiveTile = () => {
    if (!this.activeTile) {
      return
    }

    const distance = Phaser.Math.Distance.Between(
      this.farmer.x, this.farmer.y, this.activeTile.x, this.activeTile.y
    )

    if (distance < 32) {
      return
    }

    this.activeTile.clearTint()
    this.activeTile = undefined
  }

  create() {
    createFarmerAnimation(this.anims)
    createGirlAnimation(this.anims)

    const map = this.make.tilemap({ key: 'market' })
    const tileset = map.addTilesetImage('market', 'tiles')

    const portals = map.createLayer('portals', tileset)
    const boundries = map.createLayer('collision', tileset)
    const bottomLayer = map.createLayer('bottom', tileset)
    const midLayer = map.createLayer('mid', tileset)
    const topLayer = map.createLayer('top', tileset)
    const midCharLayer = map.createLayer('mid-for-char', tileset)
  
    midLayer.setDepth(10);
    topLayer.setDepth(10);

    this.farmer = this.add.farmer(780, 150, 'farmer')
    
    const town_people = this.physics.add.group({
      classType: Girl,
      createCallback: (go) => {
        const girlGo = go as Girl
        girlGo.body.onCollide = true
      }
    })

    town_people.get(780, 350, 'girl')
    town_people.get(850, 850, 'girl')
    town_people.get(550, 650, 'girl')
    town_people.get(250, 450, 'girl')
    town_people.get(250, 850, 'girl')
    town_people.get(450, 250, 'girl')

    portals.setCollisionByProperty({ collides: true })
    midCharLayer.setCollisionByProperty({ collides: true })
    bottomLayer.setCollisionByProperty({ collides: true })
    midLayer.setCollisionByProperty({ collides: true })
    topLayer.setCollisionByProperty({ collides: true })
    boundries.setCollisionByProperty({ collides: true })

    this.physics.add.overlap(this.farmer, town_people, this.handleOverlap)
    this.physics.add.collider(this.farmer, portals, this.handlePortal)
    this.physics.add.collider(this.farmer, bottomLayer)
    this.physics.add.collider(this.farmer, midLayer)
    this.physics.add.collider(this.farmer, midCharLayer)
    this.physics.add.collider(town_people, boundries)
    this.physics.add.collider(town_people, midCharLayer)

    this.cameras.main.startFollow(this.farmer, true)
  }
  
  update(t: number, dt: number) {
    if (this.farmer) {
      this.farmer.update(this.cursors)
    }
    this.updateActiveTile()
  }
}
