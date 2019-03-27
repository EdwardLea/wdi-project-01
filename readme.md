# General Assembly Project 1 : Simple frontend browser game

## Goal: To create a simple frontend browser game
### Timeframe
7 days

## Technologies used

* HTML5 & HTML5 Audio
* JavaScript (ES6) & jQuery
* CSS3, CSS Animation & SCSS
* Git & GitHub

## My Game - Battleships

A hosted version of the game can be found here ----> [edwardlea.github.io/project-01](https://edwardlea.github.io/project-01)

### Game overview
Battleships is a one player game played against the computer. Following the placement of the player's and computer's fleet on the board, the aim of the game is to locate the opponents ships to sink them. The first to find all five ships wins the game.

### Game Instructions
1. The game starts with the player positioning all five ships on the grid by clicking on the ships below the board and positioning them on grid. The orientation of the ship can be changed by click the Vertical/Horizontal button or using spacebar.

![screenshot - Placement of ships](https://user-images.githubusercontent.com/39096986/51031907-01bdbb80-1596-11e9-9362-0d82b07aae44.png)

2. Once all ships have been positioned on the grid the 'Play' button will appear, this can be clicked to go into battle with the computer.

![screenshot - Start Play](https://user-images.githubusercontent.com/39096986/51031879-eb176480-1595-11e9-976e-ca95307c13fd.png)

3. The player must try to locate the computer's ships by clicking on the righthand grid to hit elements of the ships. The click will return a result of hit(red) or miss(light blue). If the hit is the last remaining un-hit part of the ship the ship will be sunk shown by a dark blue on the grid. Sunk ships are also indicated below the retrospective grids.

![Screenshot - Play Mode](https://user-images.githubusercontent.com/39096986/51035269-5b77b300-15a1-11e9-82ca-d8dc0051c88f.png)

4. Once the player has made their guess the computer will then pick a position on the player's grid. Again the result will return a hit or miss and check for any sunk ships. Play will continue to be passed between the player and computer.

![Screenshot - Mid way through game](https://user-images.githubusercontent.com/39096986/51035605-6bdc5d80-15a2-11e9-9223-7927e319575f.png)

5. The first player to sink all the ships on the opponents board wins the game. The game can be reset using the reset button once the game is over or at any time during the game.

![Screenshot - Win screen](https://user-images.githubusercontent.com/39096986/51034760-b01a2e80-159f-11e9-8a0a-e395434b50f3.png)

## Process
The first step in the development process was to create the two grids required to play the game. Logic was created to ensure ships were only placed in valid positions, i.e. not over the edge of the board and not clashing with other placed ships.

The validation logic was used to generate the computer's ship positions as well a check the locations selected by the player. Invalid positions were not allowed to be placed. Classes were added to grid elements to denote ship positions and type.

The next step was to develop the functionality for selecting board positions and checking for hit, miss or sink. For the player this was based on clicking on the computer's board and for the computer a randomly generated board positions. This selection was validated to ensure it had not already been hit or missed. This provided the basic functionality of the game with the player and computer both able to make valid selections on the opponents board.

To improve the computer's ability to sink ships once a hit had taken place, a function was add to strategically find the remaining parts of the ship over the next moves. This  increased the chances of the computer winning as ships were sunk in a more efficient way.

Styling and usability functionality was then added to enhance the experience for the users. Examples include a reset button to allow the player to start the game again at any time, overlay screen displaying game updates and a hover effect of the player's board when placing ships.

### Challenges
Creating the logic for the computer's turn was challenging and required a number of iterations to ensure board and ship edge cases did not affect the logic of the computer's turn. Placing the ships in valid positions only was also a challenge as all the ships had different lengths and hence had different criteria to be a successfully placement.

![Screenshot - Code snip](https://user-images.githubusercontent.com/39096986/54834187-912ecb80-4cb7-11e9-8700-911469ea49d3.png)

### Wins

The logic used to add ships (shown in above code snippit) was able to be reused to for both adding computer ships and player ships, as well as the hover effect on the board before ships were placed.

Being able to reuse functions multiple times made the code easier to understand and work with. Another example of a function I built and used throughout the programme was the simple display message function. This took two arguments; a string and duration to display a popup message to display information to the user. This was reused throughout the code where the message and duration were passed in as arguments to create custom messages.

![Screenshot - Code snip](https://user-images.githubusercontent.com/39096986/55058875-399cb100-5065-11e9-87a1-b68861534a5f.png)


## Future features
1. The intelligence of the computer's hit becomes less reliable when ships are positioned next to each other. A further iteration to the logic could be added to improve how these cases are handled.

2. The logic of the computer selection is only intelligent once a hit has been made. Further functionality could be added before hits are made. For example not selecting random locations where it would be impossible for any of the ships to be positioned.

3. A two player version of the game could be created in a play and pass capacity.
