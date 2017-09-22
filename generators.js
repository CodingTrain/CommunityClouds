
/**
 * Example rounded rectangle cloud
 */
function rectangle() {
  // Draw your cloud here
  rect(50, 50, width - 100, height - 100, 50);
  // Return an internal rectangle that it is safe to draw text within. Of the
  // form [top_left, top_right, width, height]
  return [100, 100, width - 200, height - 200];
}

// Register your function with register(function, style_name, author_name)
register(rectangle, "Example", "example");

/* Add your custom cloud generators here */
