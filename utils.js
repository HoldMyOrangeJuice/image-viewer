function getAngleBetweenLines(line1, line2)
{
  let start_x1 = line1.x1
  let finish_x1 = line1.x2
  let start_y1 = line1.y1
  let finish_y1 = line1.y2
  let start_x2 = line2.x1
  let finish_x2 = line2.x2
  let start_y2 = line2.y1
  let finish_y2 = line2.y2

  let angle1
  let angle2

  console.log(line1.x1, line1.x2, line1.y1, line1.y2, line2.x1, line2.x2, line2.y1, line2.y2  )
  if (start_x1 - finish_x1 != 0  )
  {
    k1 = (start_y1 - finish_y1)/(start_x1 - finish_x1)
    angle1 = Math.atan(k1)
  }
  else
  {
    // divide by number close to 0
    k1 = (start_y1 - finish_y1)/(0.01)
    angle1 = Math.atan(k1)
  }

  if (start_x2 - finish_x2 != 0)
  {
    k2 = (start_y2 - finish_y2)/(start_x2 - finish_x2)
    angle2 = Math.atan(k2)
  }
  else
  {
    // divide by number close to 0
    k2 = (start_y2 - finish_y2)/(0.01)
    angle2 = Math.atan(k2)
  }

  console.log("RETURNING",  180/Math.PI * Math.abs(angle1 - angle2))
  return 180/Math.PI * Math.abs(angle1 - angle2)
}


function get_k_coef(line)
{
  return (line.y1 - line.y2)/(line.x1 - line.x2) == Infinity? 1 : (line.y1 - line.y2)/(line.x1 - line.x2);
}

function get_b_coef(line)
{
  return line.y1 - get_k_coef(line) * line.x1;
}


function line_cross_coordinates(line1, line2)
  {
    // get point where two lines cross
    //console.log("\nline1", "x1", l1_x1, "y1", l1_y1, "x2", l1_x2, "y2", l1_y2, "\ncollides with\n", "\nline2", l2_x1, l2_y1, l2_x2, l2_y2)
    let collide_x = null
    let collide_y = null

    let k1 = get_k_coef(line1)
    let b1 = get_b_coef(line1)

    let k2 = get_k_coef(line2)
    let b2 = get_b_coef(line2)

    if (k1-k2 != 0)
    {
      collide_x = (b2-b1)/(k1-k2)
      collide_y = k1 * collide_x + b1
      console.log("at:", collide_x, collide_y)
      return {"x": collide_x, "y": collide_y}
    }
    return null
  }

function dot_on_section(point, line)
{
  console.log("dot on section args", point.x, point.y, line.x1, line.x2, line.y1, line.y2)
  //k = get_k_coef( x1, x2, y1, y2)
  //b = get_b_coef( x1, x2, y1, y2)

  if (line.x1 < point.x < line.x2 && line.y1 < point.y < line.y2)
  {
    console.log("dot on scetion indeed")
    return true
  }

  console.log("dot not on scetion")
  return false
}

function get_sestion_middle_coords(line)
{
  return new Point(null, line.x1+(line.x2-line.x1)/2, line.y1+(line.y2-line.y1)/2)
}
