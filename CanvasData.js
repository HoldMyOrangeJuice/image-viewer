class CanvasData
{
  constructor(id, main_canvas)
  {
    this.id = id
    this.element = document.getElementById(this.id)
    this.ctx = this.element.getContext("2d")
    this.lines = []
    this.nodes = []
    this.curve_shapes={} // shape name: ComplexObject
    this.main_canvas = main_canvas
  }
  save_line(line)
  {
    this.lines.push(line)
  }
  save_node(node)
  {
    this.nodes.push(node)
  }
  update()
  {
    this.lines.forEach((line) => {
      draw_line(this, line, "white")
    });

    this.nodes.forEach((node) => {
      draw_line(this, node, "pink")
    });

  }
}
