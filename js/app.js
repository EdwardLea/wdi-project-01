$(() => {

  // Board Parameters
  const boardWidth = 10
  let compHits = 0
  let playerHits = 0
  const boatsInPlay = []
  const boats = [
    {name: 'Carrier',
    length: 5,
    compPlaced: false,
    playerPlaced: false,
    compHit: false,
    playerHit: false},
    {name: 'Battleship',
    length: 4,
    compPlaced: false,
    playerPlaced: false,
    compHit: false,
    playerHit: false},
    {name: 'Cruiser',
    length: 3,
    compPlaced: false,
    playerPlaced: false,
    compHit: false,
    playerHit: false},
    {name: 'Carrier',
    length: 3,
    compPlaced: false,
    playerPlaced: false,
    compHit: false,
    playerHit: false},
    {name: 'Carrier',
    length: 2,
    compPlaced: false,
    playerPlaced: false,
    compHit: false,
    playerHit: false},
  ]

  console.log(boats[1].length)
  const boatsArray = ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer']
  const boatLengths = [5, 4, 3, 3, 2]


  const $playerBoard = $('.playerBoard')
  const $computerBoard = $('.computerBoard')
  const $type = $('.boat-type')
  const test1 = $type.text()
  const test = boats['Carrier']

  console.log(test)

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


  // function to add boats to board
  function computerBoatPos(){
    boatsArray.forEach((boat) => {

      while (!boat.placed){
        const boatIndex = generateRandomPosition()
        const length = boat.length
        const direction = 'vertical'
        const player = false

        boat.placed = addBoat(boatIndex,length, direction, player)
      }
    })
  }

  // get player clicked position
  function getBoatInfo(e){
    const boatIndex = $grid1.index($(e.target))
    const length = boatLengths[1]
    const direction = 'vertical'
    addBoat(boatIndex, length, direction, true)
  }

  // function to randomly generate number for placement of ships and selecting hits
  function generateRandomPosition(){
    return Math.floor(Math.random() * (boardWidth * boardWidth))

  }

  function addBoat(boatIndex,length, direction, player){
    // const boatIndex = $grid1.index($(e.target))
    console.log(boatIndex)
    const boatArray = []
    // const direction = 'vertical'
    const boatLength = length
    // creates boar array based on clicked position
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
    // check boat array vertical condition
    if((boatArray.some(v => v < 0 || v > ((boardWidth * boardWidth)-1)))){
      // pick another location
      console.log('not valid space 1')
      return false
    }

    if((boatArray.some(v => v % boardWidth === 0) && (boatArray.some(v => v % boardWidth === (boardWidth - 1))))){
      // pick another location
      console.log('not valid space 1')
      return false
    }



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
  }

  function checkForHit(){

  }

  function checkforWin(){
    if(playerHits === 17) {
      // player wins
    }
    if(compHits === 17) {
      // computer wins
    }
  }



  function addClass(e){
    const cell = $grid1.index($(e.target))
    console.log(cell)
  }

  


  $grid1.on('click', getBoatInfo)






})
