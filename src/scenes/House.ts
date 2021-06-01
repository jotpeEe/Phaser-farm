import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';

interface ILayers {
  bottomLayer: Phaser.Tilemaps.TilemapLayer,
  midLayer: Phaser.Tilemaps.TilemapLayer,
}
export default class House extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  farmer: Phaser.Physics.Arcade.Sprite
  bed: Phaser.Physics.Arcade.Sprite
  door: Phaser.Physics.Arcade.Sprite
  mapLayers: ILayers

  constructor() {
    super('house');
  }

  // Called before the Scenes create method, allowing you to preload assets that the Scene may need.
  preload = () => {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // Called at the start of the scene, only once.
  create = () => {
    createAnimation(this.anims, 'farmer', 15);

    this.createMap();
    this.createInteractiveSprites();

    this.addColliders();
    this.cameras.main.startFollow(this.farmer, true);
  }

  // Main loop of the scene.
  update = () => {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
  }

  private handleDoor = () => {
    this.scene.start('game');
  }

  private handleBed = () => {
    this.farmer.setVisible(false);
  }

  private createMap = () => {
    const map = this.make.tilemap({ key: 'house' });
    const tileset = map.addTilesetImage('house', 'tilesHouse');

    const bottomLayer = map.createLayer('bottom', tileset)
      .setCollisionByProperty({ collides: true });
    const midLayer = map.createLayer('mid', tileset)
      .setCollisionByProperty({ collides: true });
    map.createLayer('top', tileset);

    this.mapLayers = {
      bottomLayer,
      midLayer,
    };
  }

  private createInteractiveSprites = () => {
    this.farmer = this.add.farmer(208, 330, 'farmer');
    this.bed = this.physics.add.sprite(272, 144, 'floor');
    this.bed.setDepth(-1);
    this.bed.body.offset.y = 10;

    this.door = this.physics.add.sprite(208, 336, 'floor');
    this.door.setDepth(-1);
    this.door.body.offset.y = 32;
  }

  private addColliders = () => {
    this.physics.add.collider(this.farmer, this.mapLayers.bottomLayer);
    this.physics.add.collider(this.farmer, this.mapLayers.midLayer);
    this.physics.add.collider(this.farmer, this.door, this.handleDoor);
    this.physics.add.overlap(this.farmer, this.bed, this.handleBed);
  }
}
