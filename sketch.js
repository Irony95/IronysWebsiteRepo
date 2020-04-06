function setup() 
{
    createCanvas(640, 480);
}

function draw() 
{
    background(0, 0, 0, 51);
    var color = color(random(0, 255), random(0, 255), random(0, 255));
    fill(color);
    if (mouseIsPressed)
    {
      ellipse(mouseX, mouseY, 80, 80);
    }
    else if (touches.length > 0)
    {
      ellipse(touches[0].x, touches[0].y, 80, 80);
    }
}