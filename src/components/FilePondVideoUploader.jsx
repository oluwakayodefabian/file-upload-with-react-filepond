import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

export default function FilePondVideoUploader({ setUploadedVideoIdentifier, setUploading }) {
    const [files, setFiles] = useState([]);
    return <>
        <h4>Video Upload</h4>
        <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={false}
            acceptedFileTypes={["video/mp4", "video/quicktime"]}
            server={{
                process: {
                    url: 'http://localhost:8000/api/upload-temp-file',
                    method: 'POST',
                    withCredentials: false,
                    // headers: {
                    //   'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                    // },

                    onload: (response) => { // a callback that's executed when the file upload is complete. It takes the server's response
                        // const { path } = JSON.parse(response);
                        const uniqueId = response;
                        setUploadedVideoIdentifier(uniqueId);
                        setUploading(false); // ✅ upload done
                        return uniqueId;
                    },
                    ondata: (formData) => {
                        formData.append('model', 'course');
                        setUploading(true); // ✅ upload started
                        return formData;
                    },
                    onerror: () => {
                        setUploading(false);
                        setUploadedVideoIdentifier('');
                    }
                },
                revert: {
                    url: 'http://localhost:8000/api/delete-temp-file',
                    method: 'DELETE',
                    withCredentials: false,
                },
            }}
            name="file" // The input field name
            labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
        />
    </>;
}