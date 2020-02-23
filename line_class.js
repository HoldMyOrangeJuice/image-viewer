class Line
{
	constructor(id, x1, y1, x2, y2, moveable, show_nodes, show_label)
	{
		this.x1 = x1
		this.x2 = x2
		this.y1 = y1
		this.y2 = y2
		this.id = id // canvas id

		this.point1 = new Point(this.id, this.x1, this.y1)
		this.point2 = new Point(this.id, this.x2, this.y2)

		this.moveable = (moveable==null||moveable==undefined)?false:true
		this.show_nodes = (show_nodes==null||show_nodes==undefined)?false:true
		this.show_label = (show_label==null||show_label==undefined)?false:true
		this.label_class = new Date().getTime()
	}

	length()
	{
		return Math.sqrt( Math.pow(Math.abs(this.x2 - this.x1), 2) + Math.pow(Math.abs(this.y2-this.x1),2) )
	}


	remove_label()
	{
		if (this.label_class != null)
		{
			//console.log("remove old label", this.label)
			//this.label.remove()
			//this.label = null
			$(`.${this.label_class}${this.id}`).remove()
		}
	}

	add_label()
	{
		let pos = get_sestion_middle_coords(this.point1, this.point2)
		//console.log("creating label! existing label", this.label, "should be deleted!");
		place_label(pos, this.length(), this.label_class, "white", "black")
		//console.log("create new label", this.label)
	}

	draw_nodes()
	{
		draw_node(this.point1, "green")
		draw_node(this.point2, "green")
	}



}

class Point
{
	constructor(id, x, y)
	{
		this.id = id
		this.x = x
		this.y = y
	}
	distance(point)
	{
		return Math.sqrt( Math.pow(Math.abs(this.x - point.x), 2) + Math.pow(Math.abs(this.y-point.y),2) )
	}
}
