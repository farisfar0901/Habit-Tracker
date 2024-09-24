import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './habitComponents.css';

const HabitComponent = ({ habits, handleClosePopups }) => {
  const [countValues, setCountValues] = useState({});
  const [clickedToday, setClickedToday] = useState(() => {
    const savedClickedToday = JSON.parse(localStorage.getItem('clickedToday'));
    return savedClickedToday || {};
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('lastClickedDate');
    if (storedDate !== today) {
      setClickedToday({});
      setCountValues({});
      localStorage.setItem('lastClickedDate', today);
    }
  }, []);

  const updateDailyCheck = async (habitId, habitDates, date, event) => {
    event.preventDefault();
    try {
      const todayDate = date.toISOString().split('T')[0];
      const todayCheck = habitDates.find((check) => check.date === todayDate);
      const currentCountValue = todayCheck ? todayCheck.count : 0;

      setCountValues(prevState => ({ ...prevState, [habitId]: currentCountValue }));

      if (!clickedToday[habitId]) {
        setClickedToday(prevState => ({ ...prevState, [habitId]: true }));
        localStorage.setItem('clickedToday', JSON.stringify({ ...clickedToday, [habitId]: true }));
      }

      if (currentCountValue < 4) {
        const updatedCountValue = currentCountValue + 1;
        setCountValues(prevState => ({ ...prevState, [habitId]: updatedCountValue }));

        const formattedDate = date.toISOString().split('T')[0];
        const newDailyCheckObj = { date: formattedDate, count: updatedCountValue };

        await axios.post(`/update-daily-check/${habitId}`, newDailyCheckObj);

        toast.success('Habit Completed for the day!');
      } else {
        toast.success('Max Completions of 4 reached');
      }

      handleClosePopups();
    } catch (error) {
      toast.error('Error updating daily check');
      console.error('Error updating daily check:', error.response?.data || error.message);
    }
  };

  return (
    <div className="habit-container">
      {habits.map((habit) => (
        <div key={habit._id} className="habit-entry">
          <label className="habit-name" htmlFor={`habit-${habit._id}`}>
            {habit.habit_name} {habit.emoji}
            <br />
            <button
              id={`habit-${habit._id}`}
              className={`add-entry-btn ${clickedToday[habit._id] ? 'clicked-today' : ''}`}
              onClick={(event) => updateDailyCheck(habit._id, habit.daily_check, new Date(), event)}
            >
              {clickedToday[habit._id] && <span className="checkmark-animation">✓</span>}
            </button>
          </label>
        </div>
      ))}
    </div>
  );
};

export default HabitComponent;
