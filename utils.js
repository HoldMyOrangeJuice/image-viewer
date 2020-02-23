function getAngleBetweenLines(line1, line2, angle_mode)
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

  let quarter


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
  if (angle_mode == "big")
  {
    return 180/Math.PI * Math.abs(angle1 - angle2)
  }
  else
  {
    return 180-(180/Math.PI * Math.abs(angle1 - angle2))
  }

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
    let id = line1.id
    let nodes
    if (id == "canvas_first")
      nodes = nodes1
    else {
      nodes  = nodes2
    }

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
      let cross = new Point(id, collide_x, collide_y)

      //nodes.push(cross)
      //draw_node(cross, "red")
      return cross
    }
    return null
  }

function dot_on_section(point, line)
{
  //k = get_k_coef( x1, x2, y1, y2)
  //b = get_b_coef( x1, x2, y1, y2)

  if (Math.min(line.x1, line.x2) < point.x &&
    Math.max(line.x1, line.x2) > point.x &&
    Math.min(line.y1, line.y2) < point.y &&
    Math.max(line.y1, line.y2) > point.y
    )
  {
    return true
  }

  return false
}

function get_sestion_middle_coords(point1, point2)
{
  max_x = Math.max(point1.x, point2.x)
  max_y = Math.max(point1.y, point2.y)
  min_x = Math.min(point1.x, point2.x)
  min_y = Math.min(point1.y, point2.y)
  return new Point(point1.id, min_x+(max_x-min_x)/2, min_y+(max_y-min_y)/2)
}


function angle_is_smaller(dot1, dot2, line1, line2)
{
  let crossPoint = line_cross_coordinates(line1, line2)
  let mirrored_dot_x = crossPoint.x + (crossPoint.x - dot1.x )
  let mirrored_dot_y = get_k_coef(line1) * mirrored_dot_x + get_b_coef(line1)
  let mirrored_point = new Point(null, mirrored_dot_x, mirrored_dot_y)
  if (dot1.distance(dot2) < mirrored_point.distance(dot2))
  {
    return true
  }
  return false
}

function get_triangle_center(dot1, dot2, dot3)
{
  return new Point(null, (dot1.x + dot2.x + dot3.x)/3, (dot1.y + dot2.y + dot3.y)/3)
}
