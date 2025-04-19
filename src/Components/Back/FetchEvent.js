import axios from 'axios';

const fetchOneEvent = async (eid) => {
    const data = {
        "id": eid
    };

    try {
        const response = await axios.post('http://localhost:8000/api/events/find/one', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const fetchAllEvents = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/events/find/multiple', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export default { fetchOneEvent, fetchAllEvents };