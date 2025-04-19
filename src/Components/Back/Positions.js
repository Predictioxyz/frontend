import axios from 'axios';

const openPositionBackend = async (wallet, eventId, yes, amount, price, txHash) => {
    const data = {
        "wallet": wallet,
        "eventId": eventId,
        "yes": yes,
        "amount": amount,
        "price": price,
        "txHash": txHash
    };
    try {
        const response = await axios.post('http://localhost:8000/api/positions/open', data, {
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
const fetchOpenedPositionsBackend = async (wallet) => {
    const data = {
        "wallet": wallet
    };

    try {
        const response = await axios.post('http://localhost:8000/api/positions/fetch', data, {
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

const closePositionBackend = async (wallet, txHash, positionId) => {
    const data =
    {
        "wallet": wallet,
        "txHash": txHash,
        "positionId": 1

    };
    try {
        const response = await axios.post('http://localhost:8000/api/positions/close', data, {
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

const withDrawBackend = async (wallet, txHash, positionId) => {
    const data = {
        "wallet": wallet,
        "txHash": "0xdc859fd2ce8e1004f944e31abd20c1f66a214366f04469c184678407b00ef5b5",
        "positionId": 1
    };
    try {
        const response = await axios.post('http://localhost:8000/api/positions/withdraw', data, {
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
export default { openPositionBackend, fetchOpenedPositionsBackend, closePositionBackend, withDrawBackend };