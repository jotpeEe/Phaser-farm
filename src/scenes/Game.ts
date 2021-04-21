import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';

import '../character/farmer';

export default class Game extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer: Phaser.Physics.Arcade.Sprite
  private activeFarm: Phaser.Physics.Arcade.Sprite
  private boxGroup: Phaser.Physics.Arcade.StaticGroup

  constructor() {
    super('game');
  }

  private handlePortals = () => {
    this.scene.start('market');
  }

  private handleOverlap = (player: Phaser.Physics.Arcade.Sprite, body: any) => {
    if (this.activeFarm) {
      return;
    }
    this.activeFarm = body;

    this.activeFarm.setTint(0xD8D8D8);
  }

   private updateActiveTile = () => {
     if (!this.activeFarm) {
       return;
     }

     const distance = Phaser.Math.Distance.Between(
       this.farmer.x, this.farmer.y, this.activeFarm.x, this.activeFarm.y - 16,
     );

     if (distance < 16) {
       return;
     }

     this.activeFarm.clearTint();
     this.activeFarm = undefined;
   }

   private createBoxes(x: number, y: number, rowes: number, columns: number) {
     const tempX = x;
     for (let row = 0; row < rowes; ++row) {
       for (let col = 0; col < columns; ++col) {
         this.boxGroup.get(x, y, 'ground');
         if (col === columns - 1) {
           x = tempX;
         } else {
           x += 32;
         }
       }
       y += 32;
     }
   }

   preload() {
     this.cursors = this.input.keyboard.createCursorKeys();
   }

   create() {
     createAnimation(this.anims, 'farmer', 15);

     const map = this.make.tilemap({ key: 'farm' });
     const tileset = map.addTilesetImage('farm', 'tiles');

     const portals = map.createLayer('portals', tileset);
     const bottomLayer = map.createLayer('bottom', tileset);
     const midLayer = map.createLayer('mid', tileset);
     const topLayer = map.createLayer('top', tileset);
     const midCharLayer = map.createLayer('mid-for-char', tileset);

     midLayer.setDepth(10);
     topLayer.setDepth(10);

     this.boxGroup = this.physics.add.staticGroup();
     this.createBoxes(976, 464, 17, 7);
     this.createBoxes(48, 144, 3, 11);
     this.createBoxes(400, 208, 1, 1);
     this.createBoxes(368, 464, 8, 12);
     this.farmer = this.add.farmer(780, 1100, 'farmer');

     portals.setCollisionByProperty({ collides: true });
     midCharLayer.setCollisionByProperty({ collides: true });
     bottomLayer.setCollisionByProperty({ collides: true });

     this.physics.add.overlap(this.farmer, this.boxGroup, this.handleOverlap);
     this.physics.add.collider(this.farmer, portals, this.handlePortals, undefined, this);
     this.physics.add.collider(this.farmer, bottomLayer);
     this.physics.add.collider(this.farmer, midCharLayer);

     this.cameras.main.startFollow(this.farmer, true);
   }

   update() {
     if (this.farmer) {
       this.farmer.update(this.cursors);
     }

     this.updateActiveTile();
   }
}
