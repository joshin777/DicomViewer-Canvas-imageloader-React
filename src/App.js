import React, { useState, useEffect,useRef } from 'react';
import './App.css'; 
import { measureTool } from './baseTool';
import ImageDisplay from './ImageDisplay';
import Timer from './Timer';
import MetaInfo from './MetaInfo';
import Logs from './Logs';
import Header from './Header';
import log from './LogClass';
import { useMachine } from '@xstate/react';
import { myMachine } from './Xstatefile';
import MeasureModal from './measureModal';
import Modal from './Modal';
import { BaseTool,Measure,Angle } from './baseTool';
import { handleMouseUp } from './Application';
import { drawLine } from './Application';
import { measureDistance } from './Application';
function App() {
  const [currentTool,setCurrentTool]= useState()
  const [state,send, service] = useMachine(myMachine);
  const [selectedAngle, setSelectedAngle] = useState(0);
const [initial,setInitial]=useState(0)
  const handleAngleDropdownItemClick = (angle) => {
    setSelectedAngle(angle);
  };
  const [currentDistance,setCurrentDistance] = useState()
 
  const [selectedTab, setSelectedTab] = useState('metaInfo'); 
  const modal = useRef(null);
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };


  const handleToolChange = (event) => {
    const selectedTool = event.target.value;
    if(selectedTool=="notool")
      {
        send({type:"DESELECT_TOOL"});
        log.addLog(`Deselected Tool`)
      }
    
      else
      {  
        send({type: 'SELECT_TOOL', tool : selectedTool })
        log.addLog(`Selected ${selectedTool} tool`)
      }
    
  };

