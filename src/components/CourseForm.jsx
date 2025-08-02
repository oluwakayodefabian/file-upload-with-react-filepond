import React, { useState } from 'react';
import axios from 'axios';
import FilePondChunkVideoUploader from './FilepondChunkVideoUploader';

const API_URL = import.meta.env.VITE_API_URL;

function CourseForm({ uploadedVideoIdentifier, uploading, setUploadedVideoIdentifier, setUploading }) {
    const [form, setForm] = useState({
        course_name: '',
        course_title: '',
        course_duration: '',
        course_price: '',
        course_level: '',
        course_description: '',
        course_image: null,
    });

    const [message, setMessage] = useState('');

    /**
     * Handles form input changes and updates the form state with the new value.
     * @param {Event} e - The input change event.
     */
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setForm((prev) => ({ ...prev, [name]: value }));
    // };

    /**
     * Handles form input changes and updates the form state with the new value.
     * If the input is a file input (course_image), it sets the value to the first file in the files list.
     * @param {Event} e - The input change event.
     */
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'course_image') {
            setForm((prev) => ({ ...prev, course_image: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    /**
     * Handles form submission and posts form data to the server.
     * On success, displays a success message. On failure, displays an error message.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploading) {
            setMessage('⚠️ Please wait for the video upload to complete.');
            return;
        }

        if (!uploadedVideoIdentifier) {
            setMessage('⚠️ Please upload an intro video.');
            return;
        }

        // const payload = {
        //     ...form,
        //     course_intro_video: uploadedVideoIdentifier
        // };

        const formData = new FormData();

        // Append fields
        formData.append('course_name', form.course_name);
        formData.append('course_title', form.course_title);
        formData.append('course_duration', form.course_duration);
        formData.append('course_price', form.course_price);
        formData.append('course_level', form.course_level);
        formData.append('course_description', form.course_description);
        formData.append('course_intro_video', uploadedVideoIdentifier);
        formData.append('course_image', form.course_image);
        formData.append('modelType', 'course');
        formData.append('category_id', 1);
        formData.append('certificate', 'Yes')

        const CREATE_ENDPOINT = `${API_URL}/api/test/courses`;
        const UPDATE_ENDPOINT = `${API_URL}/api/test/courses/update/15`;

        try {
            const response = await axios.post(CREATE_ENDPOINT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the request headers
                },
            });

            setMessage('Course created successfully');
            alert('Course created successfully');
            console.log(response.data);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setMessage('❌ Error creating course');
            console.error(error);
        }
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Create Course</h3>
            <form onSubmit={handleSubmit} className='form'>
                <input type="text" name="course_name" placeholder="Course Name" onChange={handleChange} required /> <br /><br />
                <input type="text" name="course_title" placeholder="Course Title" onChange={handleChange} required /> <br /><br />
                <input type="text" name="course_duration" placeholder="Course Duration (e.g. 4 weeks)" onChange={handleChange} required /> <br /><br />
                <input type="number" name="course_price" placeholder="Course Price" onChange={handleChange} /> <br /><br />
                <input type="text" name="course_level" placeholder="Course Level (e.g. Beginner)" onChange={handleChange} required /> <br /><br />
                <textarea name="course_description" placeholder="Course Description" onChange={handleChange} required /> <br /><br />

                <label>Course Image:</label><br />
                <input type="file" name="course_image" accept="image/*" onChange={handleChange} /> <br /><br />

                <FilePondChunkVideoUploader setUploadedVideoIdentifier={setUploadedVideoIdentifier} setUploading={setUploading} />
                <br />
                <button type="submit" disabled={uploading || !uploadedVideoIdentifier}>
                    {uploading ? 'Uploading video...' : 'Create Course'}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CourseForm;
