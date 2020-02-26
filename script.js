let canvas_first = document.getElementById("canvas_first")
let canvas_second = document.getElementById("canvas_second")
let text_output = document.getElementById("text-output")
let ctx1 = canvas_first.getContext("2d")
let ctx2 = canvas_second.getContext("2d")
let image_first = new Image()
let image_second = new Image()
let lineStartPoint
let lineFinishPoint
let scale
let dist1
let dist2
let lines1 = []
let lines2 = []
let nodes1 = []
let nodes2 = []


// canvs data contains all data about lines nodes shapes etc


let canvases_to_listen = [ canvas_first, canvas_second ]
let mode
let node_aimed = null
let line_aimed = null
let curve_shape_nodes = {} // {id:{shapeid:[...points]}}
let shape_objects = {}
let temp_labels={}

//let nodes_temp = {}

let dist_canvas1
let dist_canvas2

let eyes_1
let eyes_2

// mode instance                intermdt line |save start coords |color    |draw line |save line |scaling |move node |out dist |has move evt |out angle | creates moveable lines |show nodes |show_label |curve |one line angle
let GET_DISTANCE_MODE = new Mode(true,         true,              "green",  true,      false,     false,   false,     true,     false,        false,     false,                   true,       true,      false, false)
let GET_ANGLE_MODE = new Mode(true,            true, 						  "white",  true,      false,     false ,  false,     false,    false,        true,      false,                   false,      false,     false, false)
let DRAW_ADDITIONAL_AXIS_MODE = new Mode(true, true, 							"red",    true,      true,      false,   false,     false,    false,        false,     true,                    true,       true,      false, false)
let MOVE_NODE_MODE = new Mode(true,            true, 							"gray",   true,      true,      false,   true,      false,    true,         false,     false,                   false, 			false,     false, false)
let SCALING_DISTANCE_MODE = new Mode(true,     true, 							"white",  true,      false,     true,    false,     false,    false, 				false,     false,                   false, 			false,     false, false)
let DRAW_LINE_WITH_DIST = new Mode(true,       true,              "brown",  true,      true,      false,   false,     true,     false,        false,     false,                   true, 			true,      false, false)
let SET_POINTS_MODE = new Mode(true,           true,              "red",    true,      true,      false,   false,     false,    false,        false,     false,                   false,       false,    true , false)
let GET_TILT_MODE = new Mode(true,             true,              "red",    true,      false,     false,   false,     false,    false,        true,      false,                   false,      false,     false, true)




image_first.src = "res/4.png"
image_second.src = "res/5.png"

let canvases=
{
	"first":
							{
								"main":new CanvasData("canvas_first"),
							 	"grid": new CanvasData("grid_first"),
						 	 	"temp_line": new CanvasData("temp_line_first"),
							},

	 "second":
						 {
							 "main":new CanvasData("canvas_second"),
							 "grid": new CanvasData("grid_second"),
							 "temp_line": new CanvasData("temp_line_second")
						 }
}


image_first.onload = function()
{
	Object.keys(canvases["first"]).forEach((canvas_key) => {
		let el = canvases["first"][canvas_key].element
		el.width = image_first.width;
		el.height = image_first.height;
	});

	let bg1 = document.getElementById("bg1")
	bg1.style.backgroundImage = "url('res/4.png')"
	bg1.style.height = image_first.height+"px"
	bg1.style.width = image_first.width+"px"

}


image_second.onload = function()
{
	let gap = 50

	Object.keys(canvases["second"]).forEach((canvas_key) => {
		let el = canvases["second"][canvas_key].element
		el.width = image_second.width;
		el.height = image_second.height;
		el.style.left =  (image_first.width+gap)+"px"
	});

	let bg2 = document.getElementById("bg2")
	bg2.style.left =  (image_first.width+gap)+"px"
	bg2.style.backgroundImage = "url('res/5.png')"
	bg2.style.height = image_second.height+"px"
	bg2.style.width = image_second.width+"px"

}

function output(string)
{
		text_output.innerText = (string)
}

