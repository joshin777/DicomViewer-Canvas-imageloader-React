import React, { useState, useEffect } from 'react';

function Timer({endTime}) {
  const [seconds, setSeconds] = useState(0); // Removed unused variables

  useEffect(() => {
    let intervalId; // Declare intervalId inside useEffect

    function startTimer() {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    function stopTimer() {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    startTimer();

    return () => {
      stopTimer();
    };
  }, []); // Empty dependency array

  const formattedTime = formatTime(seconds);

  return (
    <div className="items-center mb-4">
    <div className="col-12">
      <span className="text-gray-700 mr-2">Timer:</span>
      <span id="timer" className="text-xl font-bold">
        {formattedTime}
      </span>
    </div>

    <div className="col-12">
    <span className="text-gray-700 mr-2">Load Time:</span>
      <span id="timer" className="text-xl font-bold">
      {endTime && <span> {endTime}ms</span>}
      </span>
    </div>
      {/* {endTime && <span>Load Time : {endTime}ms</span>} */}
      
    </div>
    
  );
}

function formatTime(seconds) {
  const pad = (num, size) => String(num).padStart(size, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(remainingSeconds, 2)}`;
}

export default Timer;
