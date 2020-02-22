class Line
{
	constructor(id, x1, y1, x2, y2)
	{
		this.x1 = x1
		this.x2 = x2
		this.y1 = y1
		this.y2 = y2
		this.id = id // canvas id
	}

	length()
	{
		return Math.sqrt( Math.pow(Math.abs(this.x2 - this.x1), 2) + Math.pow(Math.abs(this.y2-this.x1),2) )
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
}
