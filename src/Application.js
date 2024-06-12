import { measureTool } from "./baseTool";
import log from "./LogClass";
export const handleMouseUp = (event,canvas,state,modal,setLinePoints,linePoints,setLines,setAngleLine,setCurrentDistance,send,angle) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (state.matches("active")) {

    const { rotatedX1, rotatedX2, rotatedY1, rotatedY2 } = drawRotatedLine(
      canvas.getContext("2d"),
      linePoints[0].x,
      linePoints[0].y,
      x,
      y,
      angle
    );
    setLinePoints([{ x: rotatedX1, y: rotatedY1 }]);

    if(state.matches("active.measure"))
      {
        const distance = measureTool.handleMouseUp(
          event,state,setLinePoints,linePoints,measureDistance,setCurrentDistance,send,modal,setLines, rotatedX1,
          rotatedY1,
          rotatedX2,
          rotatedY2)
        if(distance>90)
        {
          modal.open();
        }
        else
        {
   

    setLinePoints((prevLinePoints) => [ { x : rotatedX1, y :rotatedY1 },{x:rotatedX2,y:rotatedY2}]);
    if (linePoints.length >= 1) {
      // const distance = measureDistance( { x: rotatedX1, y: rotatedY1 },
      //   { x: rotatedX2, y: rotatedY2 });
      setLines((prevLines)=> {
        return [...prevLines ,{ x1: rotatedX1,
          y1: rotatedY1,
          x2: rotatedX2,
          y2: rotatedY2,
          distance: distance,}]});
// drawLine(state,send,canvas.getContext('2d'), { x: rotatedX1, y: rotatedY1 },
// { x: rotatedX2, y: rotatedY2 },distance)
log.addLog(`Drew a line of measure ${distance.toFixed(2)}px`)
        
  } 
} 
      }

if(state.matches("active.angle"))
  {

        setLinePoints((prevLinePoints) => [ { x : rotatedX1, y :rotatedY1 },{x:rotatedX2,y:rotatedY2}]);

        setAngleLine((prevLines)=> {
            return [...prevLines , { x1: rotatedX1,
              y1: rotatedY1,
              x2: rotatedX2,
              y2: rotatedY2,}]
             })
      
             if (linePoints.length >= 1) {
              const distance = measureDistance( { x: rotatedX1, y: rotatedY1 },
                { x: rotatedX2, y: rotatedY2 });
              drawLine(state,send,canvas.getContext('2d'), { x: rotatedX1, y: rotatedY1 },
              { x: rotatedX2, y: rotatedY2 }, distance);
             }  
}
    }
}

export function drawRotatedLine(context, x1, y1, x2, y2, rotateNo) {
  debugger
  let rotatedX1 = x1,
    rotatedX2 = x2,
    rotatedY1 = y1,
    rotatedY2 = y2;
    let r =0;
    if(rotateNo==90)
      {
        r=1;
      }
      else if(rotateNo==180)
        {
          r=2;
        }
        else if(rotateNo==270)
          {
            r=3;
          }
          else
          {
            r=0;
          }
  if (rotateNo != 0) {
    if (r == 2) {
      rotatedX1 =
        (250 - x1) * Math.cos(Math.PI * (r)) +
        (250 - y1) * Math.sin(Math.PI * (r)) +
        250;
      rotatedY1 =
        (250 - x1) * -Math.sin(Math.PI * (r)) +
        (250 - y1) * Math.cos(Math.PI * (r)) +
        250;
      rotatedX2 =
        (250 - x2) * Math.cos(Math.PI * (r)) +
        (250 - y2) * Math.sin(Math.PI * (r)) +
        250;
      rotatedY2 =
        (250 - x2) * -Math.sin(Math.PI * (r)) +
        (250 - y2) * Math.cos(Math.PI * (r)) +
        250;
      //change in the angle calculation and the negative sign before Math.sin(Math.PI * rotateNo) in the
      //rotatedY1 and rotatedY2 calculations. This is because when rotating 180 degrees, the y-coordinate changes sign.
    } else {
      rotatedX1 =
        (250 - x1) * Math.cos((Math.PI / 2) * (r)) -
        (250 - y1) * Math.sin((Math.PI / 2) * (r)) +
        250;
      rotatedY1 =
        (250 - x1) * Math.sin((Math.PI / 2) * (r)) +
        (250 - y1) * Math.cos((Math.PI / 2) * (r)) +
    250;
      rotatedX2 =
        (250 - x2) * Math.cos((Math.PI / 2) * (r)) -
        (250 - y2) * Math.sin((Math.PI / 2) * (r)) +
        250;
      rotatedY2 =
        (250 - x2) * Math.sin((Math.PI / 2) * (r)) +
        (250 - y2) * Math.cos((Math.PI / 2) * (r)) +
        250;
    }
  }
  return { rotatedX1, rotatedX2, rotatedY1, rotatedY2 };
}



export function drawLine(state,send,context, startPoint, endPoint, distance) {
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
  
  if(state.matches("active.measureValueDisplayed"))
    {
      send({type: 'DRAW_COMPLETE' })
    }
  }



 export const measureDistance = (point1, point2) => {
    const deltaX = (point2.x - point1.x);
    const deltaY = (point2.y - point1.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
  };
  