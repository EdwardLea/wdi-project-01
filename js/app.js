$(() => {
  init()
})

//  PARAMETERS----------------------------------------------------------
// Board Parameters
const boardWidth = 10

// Inplay Parameters
let gameInPlay = false
let playerTurn = false
let hitShip = false
let hitSuccess = false
let winner = false
let playerTotalHits = 0
let compTotalHits = 0
let compHitPosition = 0
let strategicHit = 0
let nextMove = 0
let boatEnd = false
let successfulHits = 1
let board = ''
let selectedBoat = ''
let compStrikeIndex = [1, boardWidth, -1, -boardWidth]
let direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
const orientation = ['vertical','horizontal']
const boatsTemplate = [{
  name: 'carrier',
  length: 5,
  compPlaced: false,
  playerPlaced: false,
  compHits: 0,
  playerHits: 0,
  compSunk: false,
  playerSunk: false
}, {
  name: 'battleship',
  length: 4,
  compPlaced: false,
  playerPlaced: false,
  compHits: 0,
  playerHits: 0,
  compSunk: false,
  playerSunk: false
}, {
  name: 'cruiser',
  length: 3,
  compPlaced: false,
  playerPlaced: false,
  compHits: 0,
  playerHits: 0,
  compSunk: false,
  playerSunk: false
}, {
  name: 'submarine',
  length: 3,
  compPlaced: false,
  playerPlaced: false,
  compHits: 0,
  playerHits: 0,
  compSunk: false,
  playerSunk: false
}, {
  name: 'destroyer',
  length: 2,
  compPlaced: false,
  playerPlaced: false,
  compHits: 0,
  playerHits: 0,
  compSunk: false,
  playerSunk: false
}]
let boats = boatsTemplate.map(boat => Object.assign({}, boat))

// DOM ELEMENTS-----------------------------------------------------------------

let $playerBoard
let $computerBoard
let $type
let $startButton
let $directionButton
let $resetButton
let $selectorButtons
let $instructionButtons
let $instructions
let $imagesDiv
let $resultDisplay
let $popUp
let $computerGame
let $playerPrompt
let $inPlayPrompt
let $audio
let $audio2
let $grid1
let $grid2

// ---------------------FUNCTIONS--------------------------------------

// function to initiate the game------------------------------------------------
function init(){
  // DOM elements added
  $playerBoard = $('.player-board')
  $computerBoard = $('.computer-board')
  $type = $('.boat-type')
  $startButton = $('.start-game')
  $directionButton = $('.direction-button')
  $resetButton = $('.reset-game')
  $selectorButtons = $('.selectors')
  $instructionButtons = $('.instructions-button')
  $instructions = $('.instructions')
  $imagesDiv = $('.image')
  $resultDisplay = $('.results')
  $popUp = $('.message')
  $computerGame = $('.computer-area')
  $playerPrompt = $('.prompt')
  $inPlayPrompt = $('.prompt-in-play')
  $audio = $('#sound')
  $audio2 = $('#sound2')

  // adding image divs to each boat button
  $imagesDiv.each((index, el) => {
    for(let i = 0; i<el.dataset.length; i++){
      const div = document.createElement('div')
      el.append(div)
    }
  })

  // adding board elements to players board
  for(let i = 0; i<boardWidth*boardWidth; i++) {
    $playerBoard.append($('<div />'))
  }
  $grid1 = $playerBoard.find('div')

  // adding board elements to computers board
  for(let i = 0; i<boardWidth*boardWidth; i++) {
    $computerBoard.append($('<div />'))
  }
  $grid2 = $computerBoard.find('div')

  startGame()

  $grid1.on('click', addPlayerBoat)
  $grid1.on('mousemove', addPlayerBoat)
  $grid1.on('mouseleave', removeHoverEffect)
  $grid2.on('click', checkForHit)
  $type.on('click', selectBoatType)
  $startButton.on('click', inPlay)
  $directionButton.on('click', toggleDirection)
  $resetButton.on('click', startGame)
  $instructionButtons.on('click',instructionsToggle)
  $(document).on('keypress', rotateShip)
}

