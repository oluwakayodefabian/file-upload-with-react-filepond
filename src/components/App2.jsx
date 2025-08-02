// src/App.js
import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import CourseForm from './components/CourseForm';
import FilePondVideoUploader from './FilePondVideoUploader';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileMetadata);

function App2() {
    const [files, setFiles] = useState([]);
    const [uploadedVideoIdentifier, setUploadedVideoIdentifier] = useState('');
    const [uploading, setUploading] = useState(false); // For keeping track of the upload status

    const [uploadedImageIdentifier, setUploadedImageIdentifier] = useState('');
    const [imageUploading, setImageUploading] = useState(false);

    return (
        <>
            <div className="App" style={{ padding: '2rem', maxWidth: '600px', margin: '100px auto', border: '1px solid #ccc' }}>
                <h2>Chunked Upload via FilePond</h2>
                <CourseForm uploadedVideoIdentifier={uploadedVideoIdentifier} uploading={uploading} uploadedImageIdentifier={uploadedImageIdentifier} imageUploading={imageUploading} />

                <FilePondVideoUploader setUploadedVideoIdentifier={setUploadedVideoIdentifier} setUploading={setUploading} />

                {/* Course Image Upload */}
                {/* <FilePondImageUploader setUploadedImageIdentifier={setUploadedImageIdentifier} setImageUploading={setImageUploading} /> */}

            </div>
        </>
    );
}

export default App2;
