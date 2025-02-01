export function getFormattedDateTime() {
  const date = new Date();

  // Get individual date components
  const month = date.getMonth() + 1; // Months are zero-indexed
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Last two digits of the year

  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Check if today
  const today =
    new Date().toDateString() === date.toDateString() ? " - Today" : "";

  // Construct the formatted string
  const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}${today}`;

  return formattedDateTime;
}