// functions used to start and restart the game-----------------------------------
function startGame(){
  clearBoard()
  $selectorButtons.show()
  $startButton.hide()
  $resetButton.hide()
  $resultDisplay.hide()
  $computerGame.hide()
  $inPlayPrompt.show()
  $playerPrompt.show()
  $instructions.hide()
  $('.overlay').css('display', 'none')
  // *********************
  $type.removeClass('selected-boat')
  $type.removeClass('placed')
  $('.computer-ships > div').removeClass('sunk')
  $('.boat-cats > div').removeClass('sunk')
  boats = boatsTemplate.map(boat => Object.assign({}, boat))
  gameInPlay = false
  playerTurn = false
  winner = false
  hitShip = false
  hitSuccess = false
  playerTotalHits = 0
  compTotalHits = 0
  compHitPosition = 0
  nextMove = 0
  successfulHits = 1
  board = ''
  selectedBoat = ''
  compStrikeIndex = [1, boardWidth, -1, -boardWidth]
}

function clearBoard(){
  $grid1.removeClass()
  $grid2.removeClass()
}

// Functions to set boat positions for computer and player--------------------

// function to randomly generate number for placement of ships and selecting hits
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

// function to find selected boat from menu
function selectBoatType(e){
  if(gameInPlay || winner){
    e.preventDefault()
  } else {
    selectedBoat = e.currentTarget.dataset.boat
    $(e.currentTarget).removeClass('placed')
    $type.removeClass('selected-boat')
    $(e.currentTarget).addClass('selected-boat')
    $resetButton.show()
  }
}

// function to add computers boats to board
function computerBoatPos(){
  boats.forEach((boat) => {
    while (!boat.compPlaced){
      const boatIndex = getRandomNumber(0, boardWidth*boardWidth)
      const type = boat.name
      const direction = orientation[getRandomNumber(0,1)]
      const player = false
      boat.compPlaced = addBoat(boatIndex, type, direction, player, true)
    }
  })
  if($('.computer-board > .boat').length !== 17) computerBoatPos()
}

// function to get player selected position
function addPlayerBoat(e){
  if(gameInPlay === true || winner === true){
    e.preventDefault()
  } else {
    const clicked = e.type === 'click' ? true : false
    const boatIndex = $grid1.index($(e.target))
    if(selectedBoat === '' && clicked){
      displayAlertBox('Select a ship below first!', 2)
      $type.addClass('important')
    } else if (selectedBoat === '' && !clicked){
      return
    } else {
      if(clicked) $playerPrompt.hide(500)
      const type = selectedBoat
      if(boats.find(boat => boat.name === type).playerPlaced){
        if(clicked)$(`.player-board > .${type}`).removeClass(`boat ${type}`)
      }
      const direction = $directionButton.text().toLowerCase()
      addBoat(boatIndex, type, direction, true, clicked)
    }
  }
}

// function to add boats to boards. Checks for an clashes before adding boat class
function addBoat(boatIndex, type, direction, player, clicked){
  const boatArray = []
  const boatLength = boats.find(boat => boat.name === type).length
  if(direction === 'horizontal'){
    for (let i = 0 ; i < boatLength ; i++){
      boatArray.push(boatIndex + i)
    }
  } else if (direction === 'vertical') {
    for (let i = 0 ; i < boatLength ; i++){
      boatArray.push(boatIndex + (boardWidth * i))
    }
  }
  player ? board = $grid1 : board = $grid2
  if(selectionValidation(boatArray, board, boatLength, player, clicked)){
    if(clicked){
      boatArray.forEach(el => board.eq(el).addClass(`boat ${type}`))
    } else {
      removeHoverEffect()
      boatArray.forEach(el => board.eq(el).addClass('hover'))
    }
    if(player){
      boats.find(boat => boat.name === type).playerPlaced = true
      if(clicked) {
        $(`.boat-cats > .${type}`).addClass('placed')
        readyToPlay()
      }
    }
    return true
  } else {
    return false
  }
}

