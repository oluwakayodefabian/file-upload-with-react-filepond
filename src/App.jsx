// src/App.js
import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import CourseForm from './components/CourseForm';
import FilePondImageUploader from './components/FilePondImageUploader';
import FilePondVideoUploader from './components/FilePondVideoUploader';
import FilePondChunkVideoUploader from './components/FilepondChunkVideoUploader';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileMetadata);

function App() {
  // const [files, setFiles] = useState([]);
  const [uploadedVideoIdentifier, setUploadedVideoIdentifier] = useState('');
  const [uploading, setUploading] = useState(false); // For keeping track of the upload status

  return (
    <>
      <div className="App" style={{ padding: '2rem', maxWidth: '600px', margin: '100px auto', border: '1px solid #ccc' }}>
        <CourseForm uploadedVideoIdentifier={uploadedVideoIdentifier} uploading={uploading} setUploadedVideoIdentifier={setUploadedVideoIdentifier} setUploading={setUploading} />

        {/* <FilePondVideoUploader setUploadedVideoIdentifier={setUploadedVideoIdentifier} setUploading={setUploading} /> */}
        {/* <FilePondChunkVideoUploader setUploadedVideoIdentifier={setUploadedVideoIdentifier} setUploading={setUploading} /> */}

        {/* Course Image Upload */}
        {/* <FilePondImageUploader setUploadedImageIdentifier={setUploadedImageIdentifier} setImageUploading={setImageUploading} /> */}

      </div>
    </>
  );
}

export default App;
