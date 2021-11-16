import axios from 'axios';

const ReadForm = async (id,dept) => {
    const formData = new FormData();
    formData.append('offboardingID', id);
    formData.append('dept', dept);
    const res = await axios.post('/api/readinput', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        return response
    }).catch(error => {
        return error.response
    });
    return res
}

export default ReadForm;