function clear_canvas(id)
{
	if (temp_labels[id] != null)
	{
		$(`.${temp_labels[id].className}`).remove()
		temp_labels[id] = null
	}

	let ctx
	let canvas
	let image
	let lines
	let nodes
	if (id =="canvas_first")
	{
		lines = lines1
		ctx = ctx1
		canvas = canvas_first
		image = image_first
		nodes = nodes1
	}

	else
	{
		lines = lines2
		ctx = ctx2
		canvas = canvas_second
		image = image_second
		nodes = nodes1
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	//update(id)
}
function update(id)
{



	let ctx
	let canvas
	let image
	let lines
	let nodes
	if (id =="canvas_first")
	{
		lines = lines1
		ctx = ctx1
		canvas = canvas_first
		image = image_first
		nodes = nodes1
	}

	else
	{
		lines = lines2
		ctx = ctx2
		canvas = canvas_second
		image = image_second
		nodes = nodes1
	}


	lines.forEach((line)=>
	{
		draw_line(line, "white")
		console.log(line)
		if (line.show_label)
		{
			line.remove_label()
			line.add_label()
		}

		if (line.show_nodes)
		{
			line.draw_nodes()
		}

	})

	nodes.forEach((node)=>
	{
		draw_node(node, "red")
	})
	if (shape_objects[id])
	{
		Object.keys(shape_objects[id]).forEach((shape_name) => {
			let comp_obj = shape_objects[id][shape_name]
			console.log(comp_obj)
			comp_obj.draw_object()
		});
	}




	// if (nodes_temp[id])
	// {
	// 	nodes_temp[id].forEach((node)=>
	// 	{
	// 		draw_node(node, "red")
	// 	})
	// }

}

function draw_curve_shape(canvData, shape_name)
{
	let arrayOfPoints = curve_shape_nodes[shape_name]
	let prev_point
	let curr_point
	let another_id
	let id
	let eyes
	let another_eyes
	console.log(arrayOfPoints)

let linesArray_1 = []
let linesArray_2 = []

	arrayOfPoints.forEach((item) => {
		prev_point = curr_point
		curr_point = item
		id = item.id

		if (canvData.main_canvas=="canvas_first")
		{
				another_id = "canvas_second"
				eyes = eyes_1
				another_eyes = eyes_2

		}

		else
		{
				another_id = "canvas_first"
				eyes = eyes_2
				another_eyes = eyes_1
		}
		let eye_1 = new Point(id, eyes.x1, eyes.y1)
		let eye_2 = new Point(id, eyes.x2, eyes.y2)
		let center_point = get_sestion_middle_coords(eye_1, eye_2)

		let eye_1_ = new Point(another_id, another_eyes.x1, another_eyes.y1)
		let eye_2_ = new Point(another_id, another_eyes.x2, another_eyes.y2)

		let another_center_point = get_sestion_middle_coords(eye_1_, eye_2_)
		console.log(center_point, another_center_point)
		//draw_node(center_point, "red")
		//draw_node(another_center_point, "red")
		if (prev_point && curr_point)
		{
			// original curve
			let line = new Line(item.id, center_point.x + prev_point.x, center_point.y + prev_point.y, center_point.x + curr_point.x, center_point.y + curr_point.y)
			draw_line(line, "red")
			linesArray_1.push(line)
		  //draw_node(line.point1, "red")

			// scaling and placeing curve on other canvas
			let line1 = new Line(another_id, another_center_point.x + prev_point.x / scale, another_center_point.y + prev_point.y / scale, another_center_point.x + curr_point.x  / scale, another_center_point.y + curr_point.y / scale)
			console.log(line1)
			draw_line(line1, "red")
			linesArray_2.push(line1)
			//draw_node(line1.point1, "red")
		}

	});
	let complex_shape_1 = new ComplexObject(linesArray_1)
	let complex_shape_2 = new ComplexObject(linesArray_2)

	if (shape_objects[id] && shape_objects[id][shape_name])
	{
		shape_objects[id][shape_name] = complex_shape_1
	}
	else
	{
		shape_objects[id] = {}
		shape_objects[id][shape_name] = complex_shape_1
	}

	if (shape_objects[another_id] && shape_objects[another_id][shape_name])
	{
		shape_objects[another_id][shape_name] = complex_shape_1
	}
	else
	{
		shape_objects[id] = {}
		shape_objects[id][shape_name] = complex_shape_1
	}


	lineStartPoint = null


}

function remLast(id)
{
	if (id=="canvas_first")
		lines1.pop()
	else
		lines2.pop()
	//update(id)
	clear_canvas(id)
}


function draw_node(canvData, node, color)
{
	let ctx = canvData.ctx

	ctx.beginPath();
  ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();

}

function draw_line(canvData, line, color)
{
	let ctx = canvData.ctx

	ctx.strokeStyle = color
	ctx.beginPath();
	ctx.moveTo(line.x1, line.y1);
	ctx.lineTo(line.x2, line.y2);
	ctx.stroke();


}
function remove_label(class_name, id)
{
		$(`.${class_name+id}`).remove();

}

function place_label({id, x, y}, text, class_name, color, bg_color)
{
	let label = document.createElement("div")
	let rect = document.getElementById(id).getBoundingClientRect()
	label.innerText = Math.round(text)
	label.style.position = "absolute"
	label.style.left = `${x + rect.left}px`
	label.style.top = `${y + rect.top}px`
	label.className = class_name+id
	label.style.color = color
	label.style.background = bg_color
	document.getElementById("body").appendChild(label)
	return label
}

function draw_grid(iamge_id) // edited image: "canvas_first" or second
{
	let step = 40
	let ctx
	let canvasData
	let unscale
	if (iamge_id=="canvas_first")
	{
		canvasData = canvases["first"]["grid"]
		step = step * scale
		unscale = 1 / scale
	}
	else if(iamge_id == "canvas_second")
	{
		canvasData = canvases["second"]["grid"]
		unscale = 1
	}
	ctx = canvasData.ctx
	let id = canvasData.id
	//let x = x + rect.left
	//let y = y + rect.top

	if (scale)
	{
		// could do it better if performance suffers
		remove_label("label_grid", id)


		for (let x = 0; x <= ctx.canvas.width; x+= step)
		{
			//draw line
			draw_line(new Line(id, x, 0, x, ctx.canvas.height), "white")
			// label line
			place_label(new Point(id, x, 0), x*unscale, "label_grid", "white", "black")
		}

		for (let y = 0; y <= ctx.canvas.height; y+= step)
		{
			draw_line(new Line(id, 0, y, ctx.canvas.width, y), "white")
			place_label(new Point(id, 0, y), y*unscale, "label_grid", "white", "black")
		}

	}

}
function getCanvasData(canvas_id)
{
		for(let canvKey of Object.keys(canvases["first"])) {
			console.log("line id is", canvas_id, "iterating", canvases["first"][canvKey].id, String(canvases["first"][canvKey].id) == String(canvas_id))
			if (String(canvases["first"][canvKey].id) == String(canvas_id))
			{
				console.log("TRUE", canvases["first"][canvKey])
				return canvases["first"][canvKey]
			}

		}

		for(let canvKey of Object.keys(canvases["second"])){
			if (canvases["second"][canvKey].id == canvas_id)
			return canvases["second"][canvKey]
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

		case "draw_axis_with_dist":
		mode = DRAW_LINE_WITH_DIST
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
		case "curve":
			mode = SET_POINTS_MODE
			break;
		case "tilt":
			mode = GET_TILT_MODE
			break;
	}
}

canvases_to_listen.forEach(
function(element, index)
{
    element.addEventListener("mousedown",
	function(e)
	{
		if (mode == null)
			return

		let lines
		let id = e.target.id
		let eyes

		let rect = e.target.getBoundingClientRect();
		let x = e.clientX - rect.left; //x position within the element.
		let y = e.clientY - rect.top;  //y position within the element.

		if (e.target.id == "canvas_first")
		{
			lines = lines1
			eyes = eyes_1
		}
		if (e.target.id == "canvas_second")
		{
			lines = lines2
			eyes = eyes_2
		}


		if (mode.move_node && node_aimed != null && line_aimed != null)
		// moving existing line
		{
			// remove line
			let index = lines.indexOf(line_aimed);
			if (index !== -1)
			{
				line_aimed.remove_label()
				lines.splice(index, 1);
			}
			lineFinishPoint = null

			// static start coordinates
			if (line_aimed.x1 != node_aimed.x && line_aimed.y1 != node_aimed.x)
					lineStartPoint = new Point(id, line_aimed.x1, line_aimed.y1)
			else
					lineStartPoint = new Point(id, line_aimed.x2, line_aimed.y2)
		}
		else if (!mode.move_node)
		// creating new line
		{

		if (!mode.creating_curve_shape)
		{
			lineFinishPoint = null
			lineStartPoint = new Point(id, x, y)
		}


			if (mode.creating_curve_shape)
			{
				// make node coords relative from 0 eye center
					let eye_1 = new Point(id, eyes.x1, eyes.y1)
					let eye_2 = new Point(id, eyes.x2, eyes.y2)
					let center_point = get_sestion_middle_coords(eye_1, eye_2)
					let node = new Point(id, x - center_point.x, y - center_point.y)



				if (curve_shape_nodes["shape_1"])
				{
					let listOfNodes = curve_shape_nodes["shape_1"]
					console.log("node", node)
					listOfNodes.push(node)
					curve_shape_nodes["shape_1"] = listOfNodes
				}
				else
				{
					curve_shape_nodes["shape_1"] = [node]
				}

			}

		}

   });
});

canvases_to_listen.forEach(
(element)=>
{
	element.addEventListener("mouseup",
  (e)=>
	{


		if (mode == null)
			return



		let lines
	  let id = e.target.id

		let rect = e.target.getBoundingClientRect();
 		let x = e.clientX - rect.left;
 		let y = e.clientY - rect.top;



		//update(id)
		clear_canvas(id)

		if (mode.creating_curve_shape)
		{
			lineStartPoint = new Point(id, x, y)
			return
		}
		// lineStartPoint is null if we create curve shape. Point is created on mouse up
		if (lineStartPoint==null)
			return
		// creating line here
		let line_done = new Line(id, x, y, lineStartPoint.x, lineStartPoint.y,
														  mode.creates_moveable_lines,
														  mode.show_created_line_nodes,
															mode.show_label,)

		//update(id)
		let canvas
		if (id == "canvas_first")
		{
			 dist = dist_canvas1
			 lines = lines1
			 canvas = canvas_first
		}
		else
		{
			lines = lines2
			// probably wont work
			dist = dist_canvas2
			canvas = canvas_second
		}

	  if (lineStartPoint.id != e.target.id)
		// if line was started on different canvas it will be canceled
		// also deletes line that is getting moved from both canvas and reg
	  {
		  lineStartPoint=null
		  return
	  }
		if (mode.show_label)
		{
			temp_labels[id] = line_done.add_label()
			console.log("added temp label")
		}


		if (mode.draw_line)
		{

			draw_line(line_done, mode.color)
		}

		if(mode.scaling)
		{

			if (id == "canvas_first")
			{
				dist_canvas1 = line_done.length()
				eyes_1 = line_done
			}
			else
			{
					dist_canvas2 = line_done.length()
					eyes_2 = line_done
			}
			if (dist_canvas1 != null && dist_canvas2 != null)
			{
				scale = dist_canvas1/dist_canvas2
				console.log(scale)
				draw_grid("canvas_second")
				draw_grid("canvas_first")
				dist_canvas1 = null
				dist_canvas2 = null
			}
		}

		if (mode.output_distance)
		{
			let dist
			console.log("actual dist", line_done.length(), "scale", scale)
			if (e.target.id == "canvas_first")
			{
				dist = line_done.length()/scale
				console.log("scaled DISTANCE:", line_done.length()/scale)
			}
			else
			{
				dist = line_done.length()
				console.log("scaled DISTANCE:", line_done.length())
			}

				output(dist)
				remove_label("label_dist", id)

				draw_node(new Point(line_done.id, line_done.x1, line_done.y1))
				draw_node(new Point(line_done.id, line_done.x2, line_done.y2))
				//nodes_temp[id] = [new Point(line_done.id, line_done.x1, line_done.y1), new Point(line_done.id, line_done.x2, line_done.y2)]
				//place_label(get_sestion_middle_coords(nodes_temp[id][0], nodes_temp[id][1]), dist, "label_dist", "white", "black")

				//line_done.add_label()
		}
		if (mode.outputs_angle)
		{
			console.log("outputs_angle")
			let lines_to_get_angle_between = []
			for (let saved_line of lines)
			{
				// saved line is axis from registry
				// get saved_line 1 from lines
				// get saved_line 2 from lines

				let collisionPoint = line_cross_coordinates(saved_line, line_done)
				// if sections collided not only lines
				if (collisionPoint && dot_on_section(collisionPoint, line_done))
				{
						console.log("found line")
						lines_to_get_angle_between.push(saved_line)
						draw_line(saved_line, "red")
						if (!mode.get_tilt && lines_to_get_angle_between.length == 2)
							break;

						else if(mode.get_tilt)
						{
							console.log("add horiz. line")
							lines_to_get_angle_between.push(new Line(saved_line.id, 0, canvas.height, 100, canvas.height))
							break;
						}
				}
			}
			// make sure we have both lines to get angle
			if (lines_to_get_angle_between.length != 2)
			{
				lineStartPoint = null
				update(id)
				return
			}


			let dot1 = line_cross_coordinates(line_done, lines_to_get_angle_between[0])
			let dot2 = line_cross_coordinates(line_done, lines_to_get_angle_between[1])

			//nodes_temp[id] = [dot1, dot2, line_cross_coordinates(lines_to_get_angle_between[0], lines_to_get_angle_between[1])]
			draw_node(dot1)
			draw_node(dot2)
			draw_node(line_cross_coordinates(lines_to_get_angle_between[0], lines_to_get_angle_between[1]))
			let angle_mode
			if ( angle_is_smaller(dot1, dot2, lines_to_get_angle_between[0], lines_to_get_angle_between[1]) )
			{
				angle_mode = "small"
				console.log("small")
			}
			else
			{
				console.log("big")
				angle_mode = "big"
			}
			if (mode.get_tilt)
				angle_mode = "small"
		  // get angle with utils
			let angle = getAngleBetweenLines(lines_to_get_angle_between[0], lines_to_get_angle_between[1], angle_mode)

			// output angle
			let out_coords = get_sestion_middle_coords(
			line_cross_coordinates(lines_to_get_angle_between[0], line_done),
			line_cross_coordinates(lines_to_get_angle_between[1], line_done)
			)


			let output_box_x = out_coords.x + rect.left
			let output_box_y = out_coords.y + rect.top
			let output_element = document.getElementById("m37r6oykLwR4kCyxh3UjrlPeT7lMgbN1eEuBhuJsOZiPKUF3D6v")

			if (output_element == null)
				output_element = document.createElement("div")

			output_element.id = "m37r6oykLwR4kCyxh3UjrlPeT7lMgbN1eEuBhuJsOZiPKUF3D6v"
			output_element.style.position = "absolute"
			output_element.innerText= Math.round(angle)+"°"
			console.log("angle", angle)

			output_element.style.color = "white"
			document.getElementById("body").appendChild(output_element)
			output_element.style.left = `${output_box_x-output_element.offsetWidth/2}px`
			output_element.style.top = `${output_box_y-output_element.offsetHeight/2}px`
			document.getElementById("body").appendChild(output_element)


		}

		if (mode.save_line)
		{
			lines.push(line_done)
		}
		// draw everything with new line
		update(id)


		line_aimed = null
		node_aimed = null
		lineStartPoint = null

   });
});


canvases_to_listen.forEach((canvas)=>
{
	canvas.addEventListener("mousemove", (e)=>
	{
		if (mode == null)
			return

		let id = e.target.id
		let lines
		let temp_line_canv_id

		// Current mouse coordinates
		let rect = e.target.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;


		let line_temp

		if (id == "canvas_first")
		{
			lines = lines1
			temp_line_canv_id = "temp_line_first"
		}

		else
		{
			lines = lines2
			temp_line_canv_id = "temp_line_second"
		}

		if (mode.intermediate_line && lineStartPoint != null)
		// drawing  intermediate line
		{
			console.log("should draw temp line")
			line_temp = new Line(temp_line_canv_id, lineStartPoint.x, lineStartPoint.y, x, y)
			//update(id)

			if (lineStartPoint.id != e.target.id)
				return

			clear_canvas(id)
			update(id)
			draw_line(line_temp, "gray")


		}

		else
		// just moving mouse without line attached
		{
			if (!mode.has_mouse_move_event)
				// pass event only if need to highlite nodes
				return

			//	update(id)
				clear_canvas(id)
				update(id)
			if (mode.move_node)
			{
				for (let line of lines)
				{
					if (line.moveable && ((Math.abs(line.x1 - x) < 10 && Math.abs(line.y1 - y) < 10) || (Math.abs(line.x2 - x) < 10 && Math.abs(line.y2 - y) < 10)) )
						{
							// aimed on node
							let node_x
							let node_y

							if(Math.abs(line.x2 - x) < 10 && Math.abs(line.y2 - y) < 10)
							{
								node_x = line.x2
								node_y = line.y2
							}
							else
							{
								// not aimed at any node
								node_x = line.x1
								node_y = line.y1
							}
							node_aimed = new Point(id, node_x, node_y)
							draw_node(node_aimed, "red")
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

		}
	})
})
