const inquirer = require('inquirer')
const Player = require('./Player')
const Enemy = require('./Enemy')

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin', 'sword'))
    this.enemies.push(new Enemy('orc', 'baseball bat'))
    this.enemies.push(new Enemy('skeleton', 'axe'))

    this.currentEnemy = this.enemies[0]

    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'What is your name?'
    }).then(({ name }) => {
        this.player = new Player(name);

        this.startNewBattle()
    })
}

Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:')
    console.table(this.player.getStats())
    console.log(this.currentEnemy.getDescription())

    this.battle()
}

Game.prototype.battle = function () {
    if (this.isPlayerTurn) {
        inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack', 'Use Potion']
        }).then(({ action }) => {
            if (action === 'Use Potion') {
                if (!this.player.getInventory()) {
                    console.log('You do not have any potions in your inventory!')
                    return;
                }

                inquirer.prompt({
                    type: 'list',
                    message: 'Which potion would you like to use?',
                    name: 'action',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                }).then(({ action }) => {
                    const potionIndex = parseInt(action.split(': ')[0]) - 1
                    const potion = this.player.getInventory()[potionIndex]
                    
                    this.player.usePotion(potionIndex)
                    
                    console.log(`You used a potion that increased your ${potion.name} by ${potion.value} points!`)
                })
            } else {
                const damage = this.player.getAttackValue()
                this.currentEnemy.reduceHealth(damage)

                console.log(`You attacked the ${this.currentEnemy.name} and did ${damage} damage to it!`)
                console.log(this.currentEnemy.getHealth())
            }
        })
    } else {
        const damage = this.currentEnemy.getAttackValue()
        this.player.reduceHealth(damage)

        console.log(`You were attacked by the ${this.currentEnemy.name} for ${damage} points!`)
        console.log(this.player.getHealth())
        if(this.player.isAlive) {
            // do something
        }
    }
}

module.exports = Game;