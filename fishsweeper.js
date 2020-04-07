let pufferfish;
let fishingPole;

let mouseSize = 40;
let tileSize = 50;
let percentagebombs = 0.1;
let whereToCheck = 
    [[1,1], [0,1], [-1,1],
    [1,0], [-1,0],
    [1, -1], [1,-1], [-1,-1]]


var grid;
function Tile(row_count, column_count)
{    
    this.location = createVector(column_count*tileSize, row_count*tileSize);
    this.exposed = false;
    this.hasBomb = false;
    this.parseIntflagged = false;
}

Tile.prototype.show = function()
{
    fill(55, 55, 255);
    rect(this.location.x, this.location.y, tileSize, tileSize);
}

Tile.prototype.setAsBomb = function()
{
    this.hasBomb = true;    
}

function preload()
{
    pufferfish = loadImage('assets/Pufferfish.png');
    fishingPole = loadImage('assets/Fishing_Rod.png');
}

function setup()
{
    fishingPole.resize(mouseSize, mouseSize);
    cursor("NONE");
    stroke("#ffffff");
    var height = (floor(windowHeight/tileSize)-1)*tileSize;
    var width = (floor(windowWidth/tileSize)-1)*tileSize;
    createCanvas(width, height);

    var rows = (height/tileSize);
    var cols = width/tileSize;
    print(rows)
    print(cols)
    
    setupGrid(rows, cols);
    print(grid)
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
}

function draw()
{
    background("#000000");
    for (var i = 0; i < grid.length;i++)
    {
        for (var j = 0;j < grid[i].length;j++)
        {
            grid[i][j].show();
        }
    }
    fishingPoleOnCursor();
}

function fishingPoleOnCursor()
{
    image(fishingPole, mouseX, mouseY)
}