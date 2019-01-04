$(() => {

  // Board Parameters----------------------------------------------------------
  const boardWidth = 10
  let compHits = 0
  let playerHits = 0
  let selectedBoat = ''
  const boatsInPlay = []
  const orientation = ['vertical','horizontial']
  const boats = [
    {name: 'carrier',
    length: 5,
    compPlaced: false,
    playerPlaced: true,
    compHits: 0,
    playerHits: 0,
    compSunk: false,
    playerSunk: false},
    {name: 'battleship',
    length: 4,
    compPlaced: false,
    playerPlaced: false,
    compHits: 0,
    playerHits: 0,
    compSunk: false,
    playerSunk: false},
    {name: 'cruiser',
    length: 3,
    compPlaced: false,
    playerPlaced: false,
    compHits: 0,
    playerHits: 0,
    compSunk: false,
    playerSunk: false},
    {name: 'submarine',
    length: 3,
    compPlaced: false,
    playerPlaced: false,
    compHits: 0,
    playerHits: 0,
    compSunk: false,
    playerSunk: false},
    {name: 'destroyer',
    length: 2,
    compPlaced: false,
    playerPlaced: false,
    compHits: 0,
    playerHits: 0,
    compSunk: false,
    playerSunk: false},
  ]

  const boatsArray = ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer']
  const boatLengths = [5, 4, 3, 3, 2]

  // DOM elements-----------------------------------------------------------------

  const $playerBoard = $('.playerBoard')
  const $computerBoard = $('.computerBoard')
  const $type = $('.boat-type')

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

  // adding value attribute to each div


  // Functions--------------------------------------------------------------------

  // function to randomly generate number for placement of ships and selecting hits

  function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  // function to add computers boats to board
  function computerBoatPos(){
    boats.forEach((boat) => {
      while (!boat.placed){
        const boatIndex = getRandomNumber(0, boardWidth*boardWidth)
        const type = boat.name
        const direction = orientation[getRandomNumber(0,1)]
        const player = false
        boat.placed = addBoat(boatIndex,type, direction, player)
      }
    })
  }

  computerBoatPos()

  // get player clicked position
  function addPlayerBoat(e){
    const boatIndex = $grid1.index($(e.target))
    const type = selectedBoat
    if(boats.find(boat => boat.name === type).playerPlaced){
      alert('place again?')
    }
    const direction = 'vertical'
    addBoat(boatIndex, type, direction, true)
  }



  function addBoat(boatIndex, type, direction, player){
    const boatArray = []
    const boatLength = boats.find(boat => boat.name === type).length
    // creates boar array based on clicked position and orientation
    if(direction === 'horizontial'){
      for (let i = 0 ; i < boatLength ; i++){
        boatArray.push(boatIndex + i)
      }
    } else if (direction === 'vertical') {
      for (let i = 0 ; i < boatLength ; i++){
        boatArray.push(boatIndex + (boardWidth * i))
      }
    }
    console.log(boatArray)

    // validation function
    // selectionValidation (boatArray, player)
    // check boat array vertical condition
    if((boatArray.some(v => v < 0 || v > ((boardWidth * boardWidth)-1)))){
      console.log('not valid space 1')
      return false
    }
    // check boat array horizontial condition
    if((boatArray.some(v => v % boardWidth === 0) && (boatArray.some(v => v % boardWidth === (boardWidth - 1))))){
      console.log('not valid space 1')
      return false
    }

    // carried logic relating to boats already applied to the player board
    if(player){
      for (let i = 0 ; i < boatLength ; i++){
        console.log()
        if($grid1.eq(boatArray[i]).hasClass('boat')){
          console.log('has a class already')
          return false
        }
      }
      console.log('valid space')
      // Add boat class to each element in boatArray

      boatArray.forEach(el => {
        $grid1.eq(el).addClass('boat')
      })

      // boats.find(boat => boat.name === type).length
      // carried logic relating to boats already applied to the computer board
    } else {
      // check if any element has class of boatArray
      for (let i = 0 ; i < boatLength ; i++){
        console.log()
        if($grid2.eq(boatArray[i]).hasClass('boat')){
          console.log('has a class already')
          return false
        }
      }
      console.log('valid space')
      // Add boat class to each element in boatArray

      boatArray.forEach(el => {
        $grid2.eq(el).addClass('boat')
      })
    }
    return true
  }

  // check if players click is located on a boat
  function checkForHit(e){
    console.log('checking')
    const cell = $grid2.index($(e.target))
    console.log(cell)
    if($grid2.eq(cell).hasClass('boat')){
      console.log('boat')
    }
    // check if class hit already added
    // add class of hit to div
    // increment number of player hits

    checkForWin()
  }

  // function for computer to pick position on grid and check if match takes place
  function computerPlay(){
    // was last go a hit?
    // add more intellience to guessing
    // if so next go must be within 1 square
    // if not random position to be selected
    // check if class hit already added
    // add class of hit to div
    // increment number of player hits

    checkForSink()

    checkForWin()
  }

  // function to check if new hit has sunk ships
  // if ship has sunk change class and update array
  function checkForSink() {

  }

  // check to see if game has been won. All boats have been hit
  function checkForWin(){
    if(playerHits === 17) {
      // player wins
    }
    if(compHits === 17) {
      // computer wins
    }
  }



  function addType(e){
    selectedBoat = e.target.dataset.boat
    console.log(selectedBoat)
  }




  $grid1.on('click', addPlayerBoat)
  $grid2.on('click', checkForHit)
  $type.on('click', addType)






})
