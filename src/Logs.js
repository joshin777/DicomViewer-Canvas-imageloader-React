import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import log from "./LogClass";

export default function Logs() {
  const [logsList,setLogs] = useState()

  useEffect(()=>{
      setLogs(log.getLogs())
  },[log.logs])
  

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
  

  
    return (
      <div className="h-full flex flex-col justify-between">
       <div className="py-2">
  <div className="logs-container overflow-auto" style={{ height: '300px' }}> {/* Fixed height, overflow-auto */}
    {logsList?.map((log) => (
      <div className="px-1 py-1 ">
        {log}
      </div>
    ))}
  </div>
  <div className="clear-button-container">
  <span className="text-center mb-2">
            <button className="bg-black text-white px-6 py-1 rounded-lg" onClick={()=>{log.clearLogs()
            setLogs()}}>Clear</button>

        </span>
</div>

</div>  
     </div>
    );
  }
  