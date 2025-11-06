# CHUNK FILE UPLOAD WITH REACT VIA FILEPOND

[Filepond](https://pqina.nl/filepond/) is a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.
 
 You can read their docs for more info: https://pqina.nl/filepond/docs/

I was thinking of a way to improve the way large files were being uploaded on the project I was working on.

I tried passing the file being uploaded to a queue job and then processing it later. It made sense at first, but the client still has to upload that file to the server first before passing it to the queue along with other payloads. This still slowed down the request and provided a negative user experience, as the user has to wait for the request to complete, and sometimes they might experience server timeout if the request takes too long to complete.


So I thought to myself, what if there's a way I can send a request to a different endpoint on the server to store the file in a temporary location whenever a file is uploaded and also give the user feedback about what's happening, like, let's say, a progress bar with a percentage of the upload being carried, and then return a unique identifier that will be passed along with the entire payload that will be passed from a form?

### EXAMPLE : A form that is used for creating a course
The form will typically contain a course name, course price, description, image, intro video, etc. Now, in this kind of form, the field i am concerned about is the intro video field that allows a user to upload a video. The video could be 30 to 50MB in size depending on the validation as well on the frontend and the backend. And that is definitely going to slow the request. So what I do is I pass the job to filepond. 

Whenever a video file is uploaded, I tell filepond make a request to an endpoint on the server, when you are done return a unique Id that I can now pass to intro_video that will be sent to the endpoint that creates a course instead of passing the entire file. This allows for a more smoother experience.

And I also made sure they are not able to complete the request until the file upload to the server is complete.

### CURRENT BLOCKER
My current implementation works for a standard upload. The only issue i am having now is with chunk uploads. This simply means splitting a big file into chunks and then sending it to the server, once all the chunks are received by the server, the server reconstructs them together and the save them in the appropriate location. This allows for larger files to be sent quickly.

Now, back to the issue, the file is being sent in chunks, and is reconstructed on the server. But, it fails to return the unique id, which needs to be passed along with rest of the request.


### BLOCKER FIXED (JULY 28, 2025)
Previously, I was having with returning the unique Id. Well, I have been to fix it.
The solution was I was to send a post request first that returns the unique id as plaintext and subsequent patch request with remembers that unique identifier.

So, I created two endpoints:
1. /initiate-chunk-upload with a `POST` request
2. /upload-chunk with a `PATCH` request
    
    In the Frontend, I passed a patch parameter to the path endpoint, which will be auto-filled during every patch request with the uniqueId and this uniqueId will also be used on the backend to identify of chunks.
    ```js
     patch: {
        url: 'http://localhost:8000/api/upload-chunk?patch=',
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
                return uniqueId;
            } catch (error) {
                console.error('Error parsing response:', error, response);
                setUploading(false);
                setUploadedVideoIdentifier('');
                return '';
            }
        },
    },
    ```


 ### REVERT UPLOAD
 Filepond provides us with a way reverting or cancelling an upload. let's say a user wants to change the file they previously uploaded, when the click on the cancel, we can send a request to the server to also delete the file uploaded previously. The endpoint for this request is passed to the revert property. Filepond is expecting a `DELETE` request. But, you can change it to a different method if you need to.
 ```js
revert: {
    url: 'http://localhost:8000/api/revert-upload', // You can also pass an optional id parameter to the endpoint if you are using a GET method
    method: 'DELETE',
    withCredentials: false,
},
```