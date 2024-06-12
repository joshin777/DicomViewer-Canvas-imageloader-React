import log from './LogClass';



export class BaseTool
{
    constructor()
    {

    }

    handleMouseDown(event,state,linePoints,setLinePoints,x,y)
    {
        if(state.matches("active"))
    {
      if ( linePoints.length >= 2) {
        setLinePoints([]);
      }
        setLinePoints([{ x, y }]);
        
    }
    }
}


export class Measure extends BaseTool
{
    constructor()
    {
       super()
    }

    handleMouseUp(event,state,setLinePoints,linePoints,measureDistance,setCurrentDistance,send,modal,setLines,
        x1,
        y1,
        x2,
        y2)
    {
        if(state.matches("active"))
        {
        setLinePoints((prevLinePoints) => [ { x : prevLinePoints[0].x, y : prevLinePoints[0].y },{ x: x2, y: y2 },]);
    
        if(state.matches("active.measure"))
        {
        
          if (linePoints.length >= 1) {
            const distance = measureDistance({ x: x1, y: y1 }, { x: x2, y: y2 });
            setCurrentDistance(distance)
    
            send({type: 'MEASURE', measure : distance })
    
           return distance;
          //  drawLine(canvasRef.current.getContext('2d'), linePoints[0], {x,y}, distance);
     
          }
        }
    }
    }
}


export class Angle extends BaseTool
{
    constructor()
    {
        super()
    }

    handleMouseUp(state,setLinePoints,setAngleLine,linePoints, x1,
        y1,
        x2,
        y2,
        measureDistance)
    {
        if(state.matches("active"))
        {
        setLinePoints((prevLinePoints) => [ { x : prevLinePoints[0].x, y : prevLinePoints[0].y },{ x: x2, y: y2 },]);

        setAngleLine((prevLines)=> {
            return [...prevLines , { x1: x1, y1: y1, x2: x2, y2: y2 }]
             })
      
             if (linePoints.length >= 1) {
              const distance = measureDistance({ x: x1, y: y1 }, { x: x2, y: y2 });
              return distance;
             }    
    }
    
    }

}

export const measureTool = new Measure();


