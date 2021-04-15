//IIFE - Script at bottom
(function() {
    //Main code here - safe from global context

    //set up our game config
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: "#2d2d2d",
        parent: "dink-revolt",
        pixelArt: true,
        physics: {
            default: "matter",
            matter: {
                gravity: { y: 0 },
                debug: true
            }
        },
        // scene: {
        //     preload: preload,
        //     create: create,
        //     update: update
        // }
        scene: [Scene1]
    };

    let game = new Phaser.Game(config);

})()