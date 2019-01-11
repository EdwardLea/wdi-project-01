# WDI-Project 1
# General Assembly Project 1 : Simple front-end game

## Goal: To create a simple front-end game
### Timeframe
7 days

## Technologies used

* JavaScript (ES6) & jQuery
* HTML5 & HTML5 Audio
* CSS, CSS Animation & SCSS
* GitHub

## My Game - Battleships

A hosted version of the game can be found here ----> [edwardlea.github.io/project-01](https://edwardlea.github.io/project-01)

### Game overview
Battleships is a one player game played against the computer. Following the placement of the player's and computer's board fleet on the board, the aim of the game is to find the location of the other player's ships to sink them. The first to find all five ships wins the game.

### Game Instructions
1. The game starts with the player positioning all five ships on the grid by clicking on the ships and positioning on grid. The orientation of the ship can be changed by click the Vertical/Horizontal button or using spacebar.

![screenshot - Placement of ships](https://user-images.githubusercontent.com/39096986/51031907-01bdbb80-1596-11e9-9362-0d82b07aae44.png)

2. Once all ships have been positioned on the grid the play button will appear, this can be clicked to go into battle with the computer.

![screenshot - Start Play](https://user-images.githubusercontent.com/39096986/51031879-eb176480-1595-11e9-976e-ca95307c13fd.png)

3. The player must try to locate the computer's ships by clicking on the righthand grid. The click will return a result of hit(red) or miss(light blue). If the hit is the last remaining un-hit part of the ship the ship will be sunk shown by a dark blue on the grid. Sink ships are indicated below the retrospective grids.

![Screenshot - Play Mode](https://user-images.githubusercontent.com/39096986/51035269-5b77b300-15a1-11e9-82ca-d8dc0051c88f.png)

4. Once the player has made their guess the computer will then pick a position on the player's grid. Again the result will return a hit or miss and check for any sunk ships. Play will continue to be passed between the player and computer.

![Screenshot - Mid way through game](https://user-images.githubusercontent.com/39096986/51035605-6bdc5d80-15a2-11e9-9223-7927e319575f.png)

5. The first player to sink all the ships on the opponents board wins the game. The game can be reset using the reset button at any time during the game

![Screenshot - Win screen](https://user-images.githubusercontent.com/39096986/51034760-b01a2e80-159f-11e9-8a0a-e395434b50f3.png)

## Process

The first step in the development process was to create the two grid required to play the game. The logic was created to ensure ships were only placed in valid positions, i.e. not over the board edges and not clashing with other ships.
Once this validation was created it was used to generate the computer's ship positions as well a check the locations selected by the player. Invalid positions were not allowed to be placed. Classes were used to denote ship positions and type.

The next step was to develop the functionality for selection board positions and check for hit, miss or sink. For the player this was based on clicks on the computer's board and for the computer a randomly generated board positions. This selection was validated to ensure it had not already been hit or missed. This provided the basic functionality of the game with player and computer both able to make valid selections on the other's board.

To improve the computer's ability to sink ships once found a hit function was developed to strategic hit the ship over the next moves. The dramatically increased the chances of the computer winning as ships were sunk in the most efficient way possible.

Styling and usability functionality was then added to enhance the experience for the users. Examples include a reset button to allow the player to start the game again at any time, overlay screen display game updates and alerts to the player and a hover effect of the player's board when placing ships.

### Challenges
Creating the logic for the computer's guesses was challenging and required a number of iterations to ensure board and ship edge cases did not affect the logic of the computer's guesses. Placing the ships in valid positions only was also a challenge as all the ships had different lengths and hence had different criteria to be a successfully placement.

### Wins
The logic used to added ships was able to be reused to for both adding computer ships and player ships, as well as the hover effect on the board before ships were placed. The meant functions could be reused a number of times throughout the various

## Future features
1. The intelligence of the computer's hit becomes less reliable when ships are positioned next to each other. A further iteration to the logic could be added to improve how these cases are handled.

2. The logic of the computer selection is only intelligent once a hit has been made. Further functionality could be added before hits are made. For example not selecting random locations where it would be impossible for any of the ships to be positioned.

3. A two player version of the game could be created in a play and pass capacity.
