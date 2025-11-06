import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function FilePondChunkVideoUploader({ setUploadedVideoIdentifier, setUploading }) {
    const [files, setFiles] = useState([]);

    return (
        <>
            <h4>Video Upload</h4>
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                acceptedFileTypes={["video/mp4", "video/quicktime", "video/webm"]}
                chunkUploads={true} // Enable chunked uploads
                chunkSize={5 * 1024 * 1024} // Set chunk size to 5MB (adjust as needed)
                chunkForce={true}
                server={{
                    process: {
                        url: API_URL + '/api/initiate-chunk-upload',
                        method: 'POST',
                        withCredentials: false,
                        headers: {
                            // Add any required headers, e.g., for authentication
                            // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                        },
                        ondata: (formData) => {
                            formData.append('model', 'course');
                            setUploading(true); // Upload started
                            return formData;
                        },
                        onload: (response) => {
                            try {
                                // If response is an XMLHttpRequest with no responseText, it's a partial chunk
                                if (typeof response !== 'string' && response.responseText === '') {
                                    return ''; // Ignore empty chunk responses
                                }

                                const uniqueId = typeof response === 'string'
                                    ? response
                                    : response.responseText;

                                console.log('Parsed uniqueId:', uniqueId);

                                if (typeof uniqueId !== 'string' || !uniqueId.trim()) {
                                    return '';
                                }

                                return uniqueId;
                            } catch (error) {
                                console.error('Error parsing response:', error, response);
                                setUploading(false);
                                setUploadedVideoIdentifier('');
                                return '';
                            }
                        },

                        onerror: (error) => {
                            console.error('Upload error:', error); // Debug error
                            setUploading(false);
                            setUploadedVideoIdentifier('');
                        },
                    },
                    patch: {
                        url: API_URL + 'api/upload-chunk?patch=',
                        method: 'PATCH',
                        withCredentials: false,
                        onload: (response) => {
                            try {
                                // If response is an XMLHttpRequest with no responseText, it's a partial chunk
                                if (typeof response !== 'string' && response.responseText === '') {
                                    return ''; // Ignore empty chunk responses
                                }

                                const uniqueId = typeof response === 'string'
                                    ? response
                                    : response.responseText;

                                console.log('Parsed uniqueId:', uniqueId);

                                if (typeof uniqueId !== 'string' || !uniqueId.trim()) {
                                    return '';
                                }

                                setUploadedVideoIdentifier(uniqueId);
                                setUploading(false); // Final chunk done
                                return uniqueId;
                            } catch (error) {
                                console.error('Error parsing response:', error, response);
                                setUploading(false);
                                setUploadedVideoIdentifier('');
                                return '';
                            }
                        },
                    },
                    revert: {
                        url: API_URL + 'api/revert-upload', // You can also pass an optional id parameter to the endpoint if needed
                        method: 'DELETE',
                        withCredentials: false,
                    },
                }}
                name="file" // The input field name
                labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
                onprocessfilestart={() => {
                    console.log('File upload started'); // Debug start
                }}
                onprocessfileprogress={(file, progress) => {
                    console.log(`Upload progress for ${file.filename}: ${progress * 100}%`); // Debug progress
                }}
                onprocessfile={(error, file) => {
                    setUploading(false);
                    console.log('Process file:', { error, file }); // Debug
                    console.log("Server ID for revert:", file.serverId);
                    if (error) {
                        console.error('Process file error:', error);
                        setUploading(false);
                        setUploadedVideoIdentifier('');
                    }
                }}
            />
        </>
    );
}