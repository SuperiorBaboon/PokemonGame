class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    type="normal"
  }) {
    this.position = position
    this.image = new Image()
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * this.scale
      this.height = this.image.height * this.scale
    }
    this.image.src = image.src

    this.animate = animate
    this.sprites = sprites
    this.opacity = 1

    this.rotation = rotation
    this.scale = scale
  }

  draw() {
    c.save()
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    c.rotate(this.rotation)
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    c.globalAlpha = this.opacity

    const crop = {
      position: {
        x: this.frames.val * (this.width / this.scale),
        y: 0
      },
      width: this.image.width / this.frames.max * this.scale,
      height: this.image.height * this.scale
    }

    const image = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: this.image.width / this.frames.max,
      height: this.image.height
    }

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
    )

    c.restore()

    if (!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class StaticSprite {
  constructor({
    position,
    image,
    scale = 1,
    rotation = 0
  }) {
    this.position = position
    this.image = new Image()
    this.image.src = image.src
    this.scale = scale
    this.rotation = rotation
    this.opacity = 1

    this.image.onload = () => {
      this.width = this.image.width * scale
      this.height = this.image.height * scale
    }
  }

  draw() {
    c.save()
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    c.rotate(this.rotation)
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    c.globalAlpha = this.opacity

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )

    c.restore()
  }
}

class Monster extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
  }

  faint() {
    document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
    audio.battle.stop()
    audio.victory.play()
  }

  async attack({ attack, recipient, renderedSprites }) {
    return new Promise(async (resolve) => {
      if (!this.isEnemy) {  
        const questionWaiter = new Promise((resolveQuestion) => {
          const questionNum = Math.floor(Math.random() * 25 + 1).toString();
          const questionElement = document.getElementById(questionNum);
          
          if (questionElement) {
            // Show question
            questionElement.style.display = 'block';
            questionElement.style.opacity = 1;
            questionElement.style.pointerEvents = 'auto';
            questionElement.style.zIndex = '100';
  
            const answerButtons = questionElement.querySelectorAll('.answer-button');
            answerButtons.forEach(button => {
              button.addEventListener('click', () => {
                // Hide question
                questionElement.style.display = 'none';
                questionElement.style.opacity = 0;
                questionElement.style.pointerEvents = 'none';
                questionElement.style.zIndex = '-1';
                
                const isCorrect = button.dataset.correct === 'true';
                resolveQuestion(isCorrect);
              }, { once: true });
            });
          } else {
            console.error('Question element not found:', questionNum);
            resolveQuestion(true);
          }
        });
  
        const isCorrect = await questionWaiter;
        
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 
          this.name + (isCorrect ? ' used ' + attack.name : ' failed!')
  
        if (!isCorrect) {
          setTimeout(() => {
            document.querySelector('#dialogueBox').style.display = 'none'
            resolve();
          }, 1000)
          return;
        }
      }
  
      let healthBar = '#enemyHealthBar'
      if (this.isEnemy) healthBar = '#playerHealthBar'
  
      let rotation = 1
      if (this.isEnemy) rotation = -2.2
  
      recipient.health -= attack.damage
  
      switch (attack.name) {
        case 'Fireball':
          audio.initFireball.play()
          const fireballImage = new Image()
          fireballImage.src = './img/fireball.png'
          const fireball = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y
            },
            image: fireballImage,
            frames: {
              max: 4,
              hold: 10
            },
            animate: true,
            rotation
          })
          renderedSprites.splice(1, 0, fireball)
  
          gsap.to(fireball.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              audio.fireballHit.play()
              gsap.to(healthBar, {
                width: recipient.health + '%'
              })
  
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              })
  
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08
              })
              renderedSprites.splice(1, 1)
              resolve()
            }
          })
          break
  
        case 'Tackle':
          const tl = gsap.timeline()
  
          let movementDistance = 20
          if (this.isEnemy) movementDistance = -20
  
          tl.to(this.position, {
            x: this.position.x - movementDistance
          })
            .to(this.position, {
              x: this.position.x + movementDistance * 2,
              duration: 0.1,
              onComplete: () => {
                audio.tackleHit.play()
                gsap.to(healthBar, {
                  width: recipient.health + '%'
                })
  
                gsap.to(recipient.position, {
                  x: recipient.position.x + 10,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08
                })
  
                gsap.to(recipient, {
                  opacity: 0,
                  repeat: 5,
                  yoyo: true,
                  duration: 0.08
                })
              }
            })
            .to(this.position, {
              x: this.position.x,
              onComplete: () => {
                resolve()
              }
            })
          break
  
        case 'TailWhip':
          //audio.tailWhip.play()
          const tailWhipImage = new Image()
          tailWhipImage.src = './img/Vurm.png'
          const tailWhip = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y
            },
            image: tailWhipImage,
            frames: {
              max: 1,
              hold: 10
            },
            animate: true,
            rotation
          })
          renderedSprites.splice(1, 0, tailWhip)
  
          gsap.to(tailWhip.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              gsap.to(healthBar, {
                width: recipient.health + '%'
              })
  
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              })  
  
              gsap.to(recipient, {  
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08
              })
  
              renderedSprites.splice(1, 1)
              resolve()
            }
          })
          break
          case 'GreenLazer':
          //audio.tailWhip.play()
          const greenLazerImage = new Image()
          greenLazerImage.src = './img/Vurm.png'
          const greenLazer = new Sprite({
            position: {
              x: this.position.x,
              y: this.position.y
            },
            image: greenLazerImage,
            frames: {
              max: 4,
              hold: 10
            },
            animate: true,
            rotation
          })
          renderedSprites.splice(1, 0, greenLazer)
  
          gsap.to(greenLazer.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            onComplete: () => {
              gsap.to(healthBar, {
                width: recipient.health + '%'
              })
  
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              })  
  
              gsap.to(recipient, {  
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08
              })
  
              renderedSprites.splice(1, 1)
              resolve()
            }
          })
          break

        default:
          resolve()
          return
      }
    })
  }
}
class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

class Character extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    dialogue = ['']
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale
    })

    this.dialogue = dialogue
    this.dialogueIndex = 0
  }
}
