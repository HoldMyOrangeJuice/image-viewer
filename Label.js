class Label
{
  constructor(text, point)
  {
    this.element = document.createElement("div")
    this.label_ID = new Date().getTime()
    this.text = text
    this.pos = point
    this.element.id = label_ID
    this.element.innerText = text
    this.element.style.position = "absolute"
    this.element.style.top = this.point.y
    this.element.style.left = this.point.x
    document.getElementById("body").appendChild(this.element)
  }
  update()
  {
    this.element.innerText = text
    this.element.style.top = this.pos.y
    this.element.style.left = this.pos.x
  }
  remove()
  {
    $(`#${this.label_ID}`).remove()
  }
}
