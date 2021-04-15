class Fireball extends Phaser.Physics.Matter.Sprite {

    //constant FB Speed
    static FIREBALL_SPEED = 20;

    constructor(scene) {

        let x = 0;
        let y = 0;
        let fireballXVelocity = 0;
        let fireballYVelocity = 0;
        let fireballAnimation = "";

        //fireball shoots in current link direction

        if (scene.link.direction === "north") {
            x = scene.link.x;
            y = scene.link.y - 64;
            fireballYVelocity = -(Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-north";
        } else if (scene.link.direction === "northeast") {
            x = scene.link.x + 64;
            y = scene.link.y - 32;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballYVelocity = -(0.5 * Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-northeast";
        } else if (scene.link.direction === "east") {
            x = scene.link.x + 64;
            y = scene.link.y;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-east";
        } else if (scene.link.direction === "southeast") {
            x = scene.link.x + 64;
            y = scene.link.y + 32;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballYVelocity = 0.5 * Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-southeast";
        } else if (scene.link.direction === "south") {
            x = scene.link.x;
            y = scene.link.y + 64;
            fireballYVelocity = Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-south";
        } else if (scene.link.direction === "southwest") {
            x = scene.link.x - 64;
            y = scene.link.y + 32;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);

            fireballYVelocity = 0.5 * Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-southwest";
        } else if (scene.link.direction === "west") {
            x = scene.link.x - 64;
            y = scene.link.y;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-west";
        } else if (scene.king.direction === "northwest") {
            x = scene.link.x - 64;
            y = scene.link.y - 32;
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