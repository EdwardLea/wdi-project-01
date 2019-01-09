$(() => {

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
  let compStrikeIndex = [1, 10, -1, -10]
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

  const $playerBoard = $('.player-board')
  const $computerBoard = $('.computer-board')
  const $type = $('.boat-type')
  const $startButton = $('.start-game')
  const $directionButton = $('.direction-button')
  const $resetButton = $('.reset-game')
  const $selectorButtons = $('.selectors')
  const $instructionButtons = $('.instructions-button')
  const $instructions = $('.instructions')
  const $imagesDiv = $('.image')
  const $resultDisplay = $('.results')
  const $popUp = $('.text-box.message')
  const $computerGame = $('.computer-area')
  const $playerPrompt = $('.prompt')
  const $inPlayPrompt = $('.prompt-in-play')
  const $audio = $('#sound')


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
  const $grid1 = $playerBoard.find('div')

  // adding board elements to computers board
  for(let i = 0; i<boardWidth*boardWidth; i++) {
    $computerBoard.append($('<div />'))
  }
  const $grid2 = $computerBoard.find('div')

  // start display options
  $instructions.hide()
  $resultDisplay.hide()
  $resetButton.hide()
  $computerGame.hide()

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
        boat.compPlaced = addBoat(boatIndex, type, direction, player)
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
      const boatIndex = $grid1.index($(e.target))
      if(selectedBoat === ''){
        alert('Select a boat first!')
        $playerPrompt.addClass('important')
        return
      } else {
        $playerPrompt.hide(500)
        const type = selectedBoat
        if(boats.find(boat => boat.name === type).playerPlaced){
          $(`.player-board > .${type}`).removeClass('boat')
          $(`.player-board > .${type}`).removeClass(`${type}`)
        }
        const direction = $directionButton.text().toLowerCase()
        addBoat(boatIndex, type, direction, true)
      }
    }
  }

  // function to add boats to boards. Checks for an clashes before adding boat class
  function addBoat(boatIndex, type, direction, player){
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
    if(selectionValidation(boatArray, board, boatLength, player)){
      boatArray.forEach(el => board.eq(el).addClass(`boat ${type}`))
      if(player){
        boats.find(boat => boat.name === type).playerPlaced = true
        $(`.boat-cats > .${type}`).addClass('placed')
      }
      return true
    } else {
      return false
    }
  }

  // validation function to check if selected element is acceptable
  function selectionValidation (boatArray, board, boatLength, player){
    // check boat array vertical conditions
    if((boatArray.some(v => v < 0 || v > ((boardWidth * boardWidth)-1)))){
      return false
    }
    // check boat array horizontial conditions
    if((boatArray.some(v => v % boardWidth === 0) && (boatArray.some(v => v % boardWidth === (boardWidth - 1))))){
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
      console.log('ready to play')
      gameInPlay = true
      playerTurn = true
      $audio.attr('src','./assets/audio/sonar.mp3')
      $audio[0].play()
      computerBoatPos()
      $type.removeClass('selected-boat')
      $selectorButtons.hide()
      $computerGame.show(500)
    } else {
      console.log('not ready to play')
      gameInPlay = false
      playerTurn = false
      alert('Not enough boats placed!')
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
      } else {
        $grid2.eq(cell).addClass('miss')
        computerPlay(e)
      }
    }
  }

  // function for computer to pick position on grid and check if match takes place
  function computerPlay(){
    // console.log({compHitPosition})
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
    console.log(strategicHit)
    if(onBoardCondition(strategicHit)){
      console.log('you have hit an edge')
      compStrikeIndex = compStrikeIndex.filter(position => position !== direction)
      direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
      hitMove()
    } else {
      if($grid1.eq(strategicHit).hasClass('boat')){
        console.log('computer hit successfully')
        $grid1.eq(strategicHit).removeClass('boat')
        $grid1.eq(strategicHit).addClass('hit')
        compTotalHits++
        successfulHits++
        hitSuccess = true
        checkForSink(false)
        if($grid1.eq(strategicHit).hasClass('sunk')){
          console.log('computer sunk boat')
          successfulHits = 1
          hitShip = false
          hitSuccess = false
          compStrikeIndex = [1, boardWidth, -1, -boardWidth]
        }
        // if strategic hit has a move
      } else if ($grid1.eq(strategicHit).hasClass('hit')){
        console.log(compStrikeIndex)
        compStrikeIndex = compStrikeIndex.filter(position => position !== direction)
        direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
        console.log(compStrikeIndex)
        console.log('You have already hit here')
        hitMove()
      } else if ($grid1.eq(strategicHit).hasClass('miss')){
        console.log('You have already missed here')
        compStrikeIndex = compStrikeIndex.filter(position => position !== direction)
        console.log(compStrikeIndex)
        direction = compStrikeIndex[getRandomNumber(0, compStrikeIndex.length-1)]
        console.log(direction)
        hitMove()
      } else {
        if (hitSuccess){
          console.log('The end of the boat has been found')
          $grid1.eq(strategicHit).addClass('miss')
          $grid1.eq(strategicHit).removeClass('boat')
          direction = -direction
          successfulHits = 1
        } else {
          console.log('')
          $grid1.eq(strategicHit).addClass('miss')
          $grid1.eq(strategicHit).removeClass('boat')
          hitSuccess = false
        }

      }
    }
    checkForWin()
    playerTurn = true
  }


  // functiion to check if element is off board
  function onBoardCondition(element) {
    if(element < 0 || element >= boardWidth * boardWidth){
      return true
    } else {
      return false
    }
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

      // **********************
      // winner = true
      // $('.game-board').addClass('winner')
      // $resultDisplay.text('You won! Click reset button below to play again...')
      // $resultDisplay.show()
    }
    if($('.player-board > .hit').length === 17) {
      displayWinner('computer')

      // *****************************
      // winner = true
      // $('.game-board').addClass('winner')
      // $resultDisplay.text('You lost this time! Click reset button below to play again...')
      // $resultDisplay.show()
    }
  }

  function displayWinner(winner){
    if(winner === 'computer'){
      $popUp.text('You lost this time! Click reset button below to play again...')
      $('.overlay').css('display', 'flex')
      setTimeout(function(){
        $('.overlay').css('display', 'none')
      }, 2000)
    } else {
      $popUp.text('You won! Click reset button below to play again...')
      $('.overlay').css('display', 'flex')
      setTimeout(function(){
        $('.overlay').css('display', 'none')
      }, 2000)
    }
    winner = true
    $('.game-board').addClass('winner')
    $resultDisplay.show()
  }

  function startGame(){
    clearBoard()
    $selectorButtons.show()
    $resetButton.hide()
    $resultDisplay.hide()
    $computerGame.hide()
    $inPlayPrompt.show()
    $playerPrompt.show()
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
    hitShip = false
    hitAttempts = 0
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

  // Event Listeners------------------------------------------------------------

  $grid1.on('click', addPlayerBoat)
  $grid1.on('mouseover', )
  $grid2.on('click', checkForHit)
  $type.on('click', selectBoatType)
  $startButton.on('click', readyToPlay)
  $directionButton.on('click', toggleDirection)
  $resetButton.on('click', startGame)
  $instructionButtons.on('click',instructionsToggle)







})
