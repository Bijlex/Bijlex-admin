// Function to calculate line equation
export const calculateLineEquation = (dot1, dot2) => {
  const slope = (dot2.y - dot1.y) / (dot2.x - dot1.x);
  const yIntercept = dot1.y - slope * dot1.x;
  return { slope, yIntercept };
};

// Function to generate table data for a line
export const generateTableDataForLine = (
  line,
  XMinRange = -10,
  XMaxRange = 10
) => {
  const { slope, yIntercept } = calculateLineEquation(line[0], line[1]);
  let tableData = [];

  // Get the unique x values from the line points, assuming line is an array of point objects
  const xValues = line
    .map((point) => point.x)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Function to check and add points if they meet the criteria
  const checkAndAddPoint = (x) => {
    let y = slope * x + yIntercept;
    // Check for whole number y values with a margin for floating-point issues
    if (Math.abs(Math.round(y) - y) < 0.0001) {
      tableData.push({ x, y: Math.round(y) });
    }
  };

  // Search for points near each line[i].x
  xValues.forEach((xValue) => {
    // Check in the vicinity of the x value
    for (let dx = -1; dx <= 1; dx++) {
      let newX = xValue + dx;
      // Ensure newX is within the specified range
      if (newX >= XMinRange && newX <= XMaxRange) {
        checkAndAddPoint(newX);
      }
    }
  });

  // Limit the points to 7, prioritizing those closest to the original line points
  tableData = tableData.slice(0, 7);

  // Sort the tableData array from lowest to highest x values
  tableData.sort((a, b) => a.x - b.x);

  return tableData;
};

// Function to format equation for display
export const formatEquation = ({ slope, yIntercept }) => {
  return `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}`;
};
