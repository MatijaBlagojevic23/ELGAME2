"use client";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New League</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="leagueName" className="block text-sm font-medium text-gray-700">
            League Name
          </label>
          <input
            type="text"
            id="leagueName"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create League
        </button>
      </form>
    </div>
  );
}
