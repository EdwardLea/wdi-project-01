# WDI-Project1
# General Assembly Project 1 : Simple front-end game

## Goal: To create a single page game
### Timeframe
7 days

## Technologies used

* JavaScript (ES6) + jQuery
* HTML5 + HTML5 Audio
* CSS, CSS Animation & SCSS
* GitHub

## My Game - Battleships



You can find a hosted version here ----> [edwardlea.github.io/project-01](https://edwardlea.github.io/project-01)

### Game overview
Battleships is a one player game played against the computer. Following the placement of the player's and computer's fleet the aim of the game is to find the location of the other player's ships. The first to find all five ships wins the game.




### Controls
- Submarine movements: ← ↑ → ↓ keys
- Start game: "Start" button or pressing "D"
- End game: "End Game" button or pressing "S"
- Toggle mute: Speaker Icon or pressing "Q"

### Game Instructions
1. The game starts with the player positioning all five ships on the grid by clicking on the boats and positioning on grid. The orientation of the boat can be changed by click the Vertical/Horizontal button or using spacebar.

![screenshot - Placement of ships](https://user-images.githubusercontent.com/39096986/51031907-01bdbb80-1596-11e9-9362-0d82b07aae44.png)

2. Once all boats have been positioned the Play button will appear and can be clicked to go into battle with the computer.

![screenshot - ](https://user-images.githubusercontent.com/39096986/51031879-eb176480-1595-11e9-976e-ca95307c13fd.png)

3. Points are gained when the submarine is moved into a fish or other marine life. This 'captures' the specimen and points are gained. The fishes are randomly spawned and each type of fish has different movement patterns. Different types of fish are spawned at different levels and at different probabilities. Generally the fish with higher score values are only spawned at the lower depths and spawned less frequently.

![screenshot - Fish types](https://user-images.githubusercontent.com/40343797/45220971-e53c0a80-b2a7-11e8-9942-714db52793d9.png)

4. If the submarine moves into an underwater mine, the mine will explode. This deducts an amount from your remaining Air Supply.

![screenshot - Mines](https://user-images.githubusercontent.com/40343797/45220908-b4f46c00-b2a7-11e8-9460-2a4dee40d0ae.png)

5. Your Air Supply is shown in the air tank on the left of the screen. You must return to the surface before the Air Supply runs out. If you do not return to the surface before your Air Supply runs out, the game will end and your points will be lost. A beeping sound and flashing Air Supply will warn you when your Air Supply is running low.

![screenshot - End Modal Successful](https://user-images.githubusercontent.com/40343797/45221008-04d33300-b2a8-11e8-999e-62b50286c8ec.png)

## Process

The first step in the development process was to create the two grid required to play the game. The logic was created to ensure ships were only placed in valid positions, i.e. not over the board edges and not clashing with other ships.
Once this validation was created it was used to generate the computer's ship positions as well a check the locations selected by the player. Invalid positions were not allowed to be placed. Classes were used to denote ship positions and type.

The next step was to develop the functionality for selection board positions and check for hit, miss or sink. For the player this was based on clicks on the computer's board and for the computer a randomly generated board positions. This selection was validated to ensure it had not already been hit or missed. This provided the basic functionality of the game with player and computer both able to make valid selections on the other's board.

To improve the computer's ability to sink ships once found a hit function was developed to strategic hit the ship over the next moves. The dramatically increased the chances of the computer winning as ships were sunk in the most efficient way possible.

Styling and usability functionality was then added to enhance the experience for the users. Examples include a reset button to allow the player to start the game again at any time, overlay screen display game updates and alerts to the player and a hover effect of the player's board when placing ships.

### Challenges
Creating the logic for the computer's guesses was challenging and required a number of interactions to ensure board and ship edge cases did not affect the logic of the computer's guesses.

### Wins
The logic used to added ships was able to be reused to for both adding computer boats and player boats, as well as the hover effect on the board before boats were placed.

## Future features
The official rules of Battleships do not allow ships to touch when placed. The current game does not take this into account, this could be added in future iterations of the game.
The logic of the computer selection is only intelligent once a hit has been made. Further functionality could be added before hits are made. For example not selecting random locations where it would be impossible for any of the boats to be positioned.
A two player version of the game could be created in a play and pass capacity.
