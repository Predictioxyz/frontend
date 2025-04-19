import { ethers, BrowserProvider } from 'ethers';
const contractAddress = import.meta.env.VITE_ADDRESS
import contractABI from './PDABI';

async function openPosition(price, eventId, predictedOutcome, amount) {
    const value = price * amount
    let tx;
    if (!window.ethereum) {
        alert("MetaMask not detected!");
        return null;
    }
    const provider = new BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        tx = await contract.openPosition(Number(eventId), predictedOutcome, Number(amount), {
            value: value
        });
        if (tx && tx.hash) {
            await tx.wait();
            return tx.hash;
        } else {
            console.error("Transaction failed: no hash returned");
            return null;
        }
    } catch (error) {
        console.error("Transaction error:", error);
        return null;
    }
}

async function closePosition(positionId, amount) {

    if (!window.ethereum) {
        alert("MetaMask not detected!");
        return null;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.closePosition(positionId, amount);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Transaction error:", error);
        return null;
    }
}

export default { openPosition, closePosition, claimWinnings };