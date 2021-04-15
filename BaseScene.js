class BaseScene extends Phaser.Scene {

        // "global" var for link next idle position;
        // Static vars for char speeds and scores
        static LINK_SPEED = 5;
        static MINION_SPEED = 5;
        static MINION_SCORE = 10;
        static ENEMIES_SPEED = 6;
        static ENEMIES_SCORE = 50;

        static ENEMIES1_SPEED = 7;
        static ENEMIES1_SCORE = 100;

        static CURRENT_SCORE = 0;
        static gamePaused = false;
        static charactersLoaded = false;

        constructor(sceneName) {
            super(sceneName);

            this.sceneName = sceneName;

            this.nextDinkIdle = "link-idle-back";
            console.log("Finish parent constructor for Base Scene.");

        }

        preload(mapKey, mapFile) {
            //loading screen
            this.playLoadingScreen();

            //preload all the tilesets
            this.load.image('dungeon_barrels', 'assets/tilesets/Barrels/Barrels.png');
            this.load.image('dungeon_bookcases', 'assets/tilesets/Bookcases/Bookcases.png');
            this.load.image('dungeon_carpets', 'assets/tilesets/Carpets/Carpets.png');
            this.load.image('dungeon_columns', 'assets/tilesets/Columns/Columns.png');
            this.load.image('dungeon_floors', 'assets/tilesets/Floors/Floors.png');
            this.load.image('dungeon_props', 'assets/tilesets/Props/Props.png');
            this.load.image('dungeon_stairs', 'assets/tilesets/Stairs/Stairs.png');
            this.load.image('dungeon_walls', 'assets/tilesets/Walls/Walls.png');
            //preload the map
            this.load.tilemapTiledJSON(mapKey, mapFile);
            //preload the character spritesheet
            if (!BaseScene.charactersLoaded) {
                this.load.multiatlas('character_sprites', 'assets/spritesheets/characters/Characters.json', 'assets/spritesheets/characters');

                this.load.multiatlas('projectile_sprites', 'assets/spritesheets/projectiles/projectiles.json', 'assets/spritesheets/projectiles');

                BaseScene.charactersLoaded = true;
            }

            //Preload our EVENT sounds
            this.load.audio("audio_fireball", "assets/sounds/bombblow.mp3");
            this.load.audio("audio_explosion", "assets/sounds/explosion.mp3");
            this.load.audio("audio_game_over", "assets/sounds/linkdie.mp3");
        }

        create(mapKey) {
                //create sounds first
                this.fireballSound = this.sound.add("audio_fireball");
                this.explosionSound = this.sound.add("audio_explosion");
                this.gameOverSound = this.sound.add("audio_game_over");

                //create the map
                const map = this.add.tilemap(mapKey);

                //add tilesets to the map - not using columns and stairs at present
                const tileset1 = map.addTilesetImage("Barrels", "dungeon_barrels");
                const tileset2 = map.addTilesetImage("Bookcases", "dungeon_bookcases");
                const tileset3 = map.addTilesetImage("Carpets", "dungeon_carpets");
                const tileset4 = map.addTilesetImage("Floors", "dungeon_floors");
                const tileset5 = map.addTilesetImage("Props", "dungeon_props");
                const tileset6 = map.addTilesetImage("Walls", "dungeon_walls");

                //add the map layers to the scene
                const floorLayer = map.createLayer("Floors", [tileset4], 0, 0);
                const carpetLayer = map.createLayer("Carpets", [tileset3], 0, 0);
                const propLayer = map.createLayer("Props", [tileset5], 0, 0);
                const foundationLayer = map.createLayer("Foundations", [tileset6], 0, 0);
                const barrelLayer = map.createLayer("Barrels", [tileset1], 0, 0);
                const bookcaseLayer = map.createLayer("Bookcases", [tileset2], 0, 0);

                //set the camera's start position so we are in the map - Camera centered on the link
                // this.cameras.main.scrollX = 600;
                // this.cameras.main.scrollY = 600;

                //turn on the cursor keys, so we can pan around the map
                this.cursors = this.input.keyboard.createCursorKeys();
                //add spacebar
                this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

                //Create the link Sprite(Coke) and scale up! Mario Mushroom!
                this.link = this.matter.add.sprite(400, 1300, 'character_sprites', 'dink-back-0.png');
                this.link.setScale(2);
                this.link.setName("dink");
                //StopRotation 
                this.link.setBounce(0.2);
                this.link.setFixedRotation();

                //manually add colision zones for foundations layer

                let matterInstance = this.matter;

                foundationLayer.forEachTile(function(tile) {

                    let tileWorldPos = foundationLayer.tileToWorldXY(tile.x, tile.y);
                    let collisionGroup = tileset6.getTileCollisionGroup(tile.index);

                    if (!collisionGroup || collisionGroup.objects.length === 0) {
                        return;
                    }
                    collisionGroup.objects.forEach(function(collisionItem) {
                        if (collisionItem.rectangle) {
                            let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width / 2;
                            let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height / 2;

                            let tmpSprite = matterInstance.add.sprite(objectX, objectY, "__DEFAULT");
                            //scale sprite and set immovable;
                            tmpSprite.setStatic(true);
                            tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height);

                            //check if the current collision is the escape point for the level.

                            if (collisionItem.properties && collisionItem.properties.length > 0) {
                                tmpSprite.setName(collisionItem.properties[0].name);
                            }
                        } else {
                            console.log("Unsuported collision Item Shape!")
                        }
                    });

                });

                //props

                propLayer.forEachTile(function(tile) {

                    let tileWorldPos = propLayer.tileToWorldXY(tile.x, tile.y);
                    let collisionGroup = tileset5.getTileCollisionGroup(tile.index);

                    if (!collisionGroup || collisionGroup.objects.length === 0) {
                        return;
                    }
                    collisionGroup.objects.forEach(function(collisionItem) {
                        if (collisionItem.rectangle) {
                            let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width / 2;
                            let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height / 2;

                            let tmpSprite = matterInstance.add.sprite(objectX, objectY, "__DEFAULT");
                            //scale sprite and set immovable;
                            tmpSprite.setStatic(true);
                            tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height);
                        } else {
                            console.log("Unsuported collision Item Shape!")
                        }
                    });

                });
                bookcaseLayer.forEachTile(function(tile) {

                    let tileWorldPos = bookcaseLayer.tileToWorldXY(tile.x, tile.y);
                    let collisionGroup = tileset2.getTileCollisionGroup(tile.index);

                    if (!collisionGroup || collisionGroup.objects.length === 0) {
                        return;
                    }
                    collisionGroup.objects.forEach(function(collisionItem) {
                        if (collisionItem.rectangle) {
                            let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width / 2;
                            let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height / 2;

                            let tmpSprite = matterInstance.add.sprite(objectX, objectY, "__DEFAULT");
                            //scale sprite and set immovable;
                            tmpSprite.setStatic(true);
                            tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height);
                        } else {
                            console.log("Unsuported collision Item Shape!")
                        }
                    });

                });
                barrelLayer.forEachTile(function(tile) {

                    let tileWorldPos = barrelLayer.tileToWorldXY(tile.x, tile.y);
                    let collisionGroup = tileset1.getTileCollisionGroup(tile.index);

                    if (!collisionGroup || collisionGroup.objects.length === 0) {
                        return;
                    }
                    collisionGroup.objects.forEach(function(collisionItem) {
                        if (collisionItem.rectangle) {
                            let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width / 2;
                            let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height / 2;

                            let tmpSprite = matterInstance.add.sprite(objectX, objectY, "__DEFAULT");
                            //scale sprite and set immovable;
                            tmpSprite.setStatic(true);
                            tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height);
                        } else {
                            console.log("Unsuported collision Item Shape!")
                        }
                    });

                });

                //set the camera to link!
                this.cameras.main.setBounds(-(map.widthInPixels / 2), 0, map.widthInPixels + 256, map.heightInPixels + 256)
                this.cameras.main.startFollow(this.link);
                //Add Enemies - 
                //Find Spawn Points
                let spawnPoints = new Array();
                //add collision zones for floors layer - spawn points.
                floorLayer.forEachTile(function(tile) {

                    let tileWorldPos = floorLayer.tileToWorldXY(tile.x, tile.y);
                    let collisionGroup = tileset4.getTileCollisionGroup(tile.index);

                    if (!collisionGroup || collisionGroup.objects.length === 0) {
                        return;
                    }
                    collisionGroup.objects.forEach(function(collisionItem) {
                        if (collisionItem.rectangle) {
                            let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width / 2;
                            let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height / 2;
                            // If this is a spawn point collision item - add to array of spawn points;
                            if (collisionItem.properties && collisionItem.properties.length > 0) {
                                if (collisionItem.properties[0].name === "SpawnPoint") {
                                    let currentPoint = new Phaser.Geom.Point(objectX, objectY);
                                    spawnPoints.push(currentPoint);
                                }
                            }
                        } else {
                            console.log("Unsuported collision Item Shape!")
                        }
                    });
                });
                //Minions/enemies;
                this.enemies = new Array();
                let spawnPointUsed = new Array();

                for (let i = 0; i < 5; i++) {
                    let spawnPointIndex = -1;
                    //need to make sure spawn pop
                    do {
                        spawnPointIndex = Phaser.Math.RND.between(0, spawnPoints.length - 1);
                    } while (spawnPointUsed.includes(spawnPointIndex))

                    spawnPointUsed.push(spawnPointIndex)

                    //create Minion  at that Spawn Point
                    let newMinion = this.matter.add.sprite(
                        spawnPoints[spawnPointIndex].x,
                        spawnPoints[spawnPointIndex].y,
                        'character_sprites', 'minion-front-0.png'
                    );

                    //set minion properties
                    newMinion.maxHitCount = 1;
                    newMinion.hitCount = 0;
                    newMinion.enemyType = "minion";
                    newMinion.speed = BaseScene.MINION_SPEED;
                    newMinion.scoreValue = BaseScene.MINION_SCORE;

                    newMinion.setScale(2);
                    newMinion.setBounce(0.2);
                    newMinion.setFixedRotation();
                    newMinion.setName("enemy-minion" + (i + 1));

                    //Temp - log spawn point chosen;
                    console.log(newMinion.name + " created at spawn point: :" + spawnPointIndex);

                    //add new enemy to array of enemies
                    this.enemies.push(newMinion);
                }
                //BLACK KNIGHTS


                for (let i = 0; i < 2; i++) {
                    let spawnPointIndex = -1;
                    //need to make sure spawn pop
                    do {
                        spawnPointIndex = Phaser.Math.RND.between(0, spawnPoints.length - 1);
                    } while (spawnPointUsed.includes(spawnPointIndex))

                    spawnPointUsed.push(spawnPointIndex)

                    //create BLACK KNIGHT  at that Spawn Point
                    let newBlackKnight = this.matter.add.sprite(
                        spawnPoints[spawnPointIndex].x,
                        spawnPoints[spawnPointIndex].y,
                        'character_sprites', 'enemy-front-0.png'
                    );

                    //set BK properties
                    newBlackKnight.maxHitCount = 2;
                    newBlackKnight.hitCount = 0;
                    newBlackKnight.enemyType = "enemy";
                    newBlackKnight.speed = BaseScene.ENEMIES_SPEED;
                    newBlackKnight.scoreValue = BaseScene.ENEMIES_SCORE;

                    newBlackKnight.setScale(2);
                    newBlackKnight.setBounce(0.2);
                    newBlackKnight.setFixedRotation();
                    newBlackKnight.setName("enemy-enemy" + (i + 1));

                    //Temp - log spawn point chosen;
                    console.log(newBlackKnight.name + " created at spawn point: :" + spawnPointIndex);

                    //add new enemy to array of enemies
                    this.enemies.push(newBlackKnight);
                }
                //EvilPrince;


                for (let i = 0; i < 1; i++) {
                    let spawnPointIndex = -1;
                    //need to make sure spawn pop
                    do {
                        spawnPointIndex = Phaser.Math.RND.between(0, spawnPoints.length - 1);
                    } while (spawnPointUsed.includes(spawnPointIndex))

                    spawnPointUsed.push(spawnPointIndex)

                    //create EP  at that Spawn Point
                    let newEvilPrince = this.matter.add.sprite(
                        spawnPoints[spawnPointIndex].x,
                        spawnPoints[spawnPointIndex].y,
                        'character_sprites', 'enemy1-front-0.png'
                    );

                    //set EP properties
                    newEvilPrince.maxHitCount = 3;
                    newEvilPrince.hitCount = 0;
                    newEvilPrince.enemyType = "enemy1";
                    newEvilPrince.speed = BaseScene.ENEMIES1_SPEED;
                    newEvilPrince.scoreValue = BaseScene.ENEMIES1_SCORE;

                    newEvilPrince.setScale(2);
                    newEvilPrince.setBounce(0.2);
                    newEvilPrince.setFixedRotation();
                    newEvilPrince.setName("enemy-enemy1" + (i + 1));

                    //Temp - log spawn point chosen;
                    console.log(newEvilPrince.name + " created at spawn point: :" + spawnPointIndex);

                    //add new enemy to array of enemies
                    this.enemies.push(newEvilPrince);
                }
                // Add Projectiles
                this.projectiles = new Array();


                //Overlap foundation layer 
                const overlapFoundationLayer = map.createLayer("OverlapFoundations", [tileset6], 0, 0);
                overlapFoundationLayer.forEachTile(function(tile) {

                    let tileWorldPos = overlapFoundationLayer.tileToWorldXY(tile.x, tile.y);
                    let collisionGroup = tileset6.getTileCollisionGroup(tile.index);

                    if (!collisionGroup || collisionGroup.objects.length === 0) {
                        return;
                    }
                    collisionGroup.objects.forEach(function(collisionItem) {
                        if (collisionItem.rectangle) {
                            let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width / 2;
                            let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height / 2;

                            let tmpSprite = matterInstance.add.sprite(objectX, objectY, "__DEFAULT");
                            //scale sprite and set immovable;
                            tmpSprite.setStatic(true);
                            tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height);

                            //check if the current collision is the escape point for the level.


                        } else {
                            console.log("Unsuported collision Item Shape!")
                        }
                    });

                });
                //refactor this into animation method - takes character prefix as a parameter and goes after that

                //create animations;
                this.createCharacterAnimations("dink");
                this.createCharacterAnimations("minion");
                this.createCharacterAnimations("enemy");
                this.createCharacterAnimations("enemy1");

                //create anim projectiles;
                this.createFireballAnimations();
                this.anims.create({
                    key: "explosion",
                    frames: this.anims.generateFrameNames('projectile_sprites', {
                        prefix: "explosion-",
                        suffix: ".png",
                        start: 0,
                        end: 5
                    }),
                    frameRate: 10,
                    repeat: 0,
                    hideOnComplete: true
                });


                //handle matter collision types
                this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
                    //see if this is collision between link and escapePoint
                    // console.log(bodyA.gameObject.name + "-" +
                    //     bodyB.gameObject.name);
                    if (bodyA.gameObject.name === "dink" && bodyB.gameObject.name.startsWith("enemy") ||
                        bodyA.gameObject.name.startsWith("enemy") && bodyB.gameObject.name === "dink") {
                        this.kingCaptured();

                    } else if (bodyA.gameObject.name === "projectile" && bodyB.gameObject.name.startsWith("enemy") ||
                        bodyA.gameObject.name.startsWith("enemy") && bodyB.gameObject.name === "projectile") {
                        console.log("The enemy was Hit!")
                        if (bodyA.name === "projectile") {
                            this.enemyShot(bodyB.gameObject, bodyA.gameObject);
                        } else {
                            this.enemyShot(bodyA.gameObject, bodyB.gameObject);
                        }

                    }
                    //projectile hitting a non enemy
                    else if (bodyA.gameObject.name === "projectile" && bodyB.gameObject.name !== "dink" ||
                        bodyA.gameObject.name !== "king" && bodyB.gameObject.name === "projectile") {
                        if (bodyA.name === "projectile") {
                            this.shotMissed(bodyA.gameObject);
                        } else {
                            this.shotMissed(bodyB.gameObject);
                        }

                    } else if (bodyA.gameObject.name === "king" && bodyB.gameObject.name === "escapePoint" ||
                        bodyA.gameObject.name === "escapePoint" && bodyB.gameObject.name === "dink") {
                        console.log("The link escaped through the escape point");
                        this.kingEscapes();
                    }
                });

                //handle matter pause event
                this.matter.world.on("pause", () => {
                    console.log("Game paused");
                    BaseScene.gamePaused = true;
                });
                //check if high score saved in browser localstorage
                this.highScore = 0;
                if (localStorage.highKingScore !== undefined) {
                    this.highScore = localStorage.highKingScore
                }

                //initialize SCORE BOARD!
                let fontObject = {
                    font: "20px Arial",
                    fill: "#FFFFFF",
                    align: "center"
                };
                this.levelText = this.add.text(25, 10, "LEVEL: " + this.sceneName, fontObject);
                this.levelText.setScrollFactor(0);

                this.scoreText = this.add.text(25, 35, "SCORE: " +
                    this.zeroPad(BaseScene.CURRENT_SCORE, 3), fontObject);
                this.scoreText.setScrollFactor(0);

                this.highScoreText = this.add.text(25, 60, "HIGHSCORE: " +
                    this.zeroPad(this.highScore, 3), fontObject);
                this.highScoreText.setScrollFactor(0);

            } //BOTTOM OF CREATE

        update() {
                if (!BaseScene.gamePaused) {

                    //deal with fireballs 
                    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                        this.shootFireball();
                    }
                    for (let i = 0; i < this.projectiles.length; i++) {
                        let fireball = this.projectiles[i];

                        if (fireball) //not null
                        {
                            fireball.update();
                        }
                    }

                    if (this.cursors.up.isDown && this.cursors.right.isDown) //northeast
                    {
                        this.link.setVelocityY(-0.5 * (BaseScene.LINK_SPEED));
                        this.link.setVelocityX(BaseScene.LINK_SPEED);
                        this.link.play('link-walk-right', true);
                        this.nextDinkIdle = 'link-idle-right';
                        this.link.direction = 'northeast';
                    } else if (this.cursors.down.isDown && this.cursors.right.isDown) //southeast
                    {
                        this.link.setVelocityY(0.5 * (BaseScene.LINK_SPEED));
                        this.link.setVelocityX(BaseScene.LINK_SPEED);
                        this.link.play('link-walk-right', true);
                        this.nextDinkIdle = 'link-idle-right';
                        this.link.direction = 'southeast';

                    } else if (this.cursors.up.isDown && this.cursors.left.isDown) //northwest
                    {
                        this.link.setVelocityY(-0.5 * (BaseScene.LINK_SPEED));
                        this.link.setVelocityX(-(BaseScene.LINK_SPEED));
                        this.link.play('link-walk-left', true);
                        this.nextDinkIdle = 'link-idle-left';
                        this.link.direction = 'northwest';

                    } else if (this.cursors.down.isDown && this.cursors.left.isDown) //southwest
                    {
                        this.link.setVelocityY(0.5 * (BaseScene.LINK_SPEED));
                        this.link.setVelocityX(-(BaseScene.LINK_SPEED));
                        this.link.play('link-walk-left', true);
                        this.nextDinkIdle = 'link-idle-left';
                        this.link.direction = 'southwest';

                    }
                    //link move:
                    else if (this.cursors.up.isDown) {
                        this.link.setVelocityY(-(BaseScene.LINK_SPEED));
                        this.link.setVelocityX(0);
                        this.link.play('link-walk-up', true);
                        this.nextDinkIdle = 'link-idle-back';
                        this.link.direction = 'north';

                    } else if (this.cursors.down.isDown) {
                        this.link.setVelocityY(BaseScene.LINK_SPEED);
                        this.link.setVelocityX(0);
                        this.link.play('link-walk-down', true);
                        this.nextDinkIdle = 'link-idle-front';
                        this.link.direction = 'south';

                    } else if (this.cursors.right.isDown) {
                        this.link.setVelocityY(0);
                        this.link.setVelocityX(BaseScene.LINK_SPEED);
                        this.link.play('link-walk-right', true);
                        this.nextDinkIdle = 'link-idle-right';
                        this.link.direction = 'east';

                    } else if (this.cursors.left.isDown) {
                        this.link.setVelocityY(0);
                        this.link.setVelocityX(-(BaseScene.LINK_SPEED));
                        this.link.play('link-walk-left', true);
                        this.nextDinkIdle = 'link-idle-left';
                        this.link.direction = 'west';

                    } else //standing still - show next idle anim.
                    {
                        this.link.setVelocityY(0);
                        this.link.setVelocityX(0);
                        this.link.play(this.nextDinkIdle, true);
                    }

                    //start minions moving
                    let currentScene = this;
                    let king = this.link;

                    //check if minions in camera and start them moving
                    this.enemies.forEach(function(enemy) {
                        if (enemy) {
                            if (currentScene.cameras.main.worldView.contains(enemy.x, enemy.y)) {
                                //need to determine the orientation between the link and the minion
                                let kingOrientation = currentScene.getKingEnemyOrientation(king, enemy);
                                let enemyAnimation = enemy.enemyType + "-idle-front";
                                let enemyXVelocity = 0;
                                let enemyYVelocity = 0;

                                // if the enemy is not currently movin
                                if (Math.abs(enemy.body.velocity.x) < 1 && Math.abs(enemy.body.velocity.y) < 1) {
                                    if (kingOrientation.aspect === "x" && kingOrientation.positive === false) {
                                        enemyXVelocity = -(enemy.speed);
                                        enemyAnimation = enemy.enemyType + "-walk-left";
                                    } else if (kingOrientation.aspect === "y" && kingOrientation.positive === true) {
                                        enemyYVelocity = enemy.speed;
                                        enemyAnimation = enemy.enemyType + "-walk-down";
                                    } else if (kingOrientation.aspect === "y" && kingOrientation.positive === false) {
                                        enemyYVelocity = -(enemy.speed);
                                        enemyAnimation = enemy.enemyType + "-walk-up";
                                    } else {
                                        enemyXVelocity = enemy.speed;
                                        enemyAnimation = enemy.enemyType + "-walk-right";
                                    }

                                }
                                //else if enemy already moving
                                else {
                                    if (enemyXVelocity === 0 && kingOrientation.aspect === "x") {
                                        enemyYVelocity = 0;
                                        //start moving towards the link on "X"
                                        if (kingOrientation.positive === true) {

                                            enemyXVelocity = enemy.speed;
                                            enemyAnimation = enemy.enemyType + "-walk-right";
                                        } else {
                                            enemyXVelocity = -(enemy.speed);
                                            enemyAnimation = enemy.enemyType + "-walk-left";
                                        }
                                    } else if (enemyXVelocity === 0 && kingOrientation.aspect === "y") {
                                        enemyXVelocity = 0;
                                        //start moving towards the link on "y"
                                        if (kingOrientation.positive === true) {

                                            enemyYVelocity = enemy.speed;
                                            enemyAnimation = enemy.enemyType + "-walk-down";
                                        } else {
                                            enemyYVelocity = -(enemy.speed);
                                            enemyAnimation = enemy.enemyType + "-walk-up";
                                        }
                                    }
                                }
                                enemy.setVelocityY(enemyYVelocity);
                                enemy.currentVelocityY = enemyYVelocity;
                                enemy.setVelocityX(enemyXVelocity);
                                enemy.currentVelocityX = enemyXVelocity;
                                enemy.play(enemyAnimation, true);

                            }
                        }
                    });


                } //end of not paused

            } //end of update

        //HELPER Functions
        zeroPad(number, size) {
            let stringNumber = String(number);

            while (stringNumber.length < (size || 2)) {
                stringNumber = "0" + stringNumber;
            }

            return stringNumber;
        }

        //orientation between link and enemy
        getKingEnemyOrientation(king, enemy) {
                let orientation = {
                    aspect: "",
                    positive: false
                };
                //Find which direction is greatest link and enemy position dif
                let xDifference = king.x - enemy.x;
                let yDifference = king.y - enemy.y;

                //default to x if both equal
                if (Math.abs(xDifference) >= Math.abs(yDifference)) {
                    orientation.aspect = "x";
                    if (xDifference > 0) {
                        orientation.positive = true;
                    }
                } else {
                    orientation.aspect = "y";
                    if (yDifference > 0) {
                        orientation.positive = true;
                    }
                }
                return orientation;
            }
            //shoot fireball function
        shootFireball() {
            this.fireballSound.play();

            console.log("Shot Fireball!");
            let fireball = new Fireball(this);
        }
        enemyShot(enemy, projectile) {

            projectile.destroy(true);
            this.matter.world.remove(projectile);
            let fireBallIndex = this.projectiles.indexOf(projectile);
            this.projectiles[fireBallIndex] = null;
            // Hey - some enemies do not die on first hit
            enemy.hitCount += 1;
            if (enemy.maxHitCount > 1 && enemy.hitCount < enemy.maxHitCount) {
                return;
            }
            this.explosionSound.play();
            let explosion = new Explosion(this, enemy.x, enemy.y);
            enemy.destroy(true);
            this.matter.world.remove(enemy);
            let enemyIndex = this.enemies.indexOf(enemy);
            this.enemies[enemyIndex] = null;

            //LATER - MIGHT GENERATE  A NEW ENEMY -> NEED TO INCREASE SCORE !1!1 AND SOUND!1!
            BaseScene.CURRENT_SCORE += enemy.scoreValue;

            let scoreFormatted = this.zeroPad(BaseScene.CURRENT_SCORE, 3);
            this.scoreText.text = "SCORE: " + scoreFormatted

        }

        shotMissed(projectile) {
            this.explosionSound.play();

            let explosion = new Explosion(this, projectile.x, projectile.y);

            projectile.destroy(true);
            this.matter.world.remove(projectile);
            let fireBallIndex = this.projectiles.indexOf(projectile);
            this.projectiles[fireBallIndex] = null;
        }


        kingEscapes(nextLevel) {
            //load next scene if passed in, if null end the game

            if (nextLevel === null) {
                console.log("Game Over")

                this.gameOverSound.play();

                this.matter.world.pause();
                this.link.setTint(0xff0000);
                this.link.play(this.nextDinkIdle, true);

                //check to see if we have the high score!
                if (localStorage.highKingScore === undefined ||
                    localStorage.highKingScore < BaseScene.CURRENT_SCORE) {
                    localStorage.highKingScore = BaseScene.CURRENT_SCORE;
                    console.log("New High Score Achieved!");
                }
            } else {
                console.log("King escaped to: " + nextLevel);
                this.scene.start(nextLevel);
            }


        }

        kingCaptured() {
            console.log("The King Was Captured!");
            //pause 
            this.matter.world.pause();
            //paint the link
            this.link.setTint(0xff0000);
            this.link.play(this.nextDinkIdle, true);
            //set minions to green and stop;
            this.enemies.forEach(function(enemy) {
                if (enemy) {
                    enemy.setTint(0x00ff00);
                    enemy.play(enemy.enemyType + "-idle-front", true);
                }

            });
            //stop sounds!
            this.levelMusic.stop();
            this.gameOverSound.play();
        }

        //ANIMATION METHODS
        createCharacterAnimations(characterPrefix) {
            this.anims.create({
                key: characterPrefix + '-walk-up',
                frames: this.anims.generateFrameNames('character_sprites', {
                    prefix: characterPrefix + '-back-',
                    suffix: '.png',
                    start: 0,
                    end: 2
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: characterPrefix + '-walk-down',
                frames: this.anims.generateFrameNames('character_sprites', {
                    prefix: characterPrefix + '-front-',
                    suffix: '.png',
                    start: 0,
                    end: 2
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: characterPrefix + '-walk-left',
                frames: this.anims.generateFrameNames('character_sprites', {
                    prefix: characterPrefix + '-left-',
                    suffix: '.png',
                    start: 0,
                    end: 2
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: characterPrefix + '-walk-right',
                frames: this.anims.generateFrameNames('character_sprites', {
                    prefix: characterPrefix + '-right-',
                    suffix: '.png',
                    start: 0,
                    end: 2
                }),
                frameRate: 10,
                repeat: -1
            });
            //character standing still
            this.anims.create({
                key: characterPrefix + '-idle-front',
                frames: [{
                    key: 'character_sprites',
                    frame: characterPrefix + '-front-0.png'
                }]
            });
            this.anims.create({
                key: characterPrefix + '-idle-back',
                frames: [{
                    key: 'character_sprites',
                    frame: characterPrefix + '-back-0.png'
                }]
            });
            this.anims.create({
                key: characterPrefix + '-idle-left',
                frames: [{
                    key: 'character_sprites',
                    frame: characterPrefix + '-left-0.png'
                }]
            });
            this.anims.create({
                key: characterPrefix + '-idle-right',
                frames: [{
                    key: 'character_sprites',
                    frame: characterPrefix + '-right-0.png'
                }]
            });
        }

        createFireballAnimations() {
            this.anims.create({
                key: 'fireball-north',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-north-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-northeast',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-northeast-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-east',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-east-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-southeast',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-southeast-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-south',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-south-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-southwest',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-southwest-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-west',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-west-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'fireball-northwest',
                frames: this.anims.generateFrameNames('projectile_sprites', {
                    prefix: 'fireball-northwest-',
                    suffix: '.png',
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            });
        }

        //Loading Screen function
        // from -> https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
        playLoadingScreen() {

            let progressBar = this.add.graphics();
            let progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 270, 320, 50);
            //loading text
            let width = this.cameras.main.width;
            let height = this.cameras.main.height;

            //PALACE REVolt LOGO
            let logoText = this.make.text({
                x: width / 2,
                y: 100,
                text: 'Dink Revolt',
                style: {
                    font: '60px tahoma',
                    fill: '#ffd700'
                }
            });
            logoText.setShadow(5, 5, 'rgba(255,0,0.5', 0);
            logoText.setOrigin(0.5, 0.5);

            let loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: 'Loading...',
                style: {
                    font: '20px tahoma',
                    fill: '#ffffff'
                }
            });
            loadingText.setOrigin(0.5, 0.5);

            //loading value text
            let percentText = this.make.text({
                x: width / 2,
                y: height / 2 - 5,
                text: '0%',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            percentText.setOrigin(0.5, 0.5);

            //assetText
            var assetText = this.make.text({
                x: width / 2,
                y: height / 2 + 50,
                text: '',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            assetText.setOrigin(0.5, 0.5);

            this.load.on('progress', function(value) {
                console.log(value);
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(250, 280, 300 * value, 30);
                percentText.setText(parseInt(value * 100) + '%');
            });

            this.load.on('fileprogress', function(file) {
                console.log(file.src);
                assetText.setText('Loading asset: ' + file.src);
            });

            this.load.on('complete', function() {
                console.log('complete');
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                assetText.destroy();
                logoText.destroy();
            });
        }

    } // END OF THE CLASS