// validation function to check if selected element is acceptable placement
function selectionValidation (boatArray, board, boatLength){
  // check boat array vertical conditions
  if((boatArray.some(boat => boat < 0 || boat > ((boardWidth * boardWidth)-1)))){
    return false
  }
  // check boat array horizontal conditions
  if((boatArray.some(boat => boat % boardWidth === 0) && (boatArray.some(boat => boat % boardWidth === (boardWidth - 1))))){
    return false
  }
  // carried logic relating to boats already applied to the player board** could use forEach
  for (let i = 0 ; i < boatLength ; i++){
    if(board.eq(boatArray[i]).hasClass('boat')){
      return false
    }
  }
  return true
}

// function to check if game can start, all boards are positioned on the board
function readyToPlay() {
  const numberOfBoats = $('.player-board > .boat').length
  if(numberOfBoats === 17){
    $startButton.show()
  } else {
    gameInPlay = false
    playerTurn = false
    // displayAlertBox('Not enough boats placed!', 2)
  }
}

// function to start game once the Play button has been clicked by the player
function inPlay(){
  if($('.player-board > .boat').length !== 17){
    displayAlertBox('Not enough boats placed!', 2)
  } else {
    gameInPlay = true
    playerTurn = true
    playAudio('sonar')
    computerBoatPos()
    $type.removeClass('selected-boat')
    $selectorButtons.hide()
    $computerGame.show(500, 'swing')
  }
}

// function to toggle instructions between show and hide
function instructionsToggle(){
  $instructions.toggle(400, 'swing')
}

// function to remove hover effect from board
function removeHoverEffect(){
  $grid1.removeClass('hover')
}

// function to change direction of placing player boats
function toggleDirection(){
  if($directionButton.text() === 'Horizontal')  {
    $directionButton.text('Vertical')
    $directionButton.css('transform', 'rotate(90deg)')
  } else {
    $directionButton.text('Horizontal')
    $directionButton.css('transform', 'rotate(0deg)')
  }
}

function rotateShip(e){
  if(e.keyCode === 32)toggleDirection()
}

// function to update alert box with message
function displayAlertBox(string, duration){
  $popUp.text(`${string}`)
  $('.overlay').css('display', 'flex')
  setTimeout(function(){
    $('.overlay').css('display', 'none')
  }, (duration * 1000))
}

// function to play audio
function playAudio(type){
  $audio.attr('src',`./assets/audio/${type}.mp3`)
  $audio.currentTime = 0
  $audio[0].play()
}

// In play game logic---------------------------------------------------------

// check if player's click is successful or not
function checkForHit(e){
  if(playerTurn === false || winner === true){
    e.preventDefault()
  } else {
    $inPlayPrompt.hide(500)
    const cell = $grid2.index($(e.target))
    if($grid2.eq(cell).hasClass('hit') || $grid2.eq(cell).hasClass('miss')){
      return
    }
    if($grid2.eq(cell).hasClass('boat')){
      $grid2.eq(cell).addClass('hit')
      playerTotalHits++
      checkForSink(true)
      playAudio('hit')
    } else {
      $grid2.eq(cell).addClass('miss')
    }
    setTimeout(computerPlay, 1500)
  }
  playerTurn = false
}

// function for computer to randomly pick position on grid and check if match takes place
function computerPlay(){
  if(hitShip){
    hitMove()
  } else {
    nextMove = getRandomNumber(0, (boardWidth * boardWidth)-1)
    if($grid1.eq(nextMove).hasClass('boat')){
      $grid1.eq(nextMove).removeClass('boat')
      $grid1.eq(nextMove).addClass('hit')
      compTotalHits++
      hitShip = true
      compHitPosition = nextMove
      checkForSink(false)
    } else if($grid1.eq(nextMove).hasClass('hit')){
      computerPlay()
    }else if($grid1.eq(nextMove).hasClass('miss')){
      computerPlay()
    } else{
      $grid1.eq(nextMove).addClass('miss')
      $grid1.eq(nextMove).removeClass('boat')
      hitShip = false
    }
  }
  playerTurn = true
}

