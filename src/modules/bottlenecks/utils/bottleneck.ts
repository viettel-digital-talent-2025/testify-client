export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "HIGH":
      return "red";
    case "MEDIUM":
      return "orange";
    case "LOW":
      return "green";
    default:
      return "blue";
  }
};

export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "HIGH":
      return "🔴";
    case "MEDIUM":
      return "🟠";
    case "LOW":
      return "🟢";
    default:
      return "⚪";
  }
};
