var gameState = "playing";

//can either be pole or flagger
var currentTool = "pole";
let pufferfish;
let fishingPole;
let lilypad;
let lilypadMouse;

let swapButtonColor = "#fef65b";
let mouseSize = 40;
let tileSize = 200;
let percentagebombs = 0.25;
let whereToCheck = 
    [[1,1], [0,1], [-1,1],
    [1,0], [-1,0],
    [1, -1], [0,-1], [-1,-1]]


var grid;
var noOfCols;
var noOfRows;
var showBombs = false;
var lastFrameUpdated = false;
var bombExpandX = 10;
var bombExpandY = 5;

var exposedbombcol = -1;
var exposedbombrow = -1;

function Tile(row_count, column_count)
{    
    this.col = column_count;
    this.row = row_count;
    this.location = createVector(column_count*tileSize, row_count*tileSize);
    this.numberOfSurroundingBombs = 0;
    this.exposed = false;
    this.hasBomb = false;
    this.flagged = false;
}

Tile.prototype.show = function()
{
    if (this.hasBomb && showBombs)
    {
        fill(255, 55, 55);
    }
    else
    {
        fill(55, 55, 255);
    }

    if (this.exposed)
    {        
        if (this.hasBomb)
        {
            image(pufferfish, this.location.x, this.location.y)            
        }
        else 
        {
            fill(200, 200, 255)
            rect(this.location.x, this.location.y, tileSize, tileSize);
            fill(0, 0, 0)
            text(this.numberOfSurroundingBombs, this.location.x + tileSize/2, this.location.y + tileSize/2)                        
        }
    }
    else if (this.flagged)
    {
        rect(this.location.x, this.location.y, tileSize, tileSize);
        image(lilypad, this.location.x, this.location.y)
    }
    else
    {
        rect(this.location.x, this.location.y, tileSize, tileSize);
    }   
}

Tile.prototype.setAsBomb = function()
{
    this.hasBomb = true;    
}

Tile.prototype.testIfClickedOn = function(mx, my)
{
    if (mx >= this.location.x && mx <= this.location.x + tileSize)
    {
        if (my >= this.location.y && my <= this.location.y + tileSize)
        {
            return true;
        }
    }    
    return false;
}
Tile.prototype.reveal = function()
{
    if (this.hasBomb)
    {
        gameState = "lost";
        this.exposed = true;
    }
    else 
    {
        this.exposed = true;
        this.updateSurrounding();        
    }
}

Tile.prototype.updateSurrounding = function()
{
    var cocurrentAmount = 0;
    for (var i =0;i< whereToCheck.length;i++)
    {
        if (this.col + whereToCheck[i][0] < noOfCols && this.row + whereToCheck[i][1] < noOfRows)
        {
            if (this.col + whereToCheck[i][0] >= 0 && this.row + whereToCheck[i][1] >= 0)
            {
                if (grid[this.row + whereToCheck[i][1]][this.col + whereToCheck[i][0]].hasBomb)
                {
                    cocurrentAmount += 1;
                }
            }
        }
    }
    this.numberOfSurroundingBombs = cocurrentAmount;
}

function preload()
{
    pufferfish = loadImage('assets/Pufferfish.png');
    fishingPole = loadImage('assets/Fishing_Rod.png');
    lilypad = loadImage('assets/Lily_Pad.png');
    lilypadMouse = lilypad;    
}

function setup()
{
    fishingPole.resize(mouseSize, mouseSize);
    lilypadMouse.resize(mouseSize/2, mouseSize/2);
    pufferfish.resize(tileSize+20, tileSize+20);
    lilypad.resize(tileSize, tileSize);

    cursor("NONE");
    stroke("#ffffff");
    textSize(100);
    var height = (floor(windowHeight/tileSize-1))*tileSize;
    var width = (floor(windowWidth/tileSize))*tileSize;
    createCanvas(width, height+tileSize);

    var rows = (height/tileSize);
    var cols = width/tileSize;

    noOfRows = rows;    
    noOfCols = cols;
    setupGrid(rows, cols);
}

