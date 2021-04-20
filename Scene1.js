class Scene1 extends BaseScene {
    constructor() {
        super("Level1");
        console.log("Finish child constructor for Scene 1.");

    }

    preload() {
        //call the super preload
        super.preload("mapLevel", "assets/tilemaps/level.json");

        //load level one sound
        this.load.audio("majestic_castle_storm", "assets/sounds/majestic_castle_storm.mp3")
        
    }


    // https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-a-link-to-the-past-snes/05b%2520Majestic%2520Castle%2520%2528Storm%2529.mp3
    create() {
        super.create("mapLevel");
        //configure and start level one sound
        this.levelMusic = this.sound.add("majestic_castle_storm");

        let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            loop: false,
            delay: 0
        };

        //start level sound
        this.levelMusic.play(musicConfig);
        this.input.on('pointerdown', () => this.Scene.start('Level1'))

    }

    update() {
        super.update();
    }
    dinkEscapes() {
        //STOP the level sound
        
        this.levelMusic.stop();
        super.dinkEscapes("Level2");
   
    }

}