// Function used to calculate strategic move based on last hit position----------
function hitMove() {
  strategicHit = compHitPosition + (direction * successfulHits)
  if(!hitSuccess){
    if(onBoardCondition(strategicHit)){
      updateDirection()
      hitMove()
    } else if($grid1.eq(strategicHit).hasClass('boat')){
      compHitBoat()
    } else if ($grid1.eq(strategicHit).hasClass('hit')){
      updateDirection()
      hitMove()
    } else if ($grid1.eq(strategicHit).hasClass('miss')){
      updateDirection()
      hitMove()
    }else if(compStrikeIndex.length === 0){
      endStrategicHit()
      computerPlay()
    } else {
      updateDirection()
      $grid1.eq(strategicHit).addClass('miss')
      $grid1.eq(strategicHit).removeClass('boat')
    }
  } else if (hitSuccess){
    if ($grid1.eq(strategicHit).hasClass('miss')){
      $grid1.eq(strategicHit).addClass('miss')
      $grid1.eq(strategicHit).removeClass('boat')
      boatEndDirection()
      hitMove()
    } else if ($grid1.eq(strategicHit).hasClass('hit')){
      boatEndDirection()
      hitMove()
    } else if($grid1.eq(strategicHit).hasClass('boat')){
      compHitBoat()
    } else {
      $grid1.eq(strategicHit).addClass('miss')
      $grid1.eq(strategicHit).removeClass('boat')
      boatEndDirection()
    }
  }
  playerTurn = true
}

// function to change classes of successful elements and update next move criteria.
function compHitBoat(){
  $grid1.eq(strategicHit).removeClass('boat')
  $grid1.eq(strategicHit).addClass('hit')
  compTotalHits++
  successfulHits++
  hitSuccess = true
  checkForSink(false)
  if($grid1.eq(strategicHit).hasClass('sunk')) endStrategicHit()
}

// function to check if proposed element is off board
function onBoardCondition(element) {
  if(element < 0 || element >= boardWidth * boardWidth) return true
  if(((compHitPosition % boardWidth === 0) && (direction === -1)) || ((compHitPosition % boardWidth === (boardWidth - 1)) && (direction === 1))){
    return true
  } else {
    return false
  }
}

// function to change direction for next move based on unsucessful hit
function updateDirection(){
  compStrikeIndex = compStrikeIndex.filter(position => position !== direction)
  direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
}

// function to change direction once end of boat has been found
function boatEndDirection(){
  if(boatEnd === true){
    hitSuccess = false
    successfulHits = 1
  } else {
    boatEnd = true
    direction = -direction
    successfulHits = 1
  }
}

// function to end strategic hit mode following sinking of ship
function endStrategicHit(){
  successfulHits = 1
  boatEnd = false
  hitShip = false
  hitSuccess = false
  compStrikeIndex = [1, boardWidth, -1, -boardWidth]
}

// function to check if new hit for player or computer has sunk ships
function checkForSink(player) {
  let boardName
  let sunkBoats
  let boatsMenu
  if(player){
    boardName = '.computer-board'
    sunkBoats = 'playerSunk'
    boatsMenu = '.computer-ships'
  } else {
    boardName = '.player-board'
    sunkBoats = 'compSunk'
    boatsMenu = '.boat-cats'
  }
  boats.forEach(boat => {
    if(boat.length === $(`${boardName} > .${boat.name}.hit`).length && !boat[sunkBoats]){
      boat[sunkBoats] = true
      $(`${boardName} > .${boat.name}.hit`).addClass('sunk')
      $(`${boatsMenu} > .${boat.name}`).addClass('sunk')
      $(`${boardName}`).addClass('sunk')
      $audio2[0].pause()
      $audio2.attr('src','./assets/audio/sunk.mp3')
      $audio2.currentTime = 0
      $audio2.loop = false
      $audio2[0].play()
      checkForWin()
      if(!winner){
        const text = sunkBoats === 'playerSunk' ? `Good find! You sunk the ${boat.name}!` : `The computer is good! It found your ${boat.name}!`
        displayAlertBox(text, 2)
        return true
      }
    }
  })
}

// check to see if game has been won. All boats have been hit
function checkForWin(){
  if($('.computer-board > .hit').length === 17) displayWinner('player')
  if($('.player-board > .hit').length === 17) displayWinner('computer')
}

// function to display winner of game
function displayWinner(won){
  const text = won === 'computer' ? 'You lost this time! Click reset button above to play again...' : 'You won! Click reset button above to play again...'
  $popUp.text(`${text}`)
  $('.overlay').css('display', 'flex')
  $('.game-board').addClass('winner')
  winner = true
}
