class ComplexObject
{
  constructor(linesArray, nodesArray, labelsArray)
  {
    this.linesArray = linesArray
    this.nodesArray = nodesArray
    this.labelsArray = labelsArray
  }

  draw_object()
  {
    if (this.linesArray)
    {
      this.linesArray.forEach((line) => {
        draw_line(line, "red")
      });
    }
    if (this.nodesArray)
    {
      this.nodesArray.forEach((node) => {
        draw_node(node, "red")
      });
    }
    if (this.labelsArray)
    {
      this.labelsArray.forEach((label) => {
        label.update()
      });
    }

  }

  remove_labels()
  {
    if (this.labelsArray)
    {
      this.labelsArray.forEach((label) => {
        label.remove()
      });
    }
  }
  
}
