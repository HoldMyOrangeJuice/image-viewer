let canvas_first = document.getElementById("canvas_first")
let canvas_second = document.getElementById("canvas_second")
let ctx1 = canvas_first.getContext("2d")
let ctx2 = canvas_second.getContext("2d")
let image_first = new Image()
let image_second = new Image()
let lineStartCoords
let lineFinishCoords
let scale
let dist1
let dist2
let lines1 = []
let lines2 = []
let canvases = [ canvas_first, canvas_second ]
let mode
let node_aimed = null
let line_aimed = null
// mode instance                intermdt line |save start coords |color    |draw line |save line |scaling |move node |out dist |has move evt |out angle
let GET_DISTANCE_MODE = new Mode(true,         true,              "green",  true,      false,     false,   false,     true,     false,        false)
let GET_ANGLE_MODE = new Mode(true,            true, 						  "white",  true,      false,     false ,  false,     false,    false,        true)
let DRAW_ADDITIONAL_AXIS_MODE = new Mode(true, true, 							"red",    true,      true,      false,   false,     false,    false,        false)
let MOVE_NODE_MODE = new Mode(true,            true, 							"gray",   true,      true,      false,   true,      false,    true,         false)
let SCALING_DISTANCE_MODE = new Mode(true,     true, 							"white",  true,     false,      true,    false,     false,    false, 				false)


image_first.src = "1.png"//"https://images.unsplash.com/photo-1523895665936-7bfe172b757d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
image_second.src = "data:image/jpeg;base64,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"

image_first.onload = function()
{
	canvas_first.width = image_first.width;
	canvas_first.height = image_first.height;
	ctx1.drawImage(image_first, 0, 0);
}

image_second.onload = function()
{
	canvas_second.width = image_second.width;
	canvas_second.height = image_second.height;
	ctx2.drawImage(image_second, 0, 0);
}

