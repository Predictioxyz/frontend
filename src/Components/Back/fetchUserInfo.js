import axios from 'axios';

const checkUserWallet = async (wallet) => {
    const data = {
        "wallet": wallet
    }

    try {
        const response = await axios.post('http://localhost:8000/api/users/check', data, {
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

const connectUserWallet = async (wallet) => {
    const data = {
        "wallet": wallet
    }

    try {
        const response = await axios.post('http://localhost:8000/api/users/connect', data, {
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

const addToWatchlist = async (wallet, eventId) => {
    const data = {
        "wallet": wallet,
        "eventId": eventId
    }

    try {
        const response = await axios.post('http://localhost:8000/api/users/addcard', data, {
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

const removeFromWatchlist = async (wallet, eventId) => {
    const data = {
        "wallet": wallet,
        "eventId": eventId
    }

    try {
        const response = await axios.post('http://localhost:8000/api/users/removecard', data, {
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

const fetchWatchlist = async (wallet) => {
    const data = {
        "wallet": wallet
    }

    try {
        const response = await axios.post('http://localhost:8000/api/users/showcards', data, {
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

export { checkUserWallet, connectUserWallet, addToWatchlist, removeFromWatchlist, fetchWatchlist };