function setup() 
{
    createCanvas(windowWidth, windowHeight/2);
}

function draw() 
{    
    background(0, 0, 0, 51);      
    if (mouseIsPressed)
    {
      changeColor();
      ellipse(mouseX, mouseY, 80, 80);
    }
    else if (touches.length > 0)
    {
      for (var i = 0;i < touches.length;i++)
      {
        changeColor();
        ellipse(touches[i].x, touches[i].y, 80, 80);
        text(touches[i].x, 150, 150 + (i*150));
      }      
    }
}

function changeColor()
{
  var ellipseColor = color(random(0, 255), random(0, 255), random(0, 255));
  fill(ellipseColor);
}
