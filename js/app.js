$(() => {init()})

//  PARAMETERS----------------------------------------------------------
// Board Parameters
const boardWidth = 10

// Game Parameters
let gameInPlay = false
let playerTurn = false
let playerTotalHits = 0
let compTotalHits = 0
let board = ''
let hitShip = false
let hitSuccess = false
let successfulHits = 1
let compHitPosition = 0
let strategicHit = 0
let nextMove = 0
let selectedBoat = ''
let winner = false
let compStrikeIndex = [1, boardWidth, -1, -boardWidth]
let direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
const orientation = ['vertical','horizontial']
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



// FUNCTIONS--------------------------------------------------------------------

// Functions to set boat positions for computer and player--------------------

// function to randomly generate number for placement of ships and selecting hits
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

// function to find selected boat from menu
function selectBoatType(e){
  selectedBoat = e.currentTarget.dataset.boat
  $(e.currentTarget).removeClass('placed')
  $type.removeClass('selected-boat')
  $(e.currentTarget).addClass('selected-boat')
  $resetButton.show()

}

// function  to toggle instruction show and hide
function instructionsToggle(){
  $instructions.toggle(400, 'swing')
}

// function to change direction of placing player boats
function toggleDirection(e){
  // ************************
  // e.currentTarget.innerText === 'Horizontial' ? $directionButton.text('Vertical') : $directionButton.text('Horizontial')

  if(e.currentTarget.innerText === 'Horizontial'){
    $directionButton.text('Vertical')
  } else {
    $directionButton.text('Horizontial')
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
  if($('.computer-board > .boat').length !== 17){
    computerBoatPos()
  }
}

// function to get player selected position
function addPlayerBoat(e){
  if(gameInPlay === true){
    e.preventDefault()
  } else {
    let clicked
    if(e.type === 'click'){
      clicked = true
    }else{
      clicked = false
    }
    const boatIndex = $grid1.index($(e.target))
    if(selectedBoat === '' && clicked){
      displayAlertBox('Select a boat first!')
      $type.addClass('important')
    } else if(selectedBoat === '' && !clicked){
      return
    }else {
      $playerPrompt.hide(500)
      const type = selectedBoat
      if(boats.find(boat => boat.name === type).playerPlaced){
        if(clicked){
          $(`.player-board > .${type}`).removeClass('boat')
          $(`.player-board > .${type}`).removeClass(`${type}`)
        }
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
  // creates boat array based on clicked position and orientation
  if(direction === 'horizontial'){
    for (let i = 0 ; i < boatLength ; i++){
      boatArray.push(boatIndex + i)
    }
  } else if (direction === 'vertical') {
    for (let i = 0 ; i < boatLength ; i++){
      boatArray.push(boatIndex + (boardWidth * i))
    }
  }

  player ? board = $grid1 : board = $grid2

  // add class to boat elements based on validation result
  if(selectionValidation(boatArray, board, boatLength, player, clicked)){
    if(clicked){
      boatArray.forEach(el => board.eq(el).addClass(`boat ${type}`))
    } else{
      removeHoverEffect()
      boatArray.forEach(el => board.eq(el).addClass('hover'))
    }
    if(player){
      boats.find(boat => boat.name === type).playerPlaced = true
      $(`.boat-cats > .${type}`).addClass('placed')
    }
    return true
  } else {
    return false
  }
}

function removeHoverEffect(){
  $grid1.removeClass('hover')
}

// validation function to check if selected element is acceptable
function selectionValidation (boatArray, board, boatLength, player){
  // check boat array vertical conditions
  if((boatArray.some(boat => boat < 0 || boat > ((boardWidth * boardWidth)-1)))){
    return false
  }
  // check boat array horizontial conditions
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

// function to check if game can start
function readyToPlay() {
  const numberOfBoats = $('.player-board > .boat').length
  if(numberOfBoats === 17){
    gameInPlay = true
    playerTurn = true
    playAudio('sonar', 3)
    computerBoatPos()
    $type.removeClass('selected-boat')
    $selectorButtons.hide()
    $computerGame.show(500)
  } else {
    gameInPlay = false
    playerTurn = false
    displayAlertBox('Not enough boats placed!')
    return
  }
}

// In play game logic---------------------------------------------------------

// check if players click is located on a boat
function checkForHit(e){
  if(playerTurn === false || winner === true){
    e.preventDefault()
  } else {
    $inPlayPrompt.hide(500)
    const cell = $grid2.index($(e.target))
    // check if class hit already added
    if($grid2.eq(cell).hasClass('hit') || $grid2.eq(cell).hasClass('miss')){
      return
    }
    if($grid2.eq(cell).hasClass('boat')){
      $grid2.eq(cell).addClass('hit')
      playerTotalHits++
      checkForSink(true)
      checkForWin()
      playAudio('hit',3)
    } else {
      $grid2.eq(cell).addClass('miss')
      computerPlay(e)
    }
  }
}

function playAudio(type,duration=10){
  $audio[0].pause()
  $audio.attr('src',`./assets/audio/${type}.mp3`)
  $audio.currentTime = 0
  $audio.loop = false
  $audio[0].play()
  setTimeout(() => $audio[0].pause(),(duration * 1000))
}

// function for computer to pick position on grid and check if match takes place
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
      checkForWin()
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

// Function used to calculate strategic move based on last hit position
function hitMove() {
  strategicHit = compHitPosition + (direction * successfulHits)
  if(!hitSuccess){
    if(onBoardCondition(strategicHit)){
      // check for edge conditions
      console.log('you have hit an edge')
      updateDirection()
      hitMove()
    } else if($grid1.eq(strategicHit).hasClass('boat')){
      console.log('computer hit successfully')
      compHitBoat()
      // if strategic hit has a move
    } else if ($grid1.eq(strategicHit).hasClass('hit')){
      console.log('You have already hit here')
      updateDirection()
      hitMove()
    } else if ($grid1.eq(strategicHit).hasClass('miss')){
      console.log('You have already missed here')
      updateDirection()
      hitMove()
    } else {
      console.log('Computer missed')
      updateDirection()
      $grid1.eq(strategicHit).addClass('miss')
      $grid1.eq(strategicHit).removeClass('boat')
    }
  } else if (hitSuccess){
    if ($grid1.eq(strategicHit).hasClass('miss')){
      console.log('The end of the boat has been found with a miss')
      $grid1.eq(strategicHit).addClass('miss')
      $grid1.eq(strategicHit).removeClass('boat')
      boatEndDirection()
      hitMove()
    } else if ($grid1.eq(strategicHit).hasClass('hit')){
      console.log('The end of the boat has been found with a hit')
      boatEndDirection()
      hitMove()
    } else if($grid1.eq(strategicHit).hasClass('boat')){
      console.log('computer hit successfully following finding ')
      compHitBoat()
    } else {
      console.log('The end of the boat has been found with nothing')
      $grid1.eq(strategicHit).addClass('miss')
      $grid1.eq(strategicHit).removeClass('boat')
      boatEndDirection()
    }
  }
  checkForWin()
  playerTurn = true
}

function compHitBoat(){
  $grid1.eq(strategicHit).removeClass('boat')
  $grid1.eq(strategicHit).addClass('hit')
  compTotalHits++
  successfulHits++
  hitSuccess = true
  checkForSink(false)
  if($grid1.eq(strategicHit).hasClass('sunk')){
    endStrategicHit()
  }
}

// functiion to check if element is off board
function onBoardCondition(element) {
  if(element < 0 || element >= boardWidth * boardWidth){
    return true
  }
  if(((compHitPosition % boardWidth === 0) && (direction === -1)) || ((compHitPosition % boardWidth === (boardWidth - 1)) && (direction === 1))){
    return true
  } else {
    return false
  }
}

// function to change direction
function updateDirection(){
  compStrikeIndex = compStrikeIndex.filter(position => position !== direction)
  direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
}

// function to change direction once end of boat has been found
function boatEndDirection(){
  direction = -direction
  successfulHits = 1
}

// function to end strategic hit mode following sunking of ship
function endStrategicHit(){
  console.log('computer sunk boat')
  successfulHits = 1
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
      $('.overlay').css('display', 'flex')
      setTimeout(function(){
        $('.overlay').css('display', 'none')
      }, 2000)
      return true
    }
  })
}

// check to see if game has been won. All boats have been hit
function checkForWin(){
  if($('.computer-board > .hit').length === 17) {
    displayWinner('player')
  }
  if($('.player-board > .hit').length === 17) {
    displayWinner('computer')
  }
}
// function to display winner of game
function displayWinner(won){
  let text
  if(won === 'computer'){
    text ='You lost this time! Click reset button below to play again...'
  } else {
    text = 'You won! Click reset button below to play again...'
  }
  displayAlertBox(text)
  $('.game-board').addClass('winner')
  $resultDisplay.show()
  winner = true
}
// function to update alert box with message
function displayAlertBox(string){
  $popUp.text(`${string}`)
  $('.overlay').css('display', 'flex')
  setTimeout(function(){
    $('.overlay').css('display', 'none')
  }, 2000)
}

function startGame(){
  clearBoard()
  $selectorButtons.show()
  $resetButton.hide()
  $resultDisplay.hide()
  $computerGame.hide()
  $inPlayPrompt.show()
  $playerPrompt.show()
  $instructions.hide()
  $type.removeClass('selected-boat')
  $type.removeClass('placed')
  $('.computer-ships > div').removeClass('sunk')
  $('.boat-cats > div').removeClass('sunk')
  boats = boatsTemplate.map(boat => Object.assign({}, boat))
  gameInPlay = false
  playerTurn = false
  playerTotalHits = 0
  compTotalHits = 0
  board = ''
  compHitPosition = 0
  winner = false
  nextMove = 0
  selectedBoat = ''
  successfulHits = 1
  hitShip = false
  hitSuccess = false
  compStrikeIndex = [1, boardWidth, -1, -boardWidth]
}

function clearBoard(){
  $grid1.removeClass()
  $grid2.removeClass()
}

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

  // Event Listeners------------------------------------------------------------
  $grid1.on('click', addPlayerBoat)
  $grid1.on('mousemove', addPlayerBoat)
  $grid1.on('mouseleave', removeHoverEffect)
  $grid2.on('click', checkForHit)
  $type.on('click', selectBoatType)
  $startButton.on('click', readyToPlay)
  $directionButton.on('click', toggleDirection)
  $resetButton.on('click', startGame)
  $instructionButtons.on('click',instructionsToggle)
}
