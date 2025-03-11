export async function loadPlayers() {
  try {
    const response = await fetch("/igrica.csv");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const text = await response.text();
    const rows = text.trim().split("\n").slice(1); // Remove header

    return rows
      .map((row) => {
        const columns = row.split(";");

        if (columns.length < 9) { // Updated to expect 9 columns including birthdate
          console.warn("Skipping malformed row:", row);
          return null;
        }

        const [name, team, country, position, height, number, age, countryClub, birthdate] = columns.map(col => col?.trim() || "");

        return {
          name,
          team,
          country,
          position,
          height: parseInt(height) || 0,
          number: parseInt(number) || 0,
          age: calculateAge(birthdate), // Calculate age dynamically
          countryClub,
          birthdate // Keep birthdate for reference
        };
      })
      .filter(player => player !== null);
  } catch (error) {
    console.error("Error loading players:", error);
    return [];
  }
}

// 🟢 Function to calculate age dynamically
function calculateAge(birthdate) {
    if (!birthdate) return 0; // Return 0 if birthdate is missing

    const [day, month, year] = birthdate.split(".").map(Number); // Convert "15.5.2006" to numbers
    if (!day || !month || !year) return 0; // Handle invalid dates

    const birth = new Date(year, month - 1, day); // Month is 0-indexed in JS
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