function clearCanvas(id)
{
	let ctx
	let canvas
	let image
	let lines
	if (id =="canvas_first")
	{
		lines = lines1
		ctx = ctx1
		canvas = canvas_first
		image = image_first
	}

	else
	{
		lines = lines2
		ctx = ctx2
		canvas = canvas_second
		image = image_second
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(image, 0, 0);

	if (scale)
	{
		draw_grid(id)
	}

	lines.forEach((item)=>
	{
		draw_line(item.canvas_id, item.x1, item.y1, item.x2, item.y2, "white")
	})
}

function remLast(id)
{
	if (id=="canvas_first")
		lines1.pop()
	else
		lines2.pop()
	clearCanvas(id)
}

function distance(x1, y1, x2, y2)
{
	return Math.sqrt( Math.pow(Math.abs(x1-x2), 2) + Math.pow(Math.abs(y1-y2),2) )
}

function draw_node(id, x, y, color)
{
	let ctx

	if (id == "canvas_first")
		ctx = ctx1
	else
		ctx = ctx2
	ctx.strokeStyle = color

	ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();

}

function draw_line(id, start_x, start_y, finish_x, finish_y, color)
{

	let ctx
	if (id == "canvas_first")
		ctx = ctx1
	else
		ctx = ctx2
	ctx.strokeStyle = color
	ctx.beginPath();
	ctx.moveTo(start_x, start_y);
	ctx.lineTo(finish_x, finish_y);
	ctx.stroke();


}

function draw_grid(id)
{
	let step = 50
	let ctx
	if (id=="canvas_first")
		ctx = ctx1

	else if(id == "canvas_second")
		ctx = ctx2

	if (scale)
	{
		if (id=="canvas_first")
		{
			for (let x = 0; x <= ctx.canvas.width; x+= step * scale)
			{
				draw_line(id, x, 0, x, ctx.canvas.height, "white")
			}
			for (let y = 0; y <= ctx.canvas.width; y+= step * scale)
			{
				draw_line(id, 0, y, ctx.canvas.width, y, "white")
			}
		}

		if (id=="canvas_second")
		{
			for (let x = 0; x <= ctx.canvas.width; x+= step)
			{
				draw_line(id, x, 0, x, ctx.canvas.height, "white")
			}
			for (let y = 0; y <= ctx.canvas.width; y+= step)
			{
				draw_line(id, 0, y, ctx.canvas.width, y, "white")
			}
		}

	}

}

function setMode(mode_)
{
	switch (mode_)
	{
		case "dist_scale":
			mode = SCALING_DISTANCE_MODE
			break;

		case "dist":
			mode = GET_DISTANCE_MODE
			break;

		case "draw":
			mode = DRAW_ADDITIONAL_AXIS_MODE
			break;

		case "node_move":
			mode = MOVE_NODE_MODE
			break;

		case "get_angle":
			mode = GET_ANGLE_MODE
			break;
	}
}

canvases.forEach(
function(element, index)
{
    element.addEventListener("mousedown",
	function(e)
	{
		let lines
		let id = e.target.id
		if (e.target.id == "canvas_first")
		{
			lines = lines1
		}
		if (e.target.id == "canvas_second")
		{
			lines = lines2
		}


		if (mode.move_node && node_aimed != null && line_aimed != null)
		// moving existing line
		{
			console.log("rem line", line_aimed)
			// remove line

			// removing WRONG line!!
			let index = lines.indexOf(line_aimed);
			if (index !== -1) lines.splice(index, 1);
			lineFinishCoords = null
			// static start coordinates
			if (line_aimed.x1 != node_aimed.x && line_aimed.y1 != node_aimed.x)
					lineStartCoords = {"id": id, "x": line_aimed.x1, "y":line_aimed.y1}
			else
					lineStartCoords = {"id": id, "x": line_aimed.x2, "y":line_aimed.y2}


		}
		else if (!mode.move_node)
		// creating new line
		{
			let rect = e.target.getBoundingClientRect();
			let x = e.clientX - rect.left; //x position within the element.
			let y = e.clientY - rect.top;  //y position within the element.
			lineFinishCoords = null
			lineStartCoords = {"id":id, "x": x, "y": y}
		}

   });
});

canvases.forEach(
(element)=>
{
	element.addEventListener("mouseup",
  (e)=>
	{
		 let lines
	   let id = e.target.id
		 let dist_canvas1
		 let dist_canvas2

		 if (id == "canvas_first")
		 {
			 dist = dist_canvas1
			 lines = lines1
		 }

		else
		{
			lines = lines2
			dist = dist_canvas2
		}



	   if (lineStartCoords.id != e.target.id)
		 // if line was started on different canvas it will be canceled
		 // also deletes line that is getting moved from both canvas and reg
	   {
		   lineStartCoords=null
		   return
	   }

    clearCanvas(id)
		let rect = e.target.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;


		if (mode.draw_line)
		{
			draw_line(id, x, y, lineStartCoords.x, lineStartCoords.y, mode.color)
		}

		if(mode.dist_scale)
		{

			dist = distance(x, y, lineStartCoords.x, lineStartCoords.y)
			console.log("dist", dist)

			if (dist1 && dist2)
			{
				scale = dist1/dist2
				console.log("scale", scale)
				dist1 = null
				dist2 = null
			}
		}

		if (mode.output_distance)
		{

			if (e.target.id == "canvas_first")
				console.log("DISTANCE:", distance(x, y, lineStartCoords.x, lineStartCoords.y)/scale)
			else
				console.log("DISTANCE:", distance(x, y, lineStartCoords.x, lineStartCoords.y))
		}

		if (mode.outputs_angle)
		{

			let lines_to_get_angle_between = []
			for (let line of lines)
			{
				// get line 1 from lines
				// get line 2 from lines

				let collision = line_cross_coordinates(x, y, lineStartCoords.x, lineStartCoords.y, line.x1, line.y1, line.x2, line.y2)
				console.log("COLLISION", collision)
				// if sections collided not only lines
				// BUG: first two line instances always satisfy all checks
				if (collision && dot_on_section(collision.x, collision.y, x, y, lineStartCoords.x, lineStartCoords.y))
				{
						lines_to_get_angle_between.push(line)
						if (lines_to_get_angle_between.length == 2)
							break;
				}
			}
			// get angle with utils
			let angle = getAngleBetweenLines(lines_to_get_angle_between[0], lines_to_get_angle_between[1])

			// output angle
			let rel_out_coords = get_sestion_middle_coords_rel(lineStartCoords.x, lineStartCoords.y, x, y)
			let output_box_x = lineStartCoords.x + rect.left
			let output_box_y = lineStartCoords.y + rect.top

			let output_element = document.createElement("div")

			output_element.style.position = "absolute"
			output_element.style.left = `${output_box_x}px`
			output_element.style.top = `${output_box_y}px`
			output_element.appendChild(document.createTextNode( Math.round(angle)+"°" ) )
			output_element.style.color = "white"

			document.getElementById("body").appendChild(output_element)
			console.log("\n----------------------\n")

		}

		if (mode.save_line)
		{
			line = new Line(id, lineStartCoords.x, lineStartCoords.y, x, y)
			lines.push(line)
		}

		line_aimed = null
		node_aimed = null
		lineStartCoords = null

		// clear AND REDRAW all lines on canvas
		clearCanvas(id)
   });
});


canvases.forEach((canvas)=>
{
	canvas.addEventListener("mousemove", (e)=>
	{

		let id = e.target.id
		let lines

		// Current mouse coordinates
		let rect = e.target.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;

		if (id == "canvas_first")
			lines = lines1
		else
			lines = lines2

		clearCanvas(id)

		if (mode.intermediate_line && lineStartCoords)
		// drawing  intermediate line
		{
			if (lineStartCoords.id != e.target.id)
				return



			draw_line(e.target.id, lineStartCoords.x, lineStartCoords.y, x, y, "gray")
		}

		else
		// just moving mouse without line attached
		{
			if (!mode.has_mouse_move_event)
				// pass event only if need to highlite nodes
				return


			for (let line of lines)
			{
				if ( ((Math.abs(line.x1 - x) < 10 && Math.abs(line.y1 - y) < 10) || (Math.abs(line.x2 - x) < 10 && Math.abs(line.y2 - y) < 10)) )
					{
						// aimed on node
						let node_x
						let node_y

						let node_start_x
						let node_start_y

						if(Math.abs(line.x2 - x) < 10 && Math.abs(line.y2 - y) < 10)
						{
							node_x = line.x2
							node_y = line.y2

							node_start_x = line.x1
							node_start_y = line.y1
						}
						else
						{
							// not aimed at any node
							node_x = line.x1
							node_y = line.y1

							node_start_x = line.x2
							node_start_y = line.y2
						}

						draw_node(id, node_x, node_y, "red")
						node_aimed = {"id": id, "x": node_x, "y": node_y}
						line_aimed = line
						break

					}
					else
					{

							node_aimed = null
							line_aimed = null
					}
			}
		}
	})
})

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
		let rect = e.target.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
    console.log(x, y)
    return false;
}, false);
