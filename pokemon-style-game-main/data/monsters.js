const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    name: 'Emby',
    // Create an array of attacks using Object.values to ensure all properties are included
    attacks: [
      attacks.Tackle,
      attacks.Fireball,
      attacks.TailWhip
    ],
    type: "fire"
  },
  FleshyMass: {
    position: {
      x: 775,
      y: 25
    },
    image: {
      src: './img/FleshyMassFinal.png'
    },
    frames: {
      max: 12,
      hold: 20
    },
    scale: 300,
    animate: true,
    isEnemy: true,
    name: 'FleshyMass',
    attacks: [attacks.GreenLazer, attacks.Fireball],
    type: "dragon",
    health: 100
  }
}