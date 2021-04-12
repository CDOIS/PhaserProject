class Scene1 extends BaseScene {
    constructor() {
        super("Level1");
        console.log("Finish child constructor for Scene 1.");
    }

    preload() {
        //call the super preload
        super.preload("mapLevel", "assets/tilemaps/level.json");

        //load level one sound
        this.load.audio("audio_crowd", "assets/sounds/angry_crowd.mp3")

    }

    create() {
        super.create("mapLevel");
        //configure and start level one sound
        this.levelMusic = this.sound.add("audio_crowd");

        let musicConfig = {
            mute: true,
            volume: 0.2,
            rate: 1,
            detune: 0,
            loop: false,
            delay: 0
        };

        //start level sound
        this.levelMusic.play(musicConfig);
    }

    update() {
        super.update();
    }
    kingEscapes() {
        //STOP the level sound
        this.levelMusic.stop();
        super.kingEscapes("Level2");

    }

}