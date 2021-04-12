class Explosion extends Phaser.Physics.Matter.Sprite {


    constructor(scene, x, y) {
        super(scene.matter.world, x, y, -32, "explosion");
        this.currentScene = scene;
        this.setScale(0.8);
        this.currentScene.add.existing(this);

        this.on("animationcomplete", this.cleanUp);
        this.play("explosion");
    }

    cleanUp() {
        this.destroy(true);
        this.currentScene.matter.world.remove(this);
    }

}