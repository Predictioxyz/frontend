import { useState, useEffect, useContext } from "react"
import { DataContext } from '../../context/DataContext'
import style from './EventPage.module.css';
import { useParams, Navigate } from 'react-router-dom';
import Loader from "../Loader/Loader";
import chainOperations from '../Back/chainOperations';
import BackOperations from '../Back/Positions';
import getImage from '../getImage';

import { useNavigate } from "react-router-dom";

function EventPage() {
    let navigate = useNavigate();
    const { openPosition, closePosition, claimWinnings } = chainOperations;
    const { openPositionBackend } = BackOperations;
    let { id } = useParams();
    const { data, deviceType, wallet, setWallet } = useContext(DataContext);
    if (data && id) {
        let x = parseInt(id, 10);
        if (!/^\d+$/.test(id) || x < 1 || x > data.length) {
            return <Navigate to="/" replace />;
        }
    }
    let shares = 0;
    const [endTime, setEndTime] = useState(true);
    const [isClaimed, setIsClaimed] = useState(true);
    const [isMarketOpen, setIsMarketOpen] = useState(true);
    const [yesOrNot, setYesOrNot] = useState(true);
    const [tooltipVisibility, setTooltipVisibility] = useState(true);
    const [buyOrSell, setBuyOrSell] = useState('Buy');
    const [value, setValue] = useState('');
    const [tooltipText, setTooltipText] = useState('Click to copy link');
    let filteredVolume;
    let filteredEvent;

    if (data && id) {
        if (typeof id === 'string') {
            filteredEvent = data.find(event =>
                event.id === parseInt(id)
            );
        }
    }

    const openPos = async () => {
        if (!value || typeof value !== 'string') {
            console.error('Invalid value');
            return;
        }

        let val = value

        if (isNaN(val)) {
            console.error('Invalid value after slicing');
            return;
        }
        const chanceValue = formatChance(yesOrNot, false);

        if (isNaN(chanceValue)) {
            console.error('Invalid value from formatChance');
            return;
        }
        try {
            const txHash = await openPosition(Number(chanceValue), filteredEvent.eventId, yesOrNot, Number(value));
            if (txHash) {
                await openPositionBackend(wallet, filteredEvent.id, yesOrNot, val, chanceValue, txHash);
            } else {
                console.error("Transaction failed or hash is null.");
            }
        } catch (error) {
            console.error('Error during transaction process:', error);
        }
    };

    const getTimeUntil = (eventDateString) => {
        const now = new Date();
        const eventDate = new Date(eventDateString);

        let years = eventDate.getFullYear() - now.getFullYear();
        let months = eventDate.getMonth() - now.getMonth();
        let days = eventDate.getDate() - now.getDate();

        if (days < 0) {
            months -= 1;
            const prevMonth = new Date(eventDate.getFullYear(), eventDate.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const parts = [];
        if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
        if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

        return parts.length > 0 ? parts.join(' ') : 'Less than a day';
    };

    const formatPostgresDate = (pgDateString) => {
        const date = new Date(pgDateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const [selectedVariant, setVariant] = useState({
        variant: 0,
        chance: 0,
    });

    const formatChance = (type, returnText = true) => {
        if (!filteredEvent || !filteredEvent.chance) return null;
        let result;
        let formattedResult;
        if (type) {
            result = filteredEvent.chance;
            formattedResult = result >= 10 ? result.toFixed(1) : result.toFixed(2);
        } else {
            result = 100 - filteredEvent.chance;
            formattedResult = result >= 10 ? result.toFixed(1) : result.toFixed(2);
        }
        if (returnText) {
            if (type) {
                return 'Yes ' + formattedResult / 100 + ' EDU';
            } else {
                return 'No ' + formattedResult / 100 + ' EDU';
            }
        } else {
            return parseFloat(formattedResult);
        }

        return null;

    };


    const handleInputChange = (e) => {
        let inputValue = e.target.value.replace(/[^0-9.]/g, '');

        if (inputValue.startsWith('.')) {
            inputValue = '0' + inputValue;
        }

        const parts = inputValue.split('.');

        if (parts.length > 2) {
            return;
        }

        if (parts[0].startsWith('0') && parts[0].length > 1) {
            inputValue = parts[0].slice(1) + (parts[1] ? '.' + parts[1] : '');
        }

        if (buyOrSell == 'Buy') {
            setValue(inputValue ? inputValue : '');
        } else if (buyOrSell == 'Sell') {
            if (shares === 0) {
                setValue('');
            } else {
                setValue(inputValue ? inputValue : '');
            }
        }
    };


    const updateInputValue = (action) => {
        const currentValue = parseFloat(value.replace('$', '')) || 0;
        let newValue;

        if (action === 'increase') {
            if (buyOrSell == 'Sell' && shares === 0) {
                newValue = 0
            } else {
                newValue = currentValue + 10;
            }
        } else if (action === 'decrease') {
            if (buyOrSell == 'Sell' && shares === 0) {
                newValue = 0
            } else {
                newValue = Math.max(0, currentValue - 10);
            }
        }

        if (buyOrSell == 'Buy') {
            setValue(newValue > 0 ? `${newValue} EDU` : '');
        }
        else if (buyOrSell == 'Sell') {
            if (shares === 0) {
                setValue('')
            } else {
                setValue(newValue > 0 ? `${newValue} EDU` : '');
            }
        }
    };

    const handleCopyLink = () => {
        const currentLink = window.location.href;

        navigator.clipboard.writeText(currentLink).then(() => {
            setTooltipText('Link copied!');
            setTimeout(() => setTooltipText('Click to copy link'), 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });
    };
    const potencialReturn = () => {
        if (buyOrSell == 'Buy') {
            if (yesOrNot) {
                if (value.length !== 0 && !isNaN(Number(value.replace('$', '').replace(' EDU', '')))) {
                    let xval;
                    if (value.startsWith('$') && (value.endsWith(' EDU') || value.endsWith(' EDU'))) {
                        const cleanedValue = value.replace('$', '').replace(' EDU', '').replace('%', '');
                        xval = Number(cleanedValue);
                    } else {
                        xval = Number(value);
                    }
                    if (isNaN(xval) || xval <= 0) {
                        return ('0.00 EDU(0.00%)');
                    }
                    let x = xval / filteredEvent.chance * 100
                    let y = 100 / xval * (x - xval);
                    if (y < 0) y = 0;

                    return (x.toFixed(4) + ' EDU' + ' (' + y.toFixed(0) + '%)');
                } else {
                    return ('0.00 EDU(0.00%)');
                }
            } else if (!yesOrNot) {
                if (value.length !== 0 && !isNaN(Number(value.replace('$', '')))) {
                    let xval;
                    if (value[0] == '$') {
                        xval = Number(value.slice(1));
                    } else {
                        xval = Number(value);
                    }

                    if (isNaN(xval) || xval <= 0) {
                        return ('0.00 EDU(0.00%)');
                    }

                    let x = (xval / (100 / (100 - filteredEvent.chance) / 100)).toFixed(2);
                    let y = 100 / xval * (x - xval);
                    if (y < 0) y = 0;

                    return (x + ' EDU' + ' (' + y.toFixed(2) + '%)');
                } else {
                    return ('0.00 EDU(0.00%)');
                }
            }
        } else if (buyOrSell == 'Sell') {
            if (yesOrNot == 'yes') {
                if (value.length !== 0 && !isNaN(Number(value.replace('$', '')))) {
                    let xval;
                    if (value[0] == '$') {
                        xval = Number(value.slice(1));
                    } else {
                        xval = Number(value);
                    }

                    if (isNaN(xval) || xval <= 0) {
                        return ('0.00 EDU');
                    }

                    let x = (xval * (100 / filteredEvent.chance / 100)).toFixed(2);
                    return (x / 100 + ' EDU');
                } else {
                    return ('0.00 EDU');
                }
            } else if (yesOrNot == 'no') {
                if (value.length !== 0 && !isNaN(Number(value.replace('$', '')))) {
                    let xval;
                    if (value[0] == '$') {
                        xval = Number(value.slice(1));
                    } else {
                        xval = Number(value);
                    }

                    if (isNaN(xval) || xval <= 0) {
                        return ('0.00 EDU');
                    }

                    let x = (xval * (100 / (100 - filteredEvent.chance) / 100)).toFixed(2);
                    return (x);
                } else {
                    return ('0.00 EDU');
                }
            }
        }
    };

    if (filteredEvent) {
        let modVol = parseInt(filteredEvent.volume);
        modVol = modVol.toLocaleString('en-US');
        filteredVolume = modVol;
    }
    if (filteredVolume === undefined || filteredEvent === undefined || !data) {
        return <Loader />
    }
    return (
        <div className={`${style.eventPage} content`}>
            {deviceType !== "desktop" ? <>
                <div className={style.Header}>
                    <div className={filteredEvent && filteredEvent.image ? style.HeaderImage : style.loaderImage}>
                        {filteredEvent ?
                            <img src={getImage(filteredEvent.id)} alt={filteredEvent.name} /> : null}
                        <div className={filteredEvent ? style.HeaderVolume : style.loaderVolume}>
                            <div className={style.headerInfo}>
                                <div className={style.resultDate}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z" />
                                        </svg>
                                    </div>
                                    {filteredEvent && filteredVolume ? '$' + filteredVolume + ' volume' : null}
                                </div>
                                <div className={style.nonSelectableText}>
                                    <span className={style.icon}
                                        onClick={() => {
                                            setIsMarketOpen(!isMarketOpen);
                                        }}>
                                        <span className="material-symbols-outlined">bookmark</span>
                                    </span>
                                    <span className={style.icon} onClick={handleCopyLink}>
                                        <span class="material-symbols-outlined">content_copy</span>
                                    </span>
                                </div>
                            </div>
                            <div className={style.headerInfo}>
                                <div className={style.resultDate}
                                    onClick={() => {
                                        setEndTime(!endTime)
                                    }}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
                                        </svg>
                                    </div>
                                    {endTime === true ? formatPostgresDate(filteredEvent.date)
                                        : getTimeUntil(filteredEvent.date)
                                    }
                                </div>
                                {!isMarketOpen &&
                                    <div className={style.closed}>
                                        Closed
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className={style.HeaderPreinfo}>
                        <div className={filteredEvent && filteredEvent.title ? style.HeaderTitle : style.loaderVolume}>
                            {filteredEvent && filteredEvent.title ? filteredEvent.title : null}
                        </div>
                    </div>
                </div>
                <div className={style.Predict}>
                    <div className={`${style.predictLeft} ${!isMarketOpen ? style.closedMarket : ''} `}>
                        <div className={style.buyOrSell}>
                            <div className={`${buyOrSell === 'Buy' && isMarketOpen ? style.selected : ''} ${style.nonSelectableText} `}
                                onClick={() => {
                                    setBuyOrSell('Buy');
                                    setValue('');
                                }}
                                style={{
                                    borderColor: !isMarketOpen ? 'transparent' : null
                                }}>Buy</div>
                            <div className={`${buyOrSell === 'Sell' && isMarketOpen ? style.selected : ''} ${style.nonSelectableText} `}
                                onClick={() => {
                                    setBuyOrSell('Sell');
                                    setValue('');
                                }}
                                style={{
                                    borderColor: !isMarketOpen ? 'transparent' : null
                                }}>Sell</div>
                        </div>
                        <div className={style.chance}>
                            <p>Yes</p>
                            <div>{filteredEvent ? filteredEvent.chance + '% chance' : null}</div>
                        </div>
                        <p>
                            Outcome
                        </p>
                        <div className={`${style.pchances} ${style.nonSelectableText} ${!isMarketOpen ? style.closedMarketButtons : ''} `}>
                            <div className={`${selectedVariant.chance == 0 ? style.swin : style.win} ${style.tradeWindow} `}
                                onClick={() => {
                                    setYesOrNot(true);
                                    setVariant((prevState) => ({
                                        ...prevState,
                                        chance: 0,
                                    }));
                                }}>
                                {filteredEvent && formatChance(true)}
                            </div>
                            <div className={selectedVariant.chance == 1 ? style.slose : style.lose} onClick={() => {
                                setYesOrNot(false);
                                setVariant((prevState) => ({
                                    ...prevState,
                                    chance: 1,
                                }));
                            }}>
                                {filteredEvent && formatChance(true)}
                            </div>
                        </div>
                    </div>
                    <div className={style.predictRight}>
                        {!isMarketOpen ?
                            <>
                                <div className={style.closedMarketInfo}>
                                    <div className={style.closedMarketIcon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                        </svg>
                                    </div>
                                    <p>Outcome: Yes</p>
                                    <p>Donald Trump</p>
                                </div>
                                <div className={style.claimReward}>
                                    <div className={`${style.login} ${style.payButton} ${style.nonSelectableText} ${isClaimed ? style.claimedReward : ''} `}
                                        onClick={() => { setIsClaimed(!isClaimed); }}
                                    >
                                        Claim
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className={style.count}>
                                    {buyOrSell == 'Buy' ?
                                        <p>Amount</p>
                                        :
                                        <>
                                            <p>Shares</p>
                                            <p className={style.max}>MAX</p>
                                        </>
                                    }
                                </div>
                                <div className={style.currencyInputWrapper}>
                                    <div className={`${style.currencyButton} ${style.decrease} ${style.nonSelectableText} `}
                                        onClick={() => { updateInputValue('decrease') }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M200-440v-80h560v80H200Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={buyOrSell == 'Buy' && value && value[0] != '$' ? '$' + value : buyOrSell == 'Sell' && value && value[0] == '$' ? value.slice(1) : value}
                                        onChange={handleInputChange}
                                        placeholder={buyOrSell == 'Buy' ? "$0" : '0'}
                                        className={style.customInput}
                                    />
                                    <div className={`${style.currencyButton} ${style.increase} ${style.nonSelectableText} `}
                                        onClick={() => { updateInputValue('increase') }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={style.potencialReturn}>
                                    {buyOrSell == 'Buy' ?
                                        <>
                                            <div>
                                                <p> Potential return</p>
                                                {potencialReturn()}
                                            </div>
                                        </>
                                        : buyOrSell == 'Sell' && shares > 0 ?
                                            <>
                                                <div>
                                                    <p> Est. amount received</p>
                                                    {potencialReturn()}
                                                </div>
                                            </> :

                                            <div>
                                                <p> You have no shares</p>
                                            </div>}
                                </div>
                                {!wallet ?
                                    <div className={`${style.connectWallet} ${style.payButton} ${style.nonSelectableText} `}>
                                        Connect your wallet
                                    </div>
                                    :
                                    <div className={`${style.openPosition} ${style.payButton} ${style.nonSelectableText} `}
                                        onClick={() => { openPosition() }}
                                    >
                                        Open position
                                    </div>
                                }
                            </>}
                    </div>
                </div>
            </>
                : <>
                    <div className={style.Header}>
                        <div className={filteredEvent && filteredEvent.image ? style.HeaderImage : style.loaderImage}>
                            {filteredEvent ?
                                <img src={getImage(filteredEvent.id)} alt={filteredEvent.title} /> : null}
                        </div>
                        <div className={style.HeaderPreinfo}>
                            <div className={filteredEvent && filteredVolume ? style.HeaderVolume : style.loaderVolume}>
                                <div>
                                    <div className={style.headerInfo}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z" />
                                        </svg>
                                        <p>{filteredEvent && filteredVolume ? '$' + filteredVolume + ' volume' : null}</p>
                                    </div>
                                    <div className={style.headerInfo}>
                                        <div className={style.icon}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
                                            </svg>
                                            <span className={`${style.tooltip} ${tooltipVisibility == false ? style.nonVisibleTooltip : ''} `} style={{ width: "fit-content" }}>{getTimeUntil(filteredEvent.date)}
                                            </span>
                                        </div>
                                        <p>
                                            {formatPostgresDate(filteredEvent.date)}
                                        </p>
                                    </div>
                                    {!isMarketOpen &&
                                        <div className={style.closed}>
                                            Closed
                                        </div>}
                                </div>
                                <div className={style.nonSelectableText}>
                                    <span className={style.icon}
                                        onClick={() => {
                                            setTooltipVisibility(false);
                                            setIsMarketOpen(!isMarketOpen)
                                        }}
                                        onMouseLeave={() =>
                                            setTooltipVisibility(true)
                                        }>
                                        <span className="material-symbols-outlined">bookmark</span>
                                        <span className={`${style.tooltip} ${tooltipVisibility == false ? style.nonVisibleTooltip : ''} `}
                                        >Add to watchlist</span>
                                    </span>
                                    <span className={style.icon} onClick={() => { handleCopyLink(); setTooltipVisibility(false) }} onMouseLeave={() =>
                                        setTooltipVisibility(true)
                                    }>
                                        <span class="material-symbols-outlined">content_copy</span>
                                        <span className={`${style.tooltip} ${tooltipVisibility == false ? style.nonVisibleTooltip : ''} `}
                                        >Copy link</span>
                                    </span>
                                </div>
                            </div>
                            <div className={filteredEvent && filteredEvent.name ? style.HeaderTitle : style.loaderVolume}>
                                <div>
                                    {filteredEvent && filteredEvent.name ? filteredEvent.name : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.Predict}>
                        <div className={`${style.predictLeft} ${!isMarketOpen ? style.closedMarket : ''} `}>
                            <div className={style.buyOrSell}>
                                <div className={`${buyOrSell === 'Buy' && isMarketOpen ? style.selected : ''} ${style.nonSelectableText} `}
                                    onClick={() => {
                                        setBuyOrSell('Buy')
                                        setValue('');
                                    }}
                                    style={{
                                        borderColor: !isMarketOpen ? 'transparent' : null
                                    }}>
                                    Buy
                                </div>
                                <div className={`${buyOrSell == 'Sell' && isMarketOpen ? style.selected : ''} ${style.nonSelectableText} `}
                                    onClick={() => {
                                        setBuyOrSell('Sell');
                                        setValue('');
                                    }}
                                    style={{
                                        borderColor: !isMarketOpen ? 'transparent' : null
                                    }}>Sell
                                </div>
                            </div>
                            <div className={`${style.chance} ${!isMarketOpen ? style.closedMarket : ''} `}>
                                <p>Yes</p>
                                <div>{filteredEvent ? filteredEvent.chance + '% chance' : null}</div>
                            </div>
                            <p>
                                Outcome
                            </p>
                            <div className={`${style.pchances} ${style.nonSelectableText} ${!isMarketOpen ? style.closedMarketButtons : ''} `}>
                                <div className={`${selectedVariant.chance == 0 ? style.swin : style.win} ${style.tradeWindow} `}
                                    onClick={() => {
                                        setYesOrNot(true);
                                        setVariant((prevState) => ({
                                            ...prevState,
                                            chance: 0,
                                        }));
                                    }}>
                                    {filteredEvent && formatChance(true)}
                                </div>
                                <div className={selectedVariant.chance == 1 ? style.slose : style.lose} onClick={() => {
                                    setYesOrNot(false);
                                    setVariant((prevState) => ({
                                        ...prevState,
                                        chance: 1,
                                    }));
                                }}>
                                    {filteredEvent && formatChance(false)}
                                </div>
                            </div>
                        </div>
                        <div className={style.predictRight}>
                            {!isMarketOpen ?
                                <>
                                    <div className={style.closedMarketInfo}>
                                        <div className={style.closedMarketIcon}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                            </svg>
                                        </div>
                                        <p>Outcome: Yes</p>
                                        <p>Donald Trump</p>
                                    </div>
                                    <div className={style.claimReward}>
                                        <div className={`${style.login} ${style.payButton} ${style.nonSelectableText} ${isClaimed ? style.claimedReward : ''} `}
                                            onClick={() => { setIsClaimed(!isClaimed); }}
                                        >
                                            Claim
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className={style.count}>
                                        {buyOrSell == 'Buy' ?
                                            <p>Amount</p>
                                            :
                                            <>
                                                <p>Shares</p>
                                                <p className={style.max}>MAX</p>
                                            </>
                                        }
                                    </div>
                                    <div className={style.currencyInputWrapper}>
                                        <div className={`${style.currencyButton} ${style.decrease} ${style.nonSelectableText} `}
                                            onClick={() => { updateInputValue('decrease'); setTooltipVisibility(false) }}>
                                            <svg
                                                onMouseLeave={() =>
                                                    setTooltipVisibility(true)
                                                }
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M200-440v-80h560v80H200Z" />
                                            </svg>
                                            <span className={`${style.tooltip} ${tooltipVisibility == false ? style.nonVisibleTooltip : ''} `} style={{ width: "fit-content" }}>- $10</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={buyOrSell == 'Buy' && value ? value : buyOrSell == 'Sell' && value ? value : value}
                                            onChange={handleInputChange}
                                            placeholder={buyOrSell == 'Buy' ? "0" : '0'}
                                            className={style.customInput}
                                        />
                                        <div className={`${style.currencyButton} ${style.increase} ${style.nonSelectableText} `}
                                            onClick={() => { updateInputValue('increase'); setTooltipVisibility(false) }}>
                                            <svg onMouseLeave={() =>
                                                setTooltipVisibility(true)
                                            }
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                            </svg>
                                            <span className={`${style.tooltip} ${tooltipVisibility == false ? style.nonVisibleTooltip : ''} `} style={{ width: "fit-content" }}>+ $10</span>
                                        </div>
                                    </div>
                                    <div className={style.potencialReturn}>
                                        {buyOrSell == 'Buy' ?
                                            <>
                                                <div>
                                                    <p> Potential return</p>
                                                    {potencialReturn()}
                                                </div>
                                            </>
                                            : buyOrSell == 'Sell' && shares > 0 ?
                                                <>
                                                    <div>
                                                        <p> Est. amount received</p>
                                                        {potencialReturn()}
                                                    </div>
                                                </> :

                                                <div>
                                                    <p> You have 0.001 shares</p>
                                                </div>
                                        }
                                    </div>
                                    {!wallet ?
                                        <div className={`${style.connectWallet} ${style.payButton} ${style.nonSelectableText} `}>
                                            Connect your wallet
                                        </div>
                                        :
                                        <div className={`${!value && value !== 0 ? style.disabled : ''} ${style.openPosition} ${style.payButton} ${style.nonSelectableText} `}
                                            onClick={
                                                openPos
                                            }>
                                            Open position
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div></>
            }
            <div className={style.after}>
                <div>Market Summary</div>
                <div>With just over two weeks until the 2024 US presidential election, the race between Donald Trump and Kamala Harris remains tightly contested. Trump and Harris have been actively campaigning, particularly in key battleground states like Michigan, where Harris questioned Trump's stamina and Trump countered by asserting his energy and invigoration. Early voting has been underway in various states since September, with several states including Alabama, Wisconsin, and Nevada already offering mail and in-person voting options. Polls indicate narrow margins in critical states such as Pennsylvania, Arizona, and Georgia, highlighting the importance of these regions in determining the election outcome. Fundraising efforts also continue, with Harris' campaign raising $361 million in August, significantly outpacing Trump's haul. Additionally, Trump has received substantial donations from the oil and gas sector. The campaign trail has seen notable endorsements and appearances, including upcoming joint appearances by Harris with former President Barack Obama and Michelle Obama in key states.</div>
            </div>
            <div className={style.after}>
                <div>Rules</div>
                <div>{filteredEvent ? filteredEvent.rules : null}</div>
            </div>
        </div >
    )
}

export default EventPage
