# getXpaths
A playwright javascript library that returns multiple relative xpaths of a web element

## Setup
Follow the steps to setup the project
#### Install NodeJS
Node JS can be downloaded from the following link - https://nodejs.org/en/download
#### Install Visual Studio Code
VS Code is my preferred IDE for playwright projects. But any other IDE is fine.
#### Install Playwright
1. Install VS Code playwright extension from Microsoft and follow instructions on the extension page - https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright
#### Install getXpaths
>use **npm i getxpaths** to install the module
>create a .js file and use the following-
>**const x = require('getxpaths');**
>**x.findXpaths();** 
   
## Run
Open terminal and make sure you are at the root path of the project. Then type in the following command in terminal and press enter
>node filename.js

## Use
Follow the steps to use the library
1. In the chromium browser press F12 to open developer console
2. Go to console tab
3. Clear console
4. Move your mouse over the page to see that elements are getting highlighted
5. Right-Click on any element and an array of xpaths appears in the browser console.
6. Expand the array to see the xpaths

## Example
![Example](https://github.com/Raksav/getXpaths/blob/main/getXpaths.gif)