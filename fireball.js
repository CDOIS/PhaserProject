class Fireball extends Phaser.Physics.Matter.Sprite {

    //constant FB Speed
    static FIREBALL_SPEED = 20;

    constructor(scene) {

        let x = 0;
        let y = 0;
        let fireballXVelocity = 0;
        let fireballYVelocity = 0;
        let fireballAnimation = "";

        //fireball shoots in current dink direction

        if (scene.dink.direction === "north") {
            x = scene.dink.x;
            y = scene.dink.y - 64;
            fireballYVelocity = -(Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-north";
        } else if (scene.dink.direction === "northeast") {
            x = scene.dink.x + 64;
            y = scene.dink.y - 32;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballYVelocity = -(0.5 * Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-northeast";
        } else if (scene.dink.direction === "east") {
            x = scene.dink.x + 64;
            y = scene.dink.y;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-east";
        } else if (scene.dink.direction === "southeast") {
            x = scene.dink.x + 64;
            y = scene.dink.y + 32;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballYVelocity = 0.5 * Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-southeast";
        } else if (scene.dink.direction === "south") {
            x = scene.dink.x;
            y = scene.dink.y + 64;
            fireballYVelocity = Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-south";
        } else if (scene.dink.direction === "southwest") {
            x = scene.dink.x - 64;
            y = scene.dink.y + 32;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);

            fireballYVelocity = 0.5 * Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-southwest";
        } else if (scene.dink.direction === "west") {
            x = scene.dink.x - 64;
            y = scene.dink.y;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-west";
        } else if (scene.dink.direction === "northwest") {
            x = scene.dink.x - 64;
            y = scene.dink.y - 32;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);

            fireballYVelocity = -(0.5 * Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-northwest";
        }

        super(scene.matter.world, x, y, "fireball");
        scene.add.existing(this);
        this.setBounce(0);
        this.setFixedRotation();
        this.setName("projectile");
        this.play(fireballAnimation);
        this.setVelocityX(fireballXVelocity);
        this.setVelocityY(fireballYVelocity);

        scene.projectiles.push(this);

    }

    update(scene) {
        //do nothing special for now.
    }



}