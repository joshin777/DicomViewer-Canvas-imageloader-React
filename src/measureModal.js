import { useState,useEffect } from "react";


export default function MeasureModal({data})
{
    const [showComponent, setShowComponent] = useState(true);
    // const [isRendered, setIsRendered] = useState(false);

  
function handleClose()
{
    setShowComponent(false);
}

useEffect(() => {
   const timeout = setTimeout(() => {
    setShowComponent(false);
  }, 3000);
  return () => {
    clearTimeout(timeout);
  };
}, [showComponent])


    return (
        <>
        {showComponent &&   
        <div className="flex justify-between  bg-gray-500  w-96 px-4 py-3 items-center">
        <div className='text-sm text-white' >
            Measurement : {data}px
          </div>
          <div className="cursor-pointer px-4 text-yellow-400" onClick={handleClose}> X </div>
        </div>
          }
      
        </>
    )
}

