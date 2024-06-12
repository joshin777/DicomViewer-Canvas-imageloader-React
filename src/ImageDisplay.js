import React, { useRef, useEffect, useState } from 'react';

function ImageDisplay({ imageInfo,setImageInfo,setEndTime,currentTool}) {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [angle, setAngle] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);


  const [linePoints, setLinePoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [angleLine, setAngleLine] = useState([]);
  const [angles, setAngles] = useState([]);
  const handleMouseDown = (event) => {

    if(currentTool=="measure")
{console.log("mouse doen event")

    const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
        if ( linePoints.length >= 2) {
          setLinePoints([]);
        }
          setLinePoints([{ x, y }]);
      }         
      
  }

  const handleMouseUp = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if(currentTool=="measure")
    {

   

    setLinePoints((prevLinePoints) => [ { x : prevLinePoints[0].x, y : prevLinePoints[0].y },{x,y}]);
    if (linePoints.length >= 1) {
      const distance = measureDistance(linePoints[0], {x,y});
      setLines((prevLines)=> {
        return [...prevLines , {x1 : linePoints[0].x, y1 : linePoints[0].y, x2:x, y2:y,distance:distance}]});
drawLine(canvasRef.current.getContext('2d'),linePoints[0],{x,y},distance)
        
  } 
} 


        setLinePoints((prevLinePoints) => [ { x : prevLinePoints[0].x, y : prevLinePoints[0].y },{x,y}]);

        setAngleLine((prevLines)=> {
            return [...prevLines , {x1 : linePoints[0].x, y1 : linePoints[0].y, x2:x, y2:y}]
             })
      
             if (linePoints.length >= 1) {
              const distance = measureDistance(linePoints[0], {x,y});
              drawLine(canvasRef.current.getContext('2d'), linePoints[0], {x,y}, distance);
             }  
           


}


const drawdegree = (degree) => {
  if (angleLine.length !== 0) {
    const startpoint = angleLine[0];
    let angle = 0;
    const slope = (startpoint.y2 - startpoint.y1) / (startpoint.x2 - startpoint.x1);

    if (degree === 90) {
      angle = Math.atan(slope) - Math.PI / 180 * degree;
    } else {
      angle = Math.atan(slope) - Math.PI / 180 * (180 - degree);
    }

    const endX = startpoint.x2 + Math.cos(angle) * 100;
    const endY = startpoint.y2 + Math.sin(angle) * 100;

    setAngles((prevAngle) => [
      ...prevAngle,
      {
        edge: 'end',
        coord: angleLine[0],
        angle: degree,
        coord2: { x1: angleLine[0].x2, y1: angleLine[0].y2, x2: endX, y2: endY },
      },
    ]);


    const context = canvasRef.current.getContext('2d');
    drawLine(context, { x: angleLine[0].x2, y: angleLine[0].y2 }, { x: endX, y: endY }, 1);

    setAngleLine([]);
  }
};

const measureDistance = (point1, point2) => {
  const deltaX = (point2.x - point1.x);
  const deltaY = (point2.y - point1.y);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return distance;
};


function drawLine(context, startPoint, endPoint, distance) {
  context.beginPath();
  

  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(endPoint.x, endPoint.y);
  context.lineWidth = 2;
  context.setLineDash([]);
  context.strokeStyle = "red"
  context.stroke();

// Draw distance label
context.font = "12px Arial";
context.fillStyle = "red";
context.fillText(`Distance: ${distance.toFixed(2)} px`, endPoint.x + 5, endPoint.y + 5);


}

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImageInfo({name:selectedFile.name,size:selectedFile.size})
// console.log(selectedFile,"htfhjfhfhfhkfhfhf")
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Update image source state with the loaded image data URL
      };
      reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
    }
  };
  const handleLoadUnload = () => {
    if (isLoaded) {
      // Clear the canvas and reset image source and loaded flag
      setImageSrc('');
      setIsLoaded(false);
    } else {
      // Simulate clicking the hidden file input to trigger image loading
      document.getElementById('image-input').click();
    }
  };

  const handleRotate = () => {
    setAngle((prevAngle) => (prevAngle + 90) % 360); // Update angle by 90 degrees and keep it within 0-360 range
  };

  return (
    <div className="flex-grow bg-gray-200 p-4">
      <canvas ref={canvasRef} className="mx-auto" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}/>
      {/* Overlay container for buttons */}
      {/* <div className="absolute bottom-0 left-2 flex flex-col gap-2 p-4 bg-gray-900/50 rounded-lg z-50">
        <button className="btn btn-primary" onClick={handleRotate}>
          Rotate
        </button>
        <button className="btn btn-outline" onClick={() => console.log('Button 2 clicked')}>
          Button 2
        </button>
        <button className="btn btn-outline" onClick={() => console.log('Button 3 clicked')}>
          Button 3
        </button>
        <button className="btn btn-primary" onClick={handleLoadUnload}>
          {isLoaded ? 'Unload' : 'Load'}
        </button>
        <input type="file" id="image-input" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
      </div> */}

      {/* <div class="inline-flex flex-col shadow-sm absolute w-40 bottom-[150px] left-12" role="group">
  <button onClick={handleRotate} type="button" class="disabled:cursor-not-allowed px-4 py-5 text-md font-medium text-gray-900 bg-white border border-gray-200  hover:bg-gray-100 rounded-t-lg focus:z-10 focus:ring-2 focus:ring-sky-500 focus:text-sky-500">
    Rotate
  </button>
  <button type="button" class="px-4 py-5 text-md font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-2 focus:ring-sky-500 focus:text-sky-500">
    Button 2
  </button>
  <button type="button" class="px-4 py-5 text-md font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-2 focus:ring-sky-500 focus:text-sky-500">
    Button 3
  </button>
  <button onClick={handleLoadUnload} type="button" class="px-4 py-5 text-md font-medium text-gray-900 bg-white border border-gray-200  hover:bg-gray-100 rounded-b-lg focus:z-10 focus:ring-2 focus:ring-sky-500 focus:text-sky-500">
  {isLoaded ? 'Unload' : 'Load'}
  </button>
  <input type="file" id="image-input" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
</div> */}
    </div>
  

  );
}

export default ImageDisplay;
