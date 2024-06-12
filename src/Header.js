import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import log from './Logs';

function Header({switchEdge,title,handleToolChange,drawdegree,setAngleLine }) {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef(null); // Reference to the canvas element (assuming you have a canvas)
  const selectRef = React.createRef();

  const [rotateNo, setRotateNo] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown state on click
  };

  

  const drawLine = (context, start, end, thickness) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineWidth = thickness;
    context.stroke();
  };



  // Assuming you have a function to handle click events on the canvas to capture starting point for angles
  const handleCanvasClick = (event) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clickX = event.clientX - canvasRect.left;
    const clickY = event.clientY - canvasRect.top;

    // Add logic to handle starting point for angle drawing based on click coordinates
    setAngleLine([{ x1: clickX, y1: clickY, x2: clickX, y2: clickY }]); // Placeholder for starting point
  };

  useEffect(() => {
    // Assuming you have logic to set up the canvas element (e.g., size, event listeners)
  }, []);
  
  return (
    <header className="bg-stone-500 text-white p-4 flex">
     
      <div className="flex space-x-4">
        <select
          ref={selectRef} // Optional ref for accessing the select element
          name="tools"
          className="bg-white px-2 w-40 rounded text-gray-600"
          onChange={handleToolChange}
        >
          <option value="notool">Select a Tool</option>
          <option value="angle">Angle Tool</option>
          <option value="measure">Measure Tool</option>
        </select>
        <div class="inline-flex rounded-md px-6 " role="group">
                    <button type="button" onClick={()=>{drawdegree(0)}} class=" me-px px-9 w-48 py-1 text-sm font-medium text-gray-900 bg-white   rounded-s-lg hover:bg-gray-100 focus:z-10 focus:bg-blue-500 focus:text-white">
                         0 deg
                    </button>
                    <button type="button" onClick={()=>{drawdegree(45)}} class="me-px px-9 w-48 py-1 text-sm font-medium text-gray-900 bg-white   hover:bg-gray-100 focus:z-10 focus:bg-blue-500 focus:text-white">
                        45 deg
                    </button>
                    <button type="button" onClick={()=>{drawdegree(90)}} class="me-px px-9 w-48 py-1 text-sm font-medium text-gray-900 bg-white   hover:bg-gray-100 focus:z-10 focus:bg-blue-500 focus:text-white">
                        90 deg
                    </button>
                    <button onClick={switchEdge} type="button" class="me-px px-9 w-48 py-1 text-sm font-medium text-gray-900 bg-white   rounded-e-lg hover:bg-gray-100 focus:z-10 focus:bg-blue-500 focus:text-white">
                        Switch Edge
                    </button>
                </div> </div>
                <div className="flex space-x-4 padding-left">
    <div className="show-panel flex items-center justify-content-end">
      <FontAwesomeIcon icon={faTwitch} />
      <span className="text-white ml-2">Show Panel</span>
    </div>
    <div className="show-panel flex items-center justify-content-end"> 
      <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-blue-500" />
    </div>
  </div>
     
    </header>
  );
}

export default Header;
