export async function loadPlayers() {
  try {
    const response = await fetch("/igrica.csv");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const text = await response.text();
    console.log("Raw CSV Data:", text); // Debug: Check CSV content

    // Ensure we split correctly using semicolons (`;`)
    const rows = text.trim().split("\n").slice(1); // Remove header
    console.log("Parsed Rows:", rows); // Debug: Check split rows

    return rows
      .map((row) => {
        const columns = row.split(";"); // Fix: Split by `;`

        if (columns.length < 8) { // Assuming there's an additional column for countryClub
          console.warn("Skipping malformed row:", row);
          return null;
        }

        const [name, team, country, position, height, number, age, countryClub] = columns.map(col => col?.trim() || "");

        return {
          name,
          team,
          country,
          position,
          height: parseInt(height) || 0,
          number: parseInt(number) || 0,
          age: parseInt(age) || 0,
          countryClub // Ensure this is populated
        };
      })
      .filter(player => player !== null);
  } catch (error) {
    console.error("Error loading players:", error);
    return [];
  }
}
