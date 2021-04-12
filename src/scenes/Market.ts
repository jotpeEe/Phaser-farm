import Phaser from 'phaser'

import { createFarmerAnimation } from '../anims/Farmer'
import { createGirlAnimation } from '../anims/girl'
import '../character/farmer'
import Girl from '../character/girl'
export default class Market extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer!: Phaser.Physics.Arcade.Sprite
  
  constructor() {
    super('market')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    createFarmerAnimation(this.anims)
    createGirlAnimation(this.anims)

    const map = this.make.tilemap({ key: 'market' })
    const tileset = map.addTilesetImage('market', 'tiles')

    const waypoints = map.createLayer('collision', tileset)
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
    
    midCharLayer.setCollisionByProperty({ collides: true })
    bottomLayer.setCollisionByProperty({ collides: true })
    midLayer.setCollisionByProperty({ collides: true })
    topLayer.setCollisionByProperty({ collides: true })
    waypoints.setCollisionByProperty({ collides: true })

    this.physics.add.collider(this.farmer, bottomLayer)
    this.physics.add.collider(this.farmer, topLayer)
    this.physics.add.collider(this.farmer, midLayer)
    this.physics.add.collider(this.farmer, midCharLayer)
    this.physics.add.collider(town_people, waypoints)
    this.physics.add.collider(town_people, midCharLayer)

    this.cameras.main.startFollow(this.farmer, true)
  }
  
  update(t: number, dt: number) {
    if (this.farmer) {
      this.farmer.update(this.cursors)
    }
  }
}
