import Phaser from 'phaser';

import tiles from '../assets/tiles/farm.png';
import tilesHouse from '../assets/tiles/house.png';
import floor from '../assets/floor.png';
import door from '../assets/door.png';
import bubble from '../assets/bubble.png';
import ground from '../assets/ground.png';
import plant1 from '../assets/plant/grassVerySmall.png';
import plant2 from '../assets/plant/grassSmall.png';
import plant3 from '../assets/plant/grassMedium.png';
import plant4 from '../assets/plant/grassLarge.png';
import plant5 from '../assets/plant/grassVeryLarge.png';
import plant6 from '../assets/plant/grassExpire1.png';
import plant7 from '../assets/plant/grassExpire2.png';
import plant8 from '../assets/plant/grassExpire3.png';
import farmer from '../assets/characters/farmer.png';
import girl from '../assets/characters/girl.png';
import girl2 from '../assets/characters/girl2.png';
import girl3 from '../assets/characters/girl3.png';

import farmerDate from '../assets/characters/farmer.json';
import girlData from '../assets/characters/girl.json';
import girl2Data from '../assets/characters/girl2.json';
import girl3Data from '../assets/characters/girl3.json';
import farmData from '../assets/tiles/farm.json';
import marketData from '../assets/tiles/market.json';
import houseData from '../assets/tiles/house.json';
import shopData from '../assets/tiles/shop.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload = () => {
    this.load.image('tiles', tiles);
    this.load.image('tilesHouse', tilesHouse);
    this.load.image('floor', floor);
    this.load.image('door', door);
    this.load.image('bubble', bubble);
    this.load.image('ground', ground);
    this.load.image('plantVerySmall', plant1);
    this.load.image('plantSmall', plant2);
    this.load.image('plantMedium', plant3);
    this.load.image('plantLarge', plant4);
    this.load.image('plantVeryLarge', plant5);
    this.load.image('plantExpire1', plant6);
    this.load.image('plantExpire2', plant7);
    this.load.image('plantExpire3', plant8);

    this.load.tilemapTiledJSON('farm', farmData);
    this.load.tilemapTiledJSON('market', marketData);
    this.load.tilemapTiledJSON('house', houseData);
    this.load.tilemapTiledJSON('shop', shopData);

    this.load.atlas('farmer', farmer, farmerDate);
    this.load.atlas('girl', girl, girlData);
    this.load.atlas('girl2', girl2, girl2Data);
    this.load.atlas('girl3', girl3, girl3Data);
  }

  create = () => {
    this.scene.start('game');
  }
}
