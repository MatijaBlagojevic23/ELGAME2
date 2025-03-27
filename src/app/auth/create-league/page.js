"use client";
import "../../../styles/globals.css"; 
import { useState } from "react";

export default function CreateLeague() {
  const [leagueName, setLeagueName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("7 Days");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the start date is valid
    const today = new Date();
    const selectedDate = new Date(startDate);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (selectedDate < today || selectedDate > thirtyDaysFromNow) {
      setErrorMessage("Start date must be within the next 30 days.");
      return;
    }

    setErrorMessage("");

    // Handle form submission logic here
    console.log("League Name:", leagueName);
    console.log("Start Date:", startDate);
    console.log("Duration:", duration);
    // Add your API call or other logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a New League</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="leagueName" className="block text-sm font-medium text-gray-700 mb-1">
              League Name
            </label>
            <input
              type="text"
              id="leagueName"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="7 Days">7 Days</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
            </select>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Create League
          </button>
        </form>
      </div>
    </div>
  );
}
