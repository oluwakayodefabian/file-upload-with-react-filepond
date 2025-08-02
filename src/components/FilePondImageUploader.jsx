import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';


export default function FilePondImageUploader({ setUploadedImageIdentifier, setImageUploading }) {
    return <>
        <h4>Upload Course Image</h4>
        <FilePond
            allowMultiple={false}
            acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            server={{
                process: {
                    url: 'http://localhost:8000/api/upload-temp-file',
                    method: 'POST',
                    onload: (res) => {
                        const imageIdentifier = res;
                        setUploadedImageIdentifier(imageIdentifier);
                        setImageUploading(false);
                        return imageIdentifier;
                    },
                    ondata: (formData) => {
                        setImageUploading(true);
                        formData.append('model', 'course');
                        formData.append('type', 'image');
                        return formData;
                    },
                    onerror: () => {
                        setUploadedImageIdentifier('');
                        setImageUploading(false);
                    }
                },
                revert: {
                    url: 'http://localhost:8000/api/upload-temp-file',
                    method: 'DELETE',
                    onload: () => {
                        setUploadedImageIdentifier('');
                        setImageUploading(false);
                    }
                }
            }}
            name="image"
            labelIdle='Drag & Drop your <strong>image</strong> or <span class="filepond--label-action">Browse</span>'
        />
    </>
}