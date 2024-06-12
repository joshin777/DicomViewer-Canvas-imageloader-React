import React from 'react';

function MetaInfo({ imageInfo }) {
  // const { fileName, width, height, fileSize, type } = imageInfo;

  // Function to format file size (example)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  // Function to format date (example)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Customize date formatting as needed
  };
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
  
  return (
    <div>
      <h2><u>File Details</u></h2>
      <ul>
        <li>
          <b>File Name :</b> {imageInfo?.name}
          {console.log(imageInfo,"ffytfyyyfyfyfy")}
        </li>
        <li>
  <b>Size:</b> {imageInfo.size ? formatBytes(imageInfo.size) : ''}
</li>
        {/* <li>
          <b>Type:</b> {type}
        </li> */}
        
      </ul>
<span>


      <h2 style={{ paddingTop: '20px' }}><u>Image Details</u></h2>
      <ul>
        <li>
          <b>Width :</b> {imageInfo.width? `${imageInfo.width} px`:""}
        </li>
        <li>
          <b>Height :</b> {imageInfo.height? `${imageInfo.height} px`:""}
        </li>
        {/* Add more image details as needed (e.g., color depth, resolution) */}
      </ul>
      </span>
    </div>
  );
}

export default MetaInfo;
