import React, { useState, useRef, useEffect } from 'react';
import style from './Navbar.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import logo1 from '../../assets/predictio_logo.png';
import wallet_logo from '../../assets/wallet_logo.webp';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import Marquee from '../Marquee/Marquee';
import { connectWallet, getAccount, getBalance, getChainId } from '../Wallet/MetaMaskService'
import { connectUserWallet } from '../Back/fetchUserInfo';

const Navbar = () => {
  const { chosenEventId, setChosenEventId, deviceType, wallet, setWallet, setChainId, setBalance } = useContext(DataContext);
  const location = useLocation()
  const [category, setCategory] = useState("");
  const [walletMenu, setWalletMenu] = useState(false);
  const [walletMenuClicked, setWalletMenuClicked] = useState(false);
  const navigate = useNavigate();
  const walletMenuRef = useRef(null);
  const handleClick = () => {
    navigate('/');
    handleCategoryClick('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target)) {
        setWalletMenu(false);
        setWalletMenuClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [walletMenu]);

  const formatWallet = (shortwallet) => {
    if (deviceType == 'desktop') {
      const start = shortwallet.slice(0, 6);
      const end = shortwallet.slice(-4);    
      return (`${start}...${end}`);
    }
    else {
      const start = shortwallet.slice(0, 4);
      const end = shortwallet.slice(-2); 
      return (`${start}...${end}`);
    }

  }


  const handleConnectWallet = async () => {
    const connected = await connectWallet();
    if (connected) {
      const account = await getAccount();
      const balance = await getBalance(account);
      const chainId = await getChainId();

      setWallet(account);
      await connectUserWallet(account);
      setBalance(balance);
      setChainId(chainId);
      window.localStorage.setItem('currentWallet', account);
    }
  };

  const handleCategoryClick = (selectedCategory) => {
    setCategory(selectedCategory);
    if (selectedCategory) {
      if (selectedCategory === 'featured') {
        navigate(`/`);
      } else {
        navigate(`/category/${selectedCategory.toLowerCase()}`);
      }
    }

    if (chosenEventId.iteration != false) {
      setChosenEventId({
        iteration: false,
        ID: null,
        variant: null,
        chance: null,
      });
    }
  };

  return (
    deviceType == "desktop" ?
      <div style={{ position: 'fixed', width: '100%', zIndex: '5' }}>
        <div className={style.navbar} >
          <div className={style.navbar_content}>
            <div className={style.left}>
              <img
                onClick={() => {
                  navigate('/');
                  handleCategoryClick('');
                }}
                src={logo1} alt='Predictio' />
              <div className={style.center}>
                <div className={location.pathname === '/category/all' ? style.selected : style.select} onClick={() => {
                  handleCategoryClick('All');;
                }}><span>All</span></div>
                <div className={location.pathname === '/category/sports' ? style.selected : style.select} onClick={() => {
                  handleCategoryClick('Sports');;
                }}><span>Sports</span></div>
                <div className={location.pathname === '/category/politics' ? style.selected : style.select} onClick={() => {
                  handleCategoryClick('Politics');;
                }}><span>Politics</span></div>
                <div className={location.pathname === '/category/crypto' ? style.selected : style.select} onClick={() => {
                  handleCategoryClick('Crypto');;
                }}><span>Crypto</span></div>
                <div className={location.pathname === '/category/culture' ? style.selected : style.select} onClick={() => {
                  handleCategoryClick('Culture');
                }}><span>Culture</span></div>
              </div>
            </div>
            <div className={`${style.right} ${style.nonSelectableText}`}>
              <div className={style.leaderboard} onClick={() => { navigate(`/leaderboard`) }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" /></svg>
                Ranks
              </div>
              {wallet && wallet !== null ?
                <div className={style.profile} onClick={() => { navigate(`/profile`) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>
                  Profile
                </div>
                : null}
              <div
                ref={walletMenuRef}
                className={style.wallet}
                onClick={() => {
                  if (!wallet) {
                    handleConnectWallet();
                  } else {
                    if (walletMenu && !walletMenuClicked) {
                      setWalletMenu(true);
                      setWalletMenuClicked(true);
                    } else {
                      setWalletMenu(false);
                      setWalletMenuClicked(false);
                    }
                  }
                }}
                onMouseEnter={() => {
                  if (wallet !== null && !walletMenu) {
                    setWalletMenu(true);
                  }
                }}
                onMouseLeave={() => {
                  if (wallet !== null && !walletMenuClicked) {
                    setWalletMenu(false)
                  }
                }}
              >
                {wallet || wallet !== null ?
                  formatWallet(wallet) :
                  <>
                    <div className={style.walletLogo}>
                      <img src={wallet_logo} alt="wallet logo" />
                    </div>
                    Connect
                  </>
                }
                {wallet && (
                  <div
                    className={`${style.walletMenu} ${walletMenu ? style.walletMenuVisible : ''}`}
                    onMouseEnter={() => {
                      if (wallet !== null && !walletMenu) {
                        setWalletMenu(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (wallet !== null && !walletMenuClicked) {
                        setWalletMenu(false)
                      }
                    }}
                  >
                    <div
                      onClick={() => {
                        setWallet(null);
                        window.localStorage.removeItem('currentWallet');
                        setWalletMenu(false);
                      }}
                    >
                      Disconnect
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Marquee />
      </div >
      :
      <div style={{ position: 'fixed', width: '100%', zIndex: '5' }}>
        <div className={style.navbar}>
          <div className={style.navbar_content}>
            <div className={style.top}>
              <div className={style.left}>
                <img
                  onClick={handleClick}
                  src={logo1}
                  alt='Predictio'
                />
              </div>
              <div className={style.right}>
                <div className={style.leaderboard} onClick={() => { navigate(`/leaderboard`) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" /></svg>
                </div>
                {wallet && wallet !== "null" ?
                  <div className={style.profile} onClick={() => { navigate(`/profile`) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>
                  </div>
                  : null}
                <div
                  ref={walletMenuRef}
                  className={style.wallet}
                  onClick={() => {
                    if (!wallet) {
                      handleConnectWallet();
                    } else {
                      if (!walletMenu) {
                        setWalletMenu(true);
                        setWalletMenuClicked(true);
                      } else {
                        setWalletMenu(false);
                        setWalletMenuClicked(false);
                      }
                    }
                  }}>
                  {wallet || wallet !== null ?
                    formatWallet(wallet) :
                    <>
                      <div className={style.walletLogo}>
                        <img src={wallet_logo} alt="wallet logo" />
                      </div>
                      Connect
                    </>
                  }
                  {wallet && (
                    <div
                      className={`${style.walletMenu} ${walletMenu ? style.walletMenuVisible : ''}`}>
                      <div
                        onClick={() => {
                          setWallet(null);
                          window.localStorage.removeItem('currentWallet');
                          setWalletMenu(false);
                        }}
                      >
                        Disconnect
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={style.nav_items}>
              <div className={location.pathname === '/category/all' ? style.selected : style.select} onClick={() => handleCategoryClick('All')}>All</div>
              <div className={location.pathname === '/category/sports' ? style.selected : style.select} onClick={() => handleCategoryClick('Sports')}>Sports</div>
              <div className={location.pathname === '/category/politics' ? style.selected : style.select} onClick={() => handleCategoryClick('Politics')}>Politics</div>
              <div className={location.pathname === '/category/crypto' ? style.selected : style.select} onClick={() => handleCategoryClick('Crypto')}>Crypto</div>
              <div className={location.pathname === '/category/culture' ? style.selected : style.select} onClick={() => handleCategoryClick('Culture')}>Culture</div>
            </div>
          </div>
        </div>
        <Marquee />
      </div>
  )
}

export default Navbar