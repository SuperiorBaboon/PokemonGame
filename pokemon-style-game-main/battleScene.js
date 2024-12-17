console.log(attacks)
function validateAttack(attack) {
  console.log('Validating attack:', attack);
  return attack && typeof attack === 'object' && 
         'name' in attack && 
         'damage' in attack && 
         'type' in attack && 
         'color' in attack;
}

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage,
  width: 1576,
  height: 864
})

let FleshyMass
let emby
let renderedSprites
let battleAnimationId
let queue
let isAttackInProgress = false
let monstersDefeated = 0
let monstersDefeatedInd = document.getElementById('monstersDefeated')

document.querySelector('#playAgainButton').addEventListener('click', () => {
  monstersDefeated = 0
  document.querySelector('#victoryScreen').style.display = 'none'
  battle.initiated = false
  audio.Map.play()
  animate()
})

function checkVictoryCondition() {
  if (monstersDefeated >= 10) {
    document.querySelector('#victoryScreen').style.display = 'flex'
    audio.victory.play()
    return true
  }
  return false
}

function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()

  FleshyMass = new Monster(monsters.FleshyMass)
  emby = new Monster(monsters.Emby)
  renderedSprites = [FleshyMass, emby]
  queue = []

  console.log('Emby attacks:', emby.attacks);
  console.log(attacks)

  emby.attacks.forEach((attack) => {
    if (validateAttack(attack)) {
      const button = document.createElement('button');
      button.innerHTML = attack.name;
      button.addEventListener('click', () => {
        // Handle the attack logic here
        console.log(`${emby.name} used ${attack.name}`);
      });
      document.querySelector('#attacksBox').append(button);
    } else {
      console.error('Invalid attack found:', attack);
    }
  });

  function endBattle() {
    // Clear any remaining items in the queue
    queue.length = 0
    
    // Add the ending sequence
    gsap.to('#overlappingDiv', {
      opacity: 1,
      onComplete: () => {
        cancelAnimationFrame(battleAnimationId)
        animate()
        document.querySelector('#userInterface').style.display = 'none'
        gsap.to('#overlappingDiv', {
          opacity: 0
        })
        battle.initiated = false
        monstersDefeated++
        monstersDefeatedInd.innerHTML = 'Monsters Defeated: ' + monstersDefeated;
        audio.Map.play()
      }
    })
  }  

  // Move the attack type handler outside of the button forEach loop
const attacksBox = document.querySelector('#attacksBox')
const attackType = document.querySelector('#attackType')

// Create a single mouseenter event listener for the attacksBox
attacksBox.addEventListener('mouseenter', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const selectedAttack = emby.attacks.find(attack => attack.name === e.target.innerHTML)
    if (selectedAttack) {
      attackType.innerHTML = selectedAttack.type
      attackType.style.color = selectedAttack.color
    }
  }
}, true)

// Clear the attack type when mouse leaves the attacks box
attacksBox.addEventListener('mouseleave', () => {
  attackType.innerHTML = ''
}, true)

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    let isAttacking = false  // Add a flag to prevent multiple attacks
  
    button.addEventListener('click', async (e) => {
      if (isAttacking) return  // Prevent multiple attacks while one is in progress
      
      const selectedAttack = emby.attacks.find(attack => attack.name === e.currentTarget.innerHTML)
      if (selectedAttack) {
        isAttacking = true  // Set flag before attack starts
  
        await emby.attack({
          attack: selectedAttack,
          recipient: FleshyMass,
          renderedSprites
        })
  
        if (FleshyMass.health <= 0) {
          FleshyMass.faint()
          endBattle()
          return
        }
  
        // Enemy attacks only if the enemy is still alive
        const randomAttack = FleshyMass.attacks[Math.floor(Math.random() * FleshyMass.attacks.length)]
        await FleshyMass.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites
        })
  
        if (emby.health <= 0) {
          emby.faint()
          endBattle()
          return
        }
  
        isAttacking = false  // Reset flag after attack sequence is complete
      }
    })
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

animate()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
