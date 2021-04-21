import Phaser from 'phaser';

import tiles from '../assets/tiles/farm.png';
import bubble from '../assets/resources/bubble.png';
import ground from '../assets/resources/ground.png';
import plant1 from '../assets/resources/plant/grassVerySmall.png';
import plant2 from '../assets/resources/plant/grassSmall.png';
import plant3 from '../assets/resources/plant/grassMedium.png';
import plant4 from '../assets/resources/plant/grassLarge.png';
import plant5 from '../assets/resources/plant/grassVeryLarge.png';
import plant6 from '../assets/resources/plant/grassExpire1.png';
import plant7 from '../assets/resources/plant/grassExpire2.png';
import plant8 from '../assets/resources/plant/grassExpire3.png';
import farmer from '../assets/character/farmer.png';
import girl from '../assets/character/girl.png';
import girl2 from '../assets/character/girl2.png';
import girl3 from '../assets/character/girl3.png';

import farmerDate from '../assets/character/farmer.json';
import girlData from '../assets/character/girl.json';
import girl2Data from '../assets/character/girl2.json';
import girl3Data from '../assets/character/girl3.json';
import farmData from '../assets/tiles/farm.json';
import marketData from '../assets/tiles/market.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', tiles);
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

    this.load.atlas('farmer', farmer, farmerDate);
    this.load.atlas('girl', girl, girlData);
    this.load.atlas('girl2', girl2, girl2Data);
    this.load.atlas('girl3', girl3, girl3Data);
  }

  create() {
    this.scene.start('game');
  }
}
