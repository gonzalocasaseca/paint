/** GLOBAL VARIABLES **/

var size = 1;     
var green = "#39e735";
var red = "#ff0808";
var blue = "#0e4fd4";
var black = "#111111";
var clean = "rgba(0, 0, 0, 1.0)";
var activate = false;
var color = "#111111";

$(document).ready(function()
{
    $('#save').click(function()
    {        
        var data = document.getElementById("mycanvas").toDataURL();
        //document.write(data);

        $.post("save_image.php", { imageData : data }, function(){})
        .error(function(XMLHttpRequest, textStatus, errorThrown) { alert("Error saving the image"); })
        .success(function(data)
        { 
            var canvas = document.getElementById('mycanvas');
            var context = canvas.getContext('2d')
            context.clearRect(0, 0, canvas.width, canvas.height);
            $('#stored_image').html('Here it is your piece of art:<br /><img src="' + data + '"/></div>'); 
        });
    });

    //context.drawImage(outlineImage, 0, 0, 300, 300);
    $('#size1').click(function(){ size = 1; });

    $('#size2').click(function(){ size = 5; });

    $('#size3').click(function(){ size = 10; });

    $('#clean').click(function()
    {    
        color = clean;
        activate = true;		
    });

    $('.color').click(function() { activate = false; })
    
    $('#color1').click(function() { color = black; });

    $('#color2').click(function() { color = green; });

    $('#color3').click(function() { color = red; });

    $('#color4').click(function() { color = blue; });
});
  

if(window.addEventListener)
{    
    window.addEventListener('load', function ()
    {
        var canvas, context, tool;
        
        function init ()
        {
            // Find the canvas element.
            canvas = document.getElementById('mycanvas');
            
            if (!canvas)
            {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if (!canvas.getContext)
            {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            context = canvas.getContext('2d');

            if (!context) {
              alert('Error: failed to getContext!');
              return;
            }
            
            context.lineJoin = "round";
            
            // Pencil tool instance.
            tool = new tool_pencil();

            // Attach the mousedown, mousemove and mouseup event listeners.
            canvas.addEventListener('mousedown', ev_canvas, false);
            canvas.addEventListener('mousemove', ev_canvas, false);
            canvas.addEventListener('mouseup',   ev_canvas, false);
        }

        // This painting tool works like a drawing pencil which tracks the mouse 
        // movements.     
        function tool_pencil ()
        {
            var tool = this;        
            this.started = false;

            // This is called when you start holding down the mouse button.
            // This starts the pencil drawing.
            this.mousedown = function (ev)
            {
                context.lineWidth = size;
                context.lineTo(ev._x, ev._y);
                context.globalCompositeOperation = "source-over";

                if (activate)
                {
                    context.globalCompositeOperation = "destination-out";
                }

                context.strokeStyle = color;
                context.beginPath();
                context.arc(ev._x, ev._y, size/10, 0, 2 * Math.PI, false);
                context.moveTo(ev._x, ev._y);
                tool.started = true;
            };

            // This function is called every time you move the mouse. Obviously, it only 
            // draws if the tool.started state is set to true (when you are holding down 
            // the mouse button).
            this.mousemove = function (ev)
            {
              if (tool.started)
              {
                context.lineTo(ev._x, ev._y);
                context.stroke();
              }
            };

            // This is called when you release the mouse button.
            this.mouseup = function (ev)
            {
                if (tool.started)
                {
                    tool.mousemove(ev);
                    tool.started = false;
                }
            };
        }

        // The general-purpose event handler. This function just determines the mouse 
        // position relative to the canvas element.
        function ev_canvas (ev)
        {
            if (ev.layerX || ev.layerX == 0)
            { // Firefox          
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            }
            else if (ev.offsetX || ev.offsetX == 0) 
            { // Opera              
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }

            // Call the event handler of the tool.
            var func = tool[ev.type];
            if (func) { func(ev); }
        }

  init();

    }, false); 

}
