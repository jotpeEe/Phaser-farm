import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';
import '../character/farmer';
import Girl from '../character/girl';

export default class Market extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer: Phaser.Physics.Arcade.Sprite
  private activeTile: Phaser.Physics.Arcade.Sprite
  private shopDoors: Phaser.Physics.Arcade.Sprite

  constructor() {
    super('market');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  private handlePortal = (
    player: Phaser.Physics.Arcade.Sprite,
    tile: any,
  ) => {
    if (tile === this.shopDoors) {
      this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, this.farmer.y));
      this.scene.start('shop');
    } else {
      this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, 1100));
      this.scene.start('game');
    }
  }

  private handleOverlap = (
    player: Phaser.Physics.Arcade.Sprite,
    body: Phaser.Physics.Arcade.Sprite,
  ) => {
    if (this.activeTile) {
      return;
    }

    this.activeTile = body;
    this.activeTile.setTint(0x00FFFF);
  }

  private updateActiveTile = () => {
    if (!this.activeTile) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.farmer.x, this.farmer.y, this.activeTile.x, this.activeTile.y,
    );

    if (distance < 32) {
      return;
    }

    this.activeTile.clearTint();
    this.activeTile = undefined;
  }

  create() {
    createAnimation(this.anims, 'farmer', 15);
    createAnimation(this.anims, 'girl', 5);
    createAnimation(this.anims, 'girl2', 5);
    createAnimation(this.anims, 'girl3', 5);

    const map = this.make.tilemap({ key: 'market' });
    const tileset = map.addTilesetImage('market', 'tiles');

    const portals = map.createLayer('portals', tileset);
    const boundries = map.createLayer('collision', tileset);
    const bottomLayer = map.createLayer('bottom', tileset);
    const midLayer = map.createLayer('mid', tileset);
    const topLayer = map.createLayer('top', tileset);
    const midCharLayer = map.createLayer('mid-for-char', tileset);

    midLayer.setDepth(10);
    topLayer.setDepth(10);

    if (this.registry.values.farmerPosition !== undefined) {
      this.farmer = this.add.farmer(this.registry.values.farmerPosition.x, 32, 'farmer');
    } else {
      this.farmer = this.add.farmer(780, 32, 'farmer');
    }

    this.shopDoors = this.physics.add.sprite(560, 144, 'door');
    this.shopDoors.setDepth(-1);

    const townPeople = this.physics.add.group({
      classType: Girl,
      createCallback: (go) => {
        const girlGo = go as Girl;
        girlGo.body.onCollide = true;
      },
    });

    townPeople.get(780, 350, 'girl');
    townPeople.get(850, 850, 'girl2');
    townPeople.get(550, 650, 'girl3');
    townPeople.get(250, 450, 'girl3');
    townPeople.get(250, 850, 'girl');
    townPeople.get(450, 250, 'girl2');

    portals.setCollisionByProperty({ collides: true });
    midCharLayer.setCollisionByProperty({ collides: true });
    bottomLayer.setCollisionByProperty({ collides: true });
    midLayer.setCollisionByProperty({ collides: true });
    topLayer.setCollisionByProperty({ collides: true });
    boundries.setCollisionByProperty({ collides: true });

    this.physics.add.overlap(this.farmer, this.shopDoors, this.handlePortal);
    this.physics.add.overlap(this.farmer, townPeople, this.handleOverlap);
    this.physics.add.collider(this.farmer, portals, this.handlePortal);
    this.physics.add.collider(this.farmer, bottomLayer);
    this.physics.add.collider(this.farmer, midLayer);
    this.physics.add.collider(this.farmer, midCharLayer);
    this.physics.add.collider(townPeople, boundries);
    this.physics.add.collider(townPeople, midCharLayer);

    this.cameras.main.startFollow(this.farmer, true);
  }

  update() {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
    this.updateActiveTile();
  }
}