const [endTime,setEndTime]=useState()
  const [imageInfo, setImageInfo] = useState({}); // State to store image information

  
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(''); // Replace with your initial image source
  const [angle, setAngle] = useState(0); // Rotation angle state (in degrees)
  const [isLoaded, setIsLoaded] = useState(false);

  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [linePoints, setLinePoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [angleLine, setAngleLine] = useState([]);
  const [angles, setAngles] = useState([]);
  const handleMouseDown = (event) => {
    
 
 
console.log("mouse doen event")

    const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
        if ( linePoints.length >= 2) {
          setLinePoints([]);
        }
          setLinePoints([{ x, y }]);
      }         
      
  

  

function modalOnConfirm()
{
  send({type: 'CONFIRM' })
  modal.current.close();
  log.addLog(`Drew a line of measure ${currentDistance.toFixed(2)}px`)
  setLines((prevLines)=> {
    return [...prevLines , {x1 : linePoints[0].x, y1 : linePoints[0].y, x2:linePoints[1].x, y2:linePoints[1].y,distance:currentDistance}]
  })
  setCurrentDistance();



}


function modalOnCancel()
{
  modal.current.close();
  send({type: 'CANCEL' })
  setCurrentDistance();
  log.addLog(`Cancelled a line of measure ${currentDistance}px`)
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
    // log.addLog(`Drew an angle of ${degree} degree`);

    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(angleLine[0].x2,  angleLine[0].y2);
    context.lineTo(endX, endY );
    context.lineWidth = 2;
    context.setLineDash([]);
    context.strokeStyle = "red";
    context.stroke();
  
    // drawLine(context, { x: angleLine[0].x2, y: angleLine[0].y2 }, { x: endX, y: endY }, 1);
    context.fillText( `Angle: ${degree.toFixed(2)}°`, endX + 5, endY + 5);
    log.addLog(`Drew an angle of ${degree} degree`)
    setAngleLine([]);
  }
};






  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
   
    // Set fixed canvas dimensions
    canvas.width = 500;
    canvas.height = 500;

    // Optional: Draw something on the canvas (replace with your drawing logic)
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

 
    const drawImage = (selectedFile) => {
      const image = new Image();
      const starttime = Date.now()
      image.onload = () => {
      {initial ==0 &&  log.addLog(`Uploaded file ${imageInfo.name} of size ${imageInfo.size.toFixed(2)}kbs`)}
       setInitial(1)
        const endDate=Date.now()-starttime;
        setEndTime(endDate)
        console.log(endDate,"ms of time")
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        let newWidth;
        let newHeight;
        setImageInfo((prevState)=>{return {...prevState,width:image.naturalWidth,height:image.naturalHeight}})
   
        console.log('ctx',newWidth,newHeight)



        // Maintain aspect ratio
        if (image.naturalWidth > image.naturalHeight) {
          newWidth = canvas.width;
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = canvas.height;
          newWidth = newHeight * aspectRatio;
        }


        setNewHeight(newHeight.toFixed(2));
        setNewWidth(newWidth.toFixed(2));
     
if (isLoaded) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Clear the canvas before redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save the canvas context state before rotation
        ctx.save();

        // Translate the context to the image center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Rotate the context by the current angle
        ctx.rotate(angle * Math.PI / 180); // Convert angle from degrees to radians
        
        // Draw the image centered within the canvas
        ctx.drawImage(
          image,
          -newWidth/2,
          -newHeight/2,
          newWidth,
          newHeight
        );
        ctx.translate(-500/2, -500/2);
        // Restore the canvas context state
      


        
    lines.map((line)=>{
      drawLine(state,send,canvasRef.current.getContext('2d'), {x:line.x1,y:line.y1}, {x:line.x2,y:line.y2}, line.distance);
    })
const fx1= (500-newWidth)/2 + newWidth/4;
const fy1 = (500-newHeight)/2 + newHeight/2;
const fx2 = (500-newWidth)/2 + newWidth*3/4;
const fy2 = (500-newHeight)/2 + newHeight/2
        
    ctx.moveTo((500-newWidth)/2 + newWidth/4, (500-newHeight)/2 + newHeight/2);
    ctx.lineTo((500-newWidth)/2 + newWidth*3/4,(500-newHeight)/2 + newHeight/2);
  
  console.log(newWidth,newHeight,"wd hi")
  const sx1 = (500-newWidth)/2 + newWidth/2;
  const sx2 = (500-newWidth)/2 + newWidth/2;
  const sy1 = (500-newHeight)/2 + newHeight/4;
const sy2 = (500-newHeight)/2 + newHeight*3/4;

    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeStyle = "red"
    ctx.stroke();

    ctx.moveTo((500-newWidth)/2 + newWidth/2, (500-newHeight)/2 + newHeight/4);
    ctx.lineTo((500-newWidth)/2 + newWidth/2, (500-newHeight)/2 + newHeight*3/4);

    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeStyle = "red"
    ctx.stroke();


console.log(sx1,sy1,sx2,sy2)
console.log(fx1,fy1,fx2,fy2)
   
        // Tooltip
        canvas.addEventListener('mousemove', (e)=>{handleMouseMove(e,[
          [[fx1,fy1],[fx2,fy2]],
          [[sx1,sy1],[sx2,sy2]]
        ])});
        canvas.addEventListener('mousemove', (e)=>{handleMouseOut(e,[
          [[fx1,fy1],[fx2,fy2]],
          [[sx1,sy1],[sx2,sy2]]
        ])});
 
        


    angles.map((lineredraw,index) => {
      ctx.beginPath();
      ctx.moveTo(lineredraw.coord.x1, lineredraw.coord.y1);
      ctx.lineTo(lineredraw.coord.x2, lineredraw.coord.y2);
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lineredraw.coord2.x1, lineredraw.coord2.y1);
      ctx.lineTo(lineredraw.coord2.x2, lineredraw.coord2.y2);
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeStyle = "red";
      ctx.stroke();
    
  
  
      ctx.font = "12px Arial";
      ctx.fillStyle = "red";
      ctx.fillText( `Angle: ${lineredraw.angle.toFixed(2)}°`,lineredraw.coord2.x2 + 5, lineredraw.coord2.y2 + 5);
     
    })

        setIsLoaded(true);
        // if (handleImageLoad) {
        //   handleImageLoad(updatedImageInfo); // Call provided function to handle image load
        // }
      };
      image.src = imageSrc; // Update image if source changes
    };

    drawImage(); // Draw the initial image

    // Handle window resize to adjust image within the canvas
    const handleResize = () => {
      drawImage();
    };

    window.addEventListener('resize', handleResize);

    return () =>{
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousemove', handleMouseOut);
      window.removeEventListener('resize', handleResize);
    } 
  }, [imageSrc, angle,angles,lines,newWidth, newHeight]); // Re-render on image source or angle change

  const handleMouseMove = (e,guideLine) => {
    console.log(guideLine,"guidline")
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

const x1 = guideLine[0][0][0]
const x2 = guideLine[0][1][0]
const y1 = guideLine[0][0][1]
const y2 = guideLine[0][1][1]

const sx1 = guideLine[1][0][0]
const sx2 = guideLine[1][1][0]
const sy1 = guideLine[1][0][1]
const sy2 = guideLine[1][1][1]

const x2x = x2-mouseX;
const x2x1 = x2-x1;
const y2y1 = y2-y1;
const lineEq = (x2x * y2y1 / x2x1)-y2

const sx2x = sx2-mouseX;
const sx2x1 = sx2-sx1;
const sy2y1 = sy2-sy1;
const slineEq = (sx2x * sy2y1 / sx2x1)-sy2

if((-mouseY).toFixed(0) == lineEq.toFixed(0)  || (-mouseY).toFixed(0) == slineEq.toFixed(0) || sx2x.toFixed(0)==0)
  {
    console.log(guideLine);
        const tooltip = tooltipRef.current;
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
    
    tooltip.style.left = mouseX + 'px';
    tooltip.style.top = mouseY + 'px';
    tooltip.style.display = 'block';
  }


};

