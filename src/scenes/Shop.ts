import Phaser from 'phaser';
import createAnimation from '../utils/createAnimation';
import Girl from '../character/girl';

export default class Shop extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  farmer: Phaser.Physics.Arcade.Sprite
  activeTouch: Phaser.Physics.Arcade.Sprite
  shopDoor: Phaser.Physics.Arcade.Sprite
  clicked: boolean

  constructor() {
    super('shop');
    this.clicked = false;
  }

  private handleDoor = () => {
    this.scene.start('market');
  }

  private handleTouch = (
    player: Phaser.Physics.Arcade.Sprite,
    shopper: Phaser.Physics.Arcade.Sprite,
  ) => {
    if (this.activeTouch) {
      return;
    }

    this.activeTouch = shopper;
    this.activeTouch.setTint(0x00FFFF);
    //  this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, this.farmer.y));
  }

  private updateActiveTile = () => {
    if (!this.activeTouch) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.farmer.x, this.farmer.y, this.activeTouch.x, this.activeTouch.y,
    );

    if (distance < 96) {
      return;
    }

    this.activeTouch.clearTint();
    this.activeTouch = undefined;
    this.clicked = false;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createAnimation(this.anims, 'farmer', 15);
    createAnimation(this.anims, 'girl', 5);

    const map = this.make.tilemap({ key: 'shop' });
    const tileset = map.addTilesetImage('house', 'tilesHouse');

    const bottomLayer = map.createLayer('bottom', tileset);
    const midLayer = map.createLayer('mid', tileset);
    const midCharLayer = map.createLayer('mid-for-char', tileset);
    const waypoints = map.createLayer('waypoints', tileset);
    map.createLayer('top', tileset);

    midCharLayer.setCollisionByProperty({ collides: true });
    midLayer.setCollisionByProperty({ collides: true });
    bottomLayer.setCollisionByProperty({ collides: true });
    waypoints.setCollisionByProperty({ collides: true });

    midLayer.setDepth(10);
    const merchant = this.physics.add.group({
      classType: Girl,
      createCallback: (go) => {
        const girlGo = go as Girl;
        girlGo.body.onCollide = true;
      },
    });

    const shopper = merchant.get(110, 298, 'girl');
    shopper.setDepth(1);
    shopper.body.setSize(160, 160);
    this.farmer = this.add.farmer(240, 394, 'farmer');
    this.shopDoor = this.physics.add.sprite(240, 400, 'floor');
    this.shopDoor.setDepth(-1);
    this.shopDoor.body.offset.y = 32;

    this.physics.add.collider(shopper, waypoints);
    this.physics.add.collider(this.farmer, bottomLayer);
    this.physics.add.collider(this.farmer, midCharLayer);
    this.physics.add.collider(this.farmer, midLayer);
    this.physics.add.overlap(this.farmer, shopper, this.handleTouch);
    this.physics.add.collider(this.farmer, this.shopDoor, this.handleDoor);

    this.cameras.main.startFollow(this.farmer, true);
  }

  update() {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
    if (this.activeTouch !== undefined) {
      if (this.cursors.space.isDown && this.clicked === false) {
        this.clicked = true;
      }
    }
    this.updateActiveTile();
  }
}
