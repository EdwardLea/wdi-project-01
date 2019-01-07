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
  let hitAttempts = 0
  let compHitPosition = 0
  let nextMove = 0
  let selectedBoat = ''
  let winner = false
  const compStrikeIndex = [1,-1, boardWidth, -boardWidth]
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
  $instructions.hide()
  $resetButton.hide()

  // FUNCTIONS--------------------------------------------------------------------

  // Functions to set boat positions for computer and player--------------------

  // function to randomly generate number for placement of ships and selecting hits
  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  // function to find selected boat from menu
  function selectBoatType(e){
    selectedBoat = e.target.dataset.boat
    $type.removeClass('selected-boat')
    $(e.target).addClass('selected-boat')
    $resetButton.show()
  }

  function instructionsToggle(){
    $instructions.toggle()
  }

  // function to change direction of placing player boats
  function toggleDirection(e){
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
    console.log($('.computer-board > .boat').length)
    if($('.computer-board > .boat').length !== 17){
      console.log('not enough comp boats!')
      computerBoatPos()
    }
  }

  // function to get player selected position
  function addPlayerBoat(e){
    if(gameInPlay === true){
      e.preventDefault()
    } else{
      const boatIndex = $grid1.index($(e.target))
      if(selectedBoat === ''){
        alert('Select a boat first!')
        return
      } else {
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
    // check if all ships have been place
    const numberOfBoats = $('.player-board > .boat').length
    if(numberOfBoats === 17){
      console.log('ready to play')
      gameInPlay = true
      playerTurn = true
      computerBoatPos()
      $type.removeClass('selected-boat')
      $selectorButtons.hide()

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
    } else{
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
      // increment number of player hits
      console.log(`Player Hits: ${playerTotalHits}`)
    }
  }

  // function for computer to pick position on grid and check if match takes place
  function computerPlay(){
    console.log({compHitPosition})
    if(hitShip){
      hitMove()
    } else{
      nextMove = getRandomNumber(0, (boardWidth * boardWidth)-1)
      console.log(nextMove)
      if($grid1.eq(nextMove).hasClass('boat')){
        console.log('comp hit')
        $grid1.eq(nextMove).removeClass('boat')
        $grid1.eq(nextMove).addClass('hit')
        compTotalHits++
        hitShip = true
        compHitPosition = nextMove
        checkForSink(false)
        console.log(`Comp Hits: ${compTotalHits}`)
      } else if($grid1.eq(nextMove).hasClass('hit')){
        console.log('You have already hit here')
        computerPlay()
      }else if($grid1.eq(nextMove).hasClass('miss')){
        console.log('You have already hit here')
        computerPlay()
      } else{
        $grid1.eq(nextMove).addClass('miss')
        $grid1.eq(nextMove).removeClass('boat')
        hitShip = false
      }
      checkForWin()
    }
    playerTurn = true
  }


  // Function used to calculate strategic move based on last hit position
  function hitMove() {
    console.log(`hit Attempts: ${hitAttempts}`)
    // check Attempts is less than 4
    if(hitAttempts > 3) {
      // if greater than 4 make hit = false and run computer play
      hitShip = false
      hitAttempts = 0
      computerPlay()
    } else {
      // if less than 4 make move index based on compHitPosition
      const strategicHit = compHitPosition + compStrikeIndex[hitAttempts]
      // check if cell has a class of hit or Miss
      if($grid1.eq(strategicHit).hasClass('miss') || $grid1.eq(strategicHit).hasClass('hit')){
        // if it does increment attempts and run hitMove again
        hitAttempts++
        hitMove()
      } else {
        // if not carry out hit, if successful run hitMove again
        if($grid1.eq(strategicHit).hasClass('boat')){
          console.log('comp hit')
          $grid1.eq(strategicHit).removeClass('hit')
          $grid1.eq(strategicHit).addClass('hit')
          hitAttempts = 0
          compTotalHits++
          compHitPosition = strategicHit
          checkForSink(false)
          console.log(`Comp Hits: ${compTotalHits}`)
        } else {
          $grid1.eq(strategicHit).removeClass('hit')
          $grid1.eq(strategicHit).addClass('miss')
          hitAttempts++
        }
      }
    }
  }

  // function to check if new hit for player or computer has sunk ships
  function checkForSink(player) {
    let boardName
    let sunkBoats
    if(player){
      boardName = '.computer-board'
      sunkBoats = 'playerSunk'
    } else {
      boardName = '.player-board'
      sunkBoats = 'compSunk'
    }
    boats.forEach(boat => {
      console.log($(`${boardName} > .${boat.name}.hit`).length)
      if(boat.length === $(`${boardName} > .${boat.name}.hit`).length){
        if(!boat[sunkBoats]){
          console.log(`${sunkBoats}sunk boat is a ${boat.name}!`)
          boat[sunkBoats] = true
          $(`${boardName} > .${boat.name}.hit`).addClass('sunk')

        }
      }
    })
  }

  // check to see if game has been won. All boats have been hit
  function checkForWin(){
    if($('.computer-board > .hit').length === 17) {
      alert('You win!')
      winner = true
    }
    if($('.player-board > .hit').length === 17) {
      alert('Computer win!')
      winner = true
    }
  }

  function startGame(){
    clearBoard()
    $selectorButtons.show()
    $resetButton.hide()
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
  }

  function clearBoard(){
    $grid1.removeClass()
    $grid2.removeClass()
  }

  // Event Listeners------------------------------------------------------------

  $grid1.on('click', addPlayerBoat)
  $grid2.on('click', checkForHit)
  $type.on('click', selectBoatType)
  $startButton.on('click', readyToPlay)
  $directionButton.on('click', toggleDirection)
  $resetButton.on('click', startGame)
  $instructionButtons.on('click',instructionsToggle)







})
