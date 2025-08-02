import React, { useState } from 'react';
import axios from 'axios';

function CourseForm2({ uploadedVideoIdentifier, uploading, uploadedImageIdentifier, imageUploading }) {
    const [form, setForm] = useState({
        course_name: '',
        course_title: '',
        course_duration: '',
        course_price: '',
        course_level: '',
        course_description: '',
    });

    const [message, setMessage] = useState('');

    /**
     * Handles form input changes and updates the form state with the new value.
     * @param {Event} e - The input change event.
     */
    const handleChange = (e) => {
        // console.log(uploadedVideoPath, uploading);
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handles form submission and posts form data to the server.
     * On success, displays a success message. On failure, displays an error message.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploading || imageUploading) {
            setMessage('Please wait for the video upload to complete.');
            return;
        }

        if (!uploadedVideoPath || !uploadedVideoIdentifier) {
            setMessage('Please upload both video and image.');
            return;
        }

        const payload = {
            ...form,
            course_intro_video: uploadedVideoIdentifier,
            course_image: uploadedImageIdentifier
        };

        try {
            const response = await axios.post('http://localhost:8000/api/courses', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
            });

            setMessage('Course created successfully');
            console.log(response.data);
        } catch (error) {
            setMessage('Error creating course');
            console.error(error);
        }
    };

    const isDisabled = uploading || imageUploading || !uploadedVideoIdentifier || !uploadedImageIdentifier;

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Create Course</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="course_name" placeholder="Course Name" onChange={handleChange} required /> <br /><br />
                <input type="text" name="course_title" placeholder="Course Title" onChange={handleChange} required /> <br /><br />
                <input type="text" name="course_duration" placeholder="Course Duration (e.g. 4 weeks)" onChange={handleChange} required /> <br /><br />
                <input type="number" name="course_price" placeholder="Course Price" onChange={handleChange} /> <br /><br />
                <input type="text" name="course_level" placeholder="Course Level (e.g. Beginner)" onChange={handleChange} required /> <br /><br />
                <textarea name="course_description" placeholder="Course Description" onChange={handleChange} required /> <br /><br />

                <button type="submit" disabled={isDisabled}>
                    {uploading || imageUploading ? 'Uploading video...' : 'Create Course'}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CourseForm2;
