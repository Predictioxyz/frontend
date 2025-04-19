import Web3 from 'web3';

let web3 = null;

export const connectWallet = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let ethereum;

    if (typeof window.ethereum === "undefined" && isMobile) {
        const url = "https://metamask.app.link/dapp/dddf-92-246-136-140.ngrok-free.app/";
        window.location.href = url;
    } else if (window.ethereum) {
        ethereum = window.ethereum;
    } else {
        alert("Пожалуйста, установите MetaMask.");
        if (isMobile) {
            window.location.href = "https://metamask.io/download.html";
        }
        return false;
    }

    try {
        web3 = new Web3(ethereum);
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const switched = await switchToEduChain(ethereum);
        if (!switched) {
            return false;
        }
        return accounts[0];
    } catch (error) {
        console.error("Ошибка подключения к MetaMask:", error);
        return false;
    }
};
export const switchToEduChain = async (ethereum) => {
    const educhain = {
        chainId: "0xa045c",
        chainName: "EDU Chain Testnet",
        nativeCurrency: {
            symbol: "EDU",
        },
        rpcUrls: ["https://open-campus-codex-sepolia.drpc.org"],
        blockExplorerUrls: ["https://opencampus-codex.blockscout.com"],
    };

    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: educhain.chainId }],
        });
        return true;
    } catch (error) {
        if (error.code === 4902 || error.code === -32603) {
            try {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [educhain],
                });
                return true;
            } catch (addError) {
                console.error("Ошибка при добавлении сети EduChain:", addError);
                return false;
            }
        } else {
            console.error("Ошибка при переключении сети:", error);
            return false;
        }
    }
};

export const getAccount = async () => {
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        return accounts[0];
    }
    return null;
};

export const getBalance = async (address) => {
    if (web3 && address) {
        const balanceWei = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balanceWei, "ether");
    }
    return null;
};

export const getChainId = async () => {
    if (web3) {
        const chainId = await web3.eth.getChainId();
        return chainId;
    }
    return null;
};
