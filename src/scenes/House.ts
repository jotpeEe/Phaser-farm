import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';

export default class House extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  farmer: Phaser.Physics.Arcade.Sprite
  bed: Phaser.Physics.Arcade.Sprite
  door: Phaser.Physics.Arcade.Sprite

  constructor() {
    super('house');
  }

  private handleDoor = () => {
    this.registry.set('farmerPosition', new Phaser.Math.Vector2(622, 111));
    this.scene.start('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createAnimation(this.anims, 'farmer', 15);

    const map = this.make.tilemap({ key: 'house' });
    const tileset = map.addTilesetImage('house', 'tilesHouse');

    const bottomLayer = map.createLayer('bottom', tileset);
    const midLayer = map.createLayer('mid', tileset);
    map.createLayer('top', tileset);

    midLayer.setCollisionByProperty({ collides: true });
    bottomLayer.setCollisionByProperty({ collides: true });

    this.farmer = this.add.farmer(208, 330, 'farmer');
    this.bed = this.physics.add.sprite(272, 144, 'floor');
    this.bed.setDepth(-1);
    this.bed.body.offset.y = 10;

    this.door = this.physics.add.sprite(208, 336, 'floor');
    this.door.setDepth(-1);
    this.door.body.offset.y = 32;

    this.physics.add.collider(this.farmer, bottomLayer);
    this.physics.add.collider(this.farmer, midLayer);
    this.physics.add.collider(this.farmer, this.door, this.handleDoor);
    this.physics.add.collider(this.farmer, this.bed);

    this.cameras.main.startFollow(this.farmer, true);
  }

  update() {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
  }
}