function setupGrid(rows, cols)
{
    grid = new Array(rows);
    for (var i = 0; i < grid.length;i++)
    {
        grid[i] = new Array(cols);
    }
    
    for (var i = 0;i < rows;i++)
    {                
        for (var j = 0;j < cols;j++)
        {
            grid[i][j] = new Tile(i, j);
        }        
    }

    print(grid)
    var noOfBombs = floor((rows*cols)*percentagebombs);
    for (var i = 0;i<noOfBombs;i++)
    {
        var tileToBombCol = floor(random(0, cols));
        var tileToBombRow = floor(random(0, rows));
        while (grid[tileToBombRow][tileToBombCol].hasBomb)
        {
            tileToBombCol = floor(random(0, cols));
            tileToBombRow = floor(random(0, rows));
        }
        grid[tileToBombRow][tileToBombCol].setAsBomb();        
    }


}

function draw()
{
    if (gameState == "playing")
    {
        background(swapButtonColor);
        updateFrame();        
        if (currentTool == "pole")
        {
            image(fishingPole, windowWidth/2 - fishingPole.width/2, noOfRows*tileSize + tileSize/2 - fishingPole.height/2)
        }
        else if (currentTool == "flagger")
        {
            image(lilypadMouse, windowWidth/2 - lilypadMouse.width/2, noOfRows*tileSize + tileSize/2 - lilypadMouse.height/2)
        }
    }
    else if (gameState == "lost")
    {
        if (!lastFrameUpdated)
        {
            updateFrame();
        }
        lastFrameUpdated = true;
        grid[exposedbombcol][exposedbombrow].show();
        pufferfish.resize(pufferfish.width + bombExpandX, pufferfish.height + bombExpandY);
        textSize(70)
        fill(0)
        text("u lose lol", 50, windowHeight/2);
    }
    else if (gameState == "won")
    {
        if (!lastFrameUpdated)
        {
            updateFrame();
        }
        lastFrameUpdated = true;
        textSize(70)
        fill(0)
        text("u win i guess", 50, windowHeight/2);
    }
    toolCursor();
}

function updateFrame()
{
    for (var i = 0; i < grid.length;i++)
        {
            for (var j = 0;j < grid[i].length;j++)
            {
                grid[i][j].show();
            }
        }
}

function toolCursor()
{
    if (currentTool == "pole")
    {
        image(fishingPole, mouseX, mouseY)
    }
    else 
    {
        image(lilypadMouse, mouseX - lilypadMouse.width/2, mouseY - lilypadMouse.height/2)
    }
    fill(255, 100, 100)
    ellipse(mouseX, mouseY, 10, 10)
}

function keyPressed()
{
    print(keyCode)
    if (keyCode == 81)
    {
        currentTool = "flagger";
    }
    else if (keyCode == 87)
    {
        currentTool = "pole";
    }
}

function mouseClicked()
{
    if (gameState == "playing")
    {
        for (var i = 0;i < grid.length;i++)
        {
            for (var j = 0;j < grid[i].length;j++)
            {
                if (grid[i][j].testIfClickedOn(mouseX, mouseY))
                {
                    if (currentTool == "flagger")
                    {
                        grid[i][j].flagged = !grid[i][j].flagged;
                    }
                    else if (currentTool == "pole" && !grid[i][j].flagged)
                    {
                        grid[i][j].reveal();
                        if (grid[i][j].hasBomb)
                        {
                            exposedbombcol = i;
                            exposedbombrow = j;
                        }
                        if (testIfWon())
                        {
                            gameState = "won";
                        }
                    }
                }
            }
        }
    }    
}

function mousePressed()
{
    if (mouseY > noOfRows*tileSize)
    {
        swapButtonColor = "#CCCC00";
    }
}

function mouseReleased()
{
    if (mouseY > noOfRows*tileSize)
    {
        if (currentTool == "pole")
        {
            currentTool = "flagger";
        }
        else if (currentTool == "flagger")
        {
            currentTool = "pole";
        }
    }
    swapButtonColor = "#fef65b";
}

function testIfWon()
{
    for (var i = 0; i < grid.length;i++)
    {
        for (var j = 0;j < grid[i].length;j++)
        {
            if (!grid[i][j].hasBomb && !grid[i][j].exposed)
            {
                return false;
            }
        }
    }
    return true;
}