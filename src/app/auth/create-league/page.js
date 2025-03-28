"use client";
import "../../../styles/globals.css"; 
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../utils/supabase";
import { v4 as uuidv4 } from 'uuid';

export default function CreateLeague() {
  const [leagueName, setLeagueName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("7 Days");
  const [percentage, setPercentage] = useState("100%");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const user_id = searchParams.get("user_id");
    const user_email = searchParams.get("user_email");
    if (user_id && user_email) {
      setUserId(user_id);
      setUserEmail(user_email);
    } else {
      setErrorMessage("User information is missing.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail || !userId) {
      setErrorMessage('User information is not available.');
      return;
    }

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

    // Check if the league name is unique
    const { data: existingLeague, error: fetchError } = await supabase
      .from('leagues')
      .select('name')
      .eq('name', leagueName)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching league:', fetchError);
      setErrorMessage('Error checking league name. Please try again.');
      return;
    }

    if (existingLeague) {
      setErrorMessage('League name already exists. Please choose a different name.');
      return;
    }

    // Calculate the end date
    let endDate = new Date(startDate);
    switch (duration) {
      case "7 Days":
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "1 Month":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "3 Months":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "6 Months":
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case "1 Year":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        break;
    }

    // Generate a unique league ID and invitation code
    const leagueId = uuidv4();
    const invitationCode = uuidv4();

    // Insert the league details into the Supabase leagues table
    const { data, error } = await supabase
      .from('leagues')
      .insert({
        league_id: leagueId,
        name: leagueName,
        start_date: startDate,
        end_date: endDate,
        participants: 1,
        percentage: parseInt(percentage),
        invitation_code: invitationCode,
        user_id: userId // Include user_id in the league details
      });

    if (error) {
      console.error('Error creating league:', error);
      setErrorMessage('Error creating league. Please try again.');
      return;
    }

    console.log('League created successfully:', data);

    // Call the API to send email and create table
    try {
      const response = await fetch('/api/create-league', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,  // Use the actual user email
          league_name: leagueName,
          invitation_code: invitationCode,
          league_id: leagueId,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (response.ok) {
        console.log('League created and email sent successfully');
      } else {
        const errorData = await response.json();
        console.error('Error creating league and sending email:', errorData.message);
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage('Network error. Please try again.');
    }
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
          <div>
            <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
              Amount of Total Games Played
            </label>
            <select
              id="percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="100%">100%</option>
              <option value="90%">90%</option>
              <option value="80%">80%</option>
              <option value="70%">70%</option>
              <option value="60%">60%</option>
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