const handleMouseOut = (e,guideLine) => {
  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

const x1 = guideLine[0][0][0]
const x2 = guideLine[0][1][0]
const y1 = guideLine[0][0][1]
const y2 = guideLine[0][1][1]

const sx1 = guideLine[1][0][0]
const sx2 = guideLine[1][1][0]
const sy1 = guideLine[1][0][1]
const sy2 = guideLine[1][1][1]


const x2x = x2-mouseX;
const x2x1 = x2-x1;
const y2y1 = y2-y1;
const lineEq = (x2x * y2y1 / x2x1)-y2


const sx2x = sx2-mouseX;
const sx2x1 = sx2-sx1;
const sy2y1 = sy2-sy1;
const slineEq = (sx2x * sy2y1 / sx2x1)-sy2

console.log("sx2x",sx2x.toFixed(0))
if(((-mouseY).toFixed(0) != lineEq.toFixed(0)) && sx2x.toFixed(0) != 0)
  {
    const tooltip = tooltipRef.current;
tooltip.style.display = 'none';
  }

};




  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImageInfo({name:selectedFile.name,size:selectedFile.size})
    console.log(selectedFile,"htfhjfhfhfhkfhfhf")
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); // Update image source state with the loaded image data URL
      };
      reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
    }
  };
  function switchEdge()
{

  const angleEq = angles[angles.length - 1];

  const updatedangle = [...angles]
  updatedangle.pop();
  setAngles(updatedangle)
  
  const degree = angleEq.angle;
  const startpoint = angleEq.coord;
  let angle=0
  const slope = (startpoint.y2 - startpoint.y1) / (startpoint.x2 - startpoint.x1);
  if(degree == 90)
  {
    angle = Math.atan(slope) - Math.PI / 180 * degree ;
  //  - Math.PI / 180 * 2* degree;
  }
  else
  {
    angle = Math.atan(slope) - Math.PI / 180 *(180-degree) 
  
  }
  

  if(angleEq.edge=="end")
  {
    
  const endX = startpoint.x1 + Math.cos(angle) * 100;
  const endY = startpoint.y1 + Math.sin(angle) * 100;
  setAngles((prevAngle)=>{
    return [...prevAngle, {edge:"start" ,coord : startpoint,angle:degree,coord2: {x1 : startpoint.x1, y1 :  startpoint.y1, x2:endX, y2:endY}}];
  })

  // drawLine(canvasRef.current.getContext('2d'), {x : startpoint.x1, y :  startpoint.y1}, {x:endX,y:endY}, 1);
  }

  if(angleEq.edge=="start")
  {
    const endX = startpoint.x2 + Math.cos(angle) * 100;
    const endY = startpoint.y2 + Math.sin(angle) * 100;

    setAngles((prevAngle)=>{
    return [...prevAngle, {edge:"end" ,coord : startpoint,angle:degree,coord2: {x1 : startpoint.x2, y1 : startpoint.y2, x2:endX, y2:endY}}];
  })
  }
  log.addLog(`Switched edge of an angle`)

  setAngleLine([]);
}
  const handleLoadUnload = () => {
    if (isLoaded) {
      // Clear the canvas and reset image source and loaded flag
      log.addLog(`Unloaded file ${imageInfo.name}`)
      setImageSrc('');
      setIsLoaded(false);
      setLines([])
      setAngles([])
      setInitial(0)
    } else {
      // Simulate clicking the hidden file input to trigger image loading
      document.getElementById('image-input').click();
    }
  };
  
  const handleRotate = () => {
    setAngle((prevAngle) => (prevAngle + 90) % 360);
    log.addLog(`Rotated Image by 90 degree`) // Update angle by 90 degrees and keep it within 0-360 range
  };

  return (
    <div className="h-screen"style={{ backgroundColor:'#797273' }}>
      <Header switchEdge={switchEdge} handleToolChange={handleToolChange} drawdegree={drawdegree} setAngleLine={setAngleLine}/> {/* Assuming Header component */}
      <div className="flex gap-4">
      <div className="flex-grow bg-gray-200 p-4">
      <canvas ref={canvasRef} className="mx-auto" onMouseDown={handleMouseDown} onMouseUp={(e)=>{handleMouseUp(e,canvasRef.current,state,modal.current,setLinePoints,linePoints,setLines,setAngleLine,setCurrentDistance,send,angle)}} style={{border:"1px solid black"}}/>
      <div ref={tooltipRef} className="tooltip">
                {newWidth/2} px X {newHeight/2} px
            </div>

<div className=" flex  gap-2 p-4 rounded-lg z-50"style={{ marginTop:'20px',justifyContent:'center',backgroundColor:'#797273' }}>
  <button className={`btn btn-primary card-button ${isLoaded ? '' : 'pointer-disabled'}`} onClick={handleRotate} disabled={!isLoaded}>
    Rotate
  </button>
  <button className="btn btn-outline card-button">
    Button 2
  </button>
  <button className="btn btn-outline card-button">
    Button 3
  </button>
  <button className="btn btn-primary card-button" onClick={handleLoadUnload}>
    {isLoaded ? 'Unload' : 'Load'}
  </button>
  <input type="file" id="image-input" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
</div>

      </div>

        <div className="bg-white shadow-md rounded-lg p-4"style={{ width: '435px' }}>
          <Timer endTime={endTime}/>

          <ul className="flex mb-4 border-b border-gray-300">
            <li
              className={`-mr-px w-full flex items-center py-2 pl-4 font-medium text-center ${
                selectedTab === 'metaInfo' ? 'text-indigo-500' : 'text-gray-700'
              }`}
              onClick={() => handleTabChange('metaInfo')}
            >
              Image Info
            </li>
            <li
              className={`w-full flex items-center py-2 pl-4 text-center font-medium h-full overflow-auto ${
                selectedTab === 'logs' ? 'text-indigo-500' : 'text-gray-700'
              }`}
              onClick={() => handleTabChange('logs')}
            >
              Logs
            </li>
          </ul>

          {selectedTab === 'metaInfo' && <MetaInfo imageInfo={imageInfo} />}
          {selectedTab === 'logs' && <Logs imageInfo={imageInfo}/>}
        </div>
        <div className='absolute bottom-2 right-4 flex flex-col gap-1'>
      {lines?.map(m=>{
        return (
          <MeasureModal key={m.distance} data={m.distance.toFixed(2)}>
          </MeasureModal>
        )
      })}
      </div>
      </div>
      <Modal ref={modal} modalOnConfirm={modalOnConfirm} modalOnCancel={modalOnCancel}/>

    </div>
    
  );
}

export default App;
