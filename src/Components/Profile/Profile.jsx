import { useState, useEffect, useLayoutEffect } from 'react';
import style from './Profile.module.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import EventCard from '../EventCard/EventCard';
import Loader from '../Loader/Loader';
import { fetchWatchlist } from '../Back/fetchUserInfo';
import eventService from '../Back/FetchEvent';
import positionsService from '../Back/Positions'

function Profile() {
    const { fetchAllEvents } = eventService;
    const { fetchOpenedPositionsBackend } = positionsService
    const [positions, setPositions] = useState('')
    const { data, yourPositionsData, wallet, deviceType } = useContext(DataContext);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const navigate = useNavigate();
    const [view, setView] = useState('yourpositions');

    const fetchEvents = async () => {
        try {
            let events = await fetchAllEvents();
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchPositions = async (wallet) => {
        try {
            const positions = await fetchOpenedPositionsBackend(wallet)
            setPositions(positions)
        } catch (error) {
            console.error('Error fetching positions:', error)
        }
    }

    useEffect(() => {
        if (!wallet) return;

        fetchPositions(wallet)
        fetchingWatchlist();
    }, [wallet]);

    const fetchingWatchlist = async () => {
        try {
            if (wallet) {
                let watchlist = await fetchWatchlist(wallet);

                let allEvents = await fetchEvents();

                let privateFilteredEvents = allEvents.filter(event => watchlist.includes(event.id));

                if (privateFilteredEvents !== filteredEvents) {
                    setFilteredEvents(privateFilteredEvents);
                }

            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    };

    const VIEWS = {
        yourpositions: 'yourpositions',
        watchlist: 'watchlist'
    };

    const toggleView = (selectedView) => {
        if (selectedView !== view && VIEWS[selectedView]) {
            setView(selectedView);
        }
    };
    const formatWallet = (device) => {
        if (!wallet) return '';

        const lengths = {
            pc: { start: 8, end: 6 },
            mobile: { start: 4, end: 2 }
        };

        const { start, end } = lengths[device] || lengths.pc;
        return `${wallet.slice(0, start)}...${wallet.slice(-end)}`;
    };

    const formatNumber = (number) => {
        if (!number && number !== 0) return '0';
        return Number(number).toLocaleString('en-US');
    };

    useEffect(() => {
        if (data) {
            setFilteredEvents(data.filter(event => event.watchlist === true));
        }
    }, [data]);

    if (!data || !positions) {
        return <Loader />
    }

    return (
        <div className={`content ${style.profilePage}`}>
            <div className={style.profileHeader}>
                <p>Hey, {deviceType !== "desktop" ? formatWallet('mobile') : formatWallet('pc')}!</p>
            </div>
            <div className={style.stats}>
                <div>
                    <div className={style.statsIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M360-160q-19 0-34-11t-22-28l-92-241H40v-80h228l92 244 184-485q7-17 22-28t34-11q19 0 34 11t22 28l92 241h172v80H692l-92-244-184 485q-7 17-22 28t-34 11Z" />
                        </svg>
                    </div>
                    <p className={style.statsHeader}>Positions value</p>
                    <p>0.001 EDU</p>
                </div>
                <div>
                    <div className={style.statsIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
                        </svg>
                    </div>
                    <p className={style.statsHeader}>Profit/loss</p>
                    <p>0.000 EDU</p>
                </div>
                <div>
                    <div className={style.statsIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z" />
                        </svg>
                    </div>
                    <p className={style.statsHeader}>Volume traded</p>
                    <p>0.001 EDU</p>
                </div>
                <div>
                    <div className={style.statsIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" />
                        </svg>
                    </div>
                    <p className={style.statsHeader}>Markets traded</p>
                    <p>0</p>
                </div>
            </div>
            <div className={style.positions}>
                <div className={style.nav}>
                    <div className={view === 'yourpositions' ? style.selected : style.select} onClick={() => toggleView('yourpositions')}>Positions</div>
                    <div className={view === 'watchlist' ? style.selected : style.select} onClick={() => {
                        toggleView('watchlist')
                    }}>Watchlist</div>
                </div>
                {view === 'yourpositions' ?
                    <div className={style.positionsContainer}>
                        {deviceType === "desktop" && (
                            <div className={style.listHeader}>
                                <div className={`${style.column} ${style.name}`}>Name</div>
                                <div className={`${style.column} ${style.average}`}>Avg</div>
                                <div className={`${style.column} ${style.chance}`}>Current</div>
                                <div className={`${style.column} ${style.value}`}>Value</div>
                                <div className={`${style.column} ${style.status}`}>Status</div>
                            </div>
                        )}
                        {positions.map((pos, index) => (
                            <div key={index} className={index === 0 ? `${style.list} ${style.listUnbordered}` : style.list} onClick={() => { navigate(`/event/${pos.id}`) }}>
                                {deviceType !== "desktop" ? (
                                    <div className={style.mobileContainer}>
                                        <div className={`${style.statusText} ${pos.status === 'Win' ? style.winBackground : style.loseBackground}`}>
                                            {pos.status}
                                        </div>
                                        <div className={`${style.column} ${style.name}`}>
                                            <img src={pos.image} />
                                            <div className={style.posName}>
                                                <p>{pos.name}</p>
                                            </div>
                                        </div>
                                        <div className={style.posInfo}>
                                            <div>
                                                <div className={`${style.posType} ${pos.yesNo === 'Yes' ? style.typeYes : style.typeNo}`}>{pos.yesNo}</div>
                                                <p>{formatNumber(pos.amount)} shares</p>
                                            </div>
                                            <div className={`${style.column} ${style.value}`}>
                                                <p>{pos.value}</p>
                                                <p>{'+123.54%'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`${style.column} ${style.name}`}>
                                            <img src={pos.image} />
                                            <div className={style.posName}>
                                                <p onClick={() => { navigate(`/event/${pos.id}`) }}>{pos.name}</p>
                                                <div className={style.posInfo}>
                                                    <div className={`${style.posType} ${pos.yesNo === 'Yes' ? style.typeYes : style.typeNo}`}>{pos.yesNo}</div>
                                                    <p>{formatNumber(pos.amount)} shares</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${style.column} ${style.average}`}>{pos.avg}</div>
                                        <div className={`${style.column} ${style.chance}`}>{pos.chance}</div>
                                        <div className={`${style.column} ${style.value}`}>
                                            <p>{pos.value}</p>
                                            <p className={style.return}>0.00%</p>
                                        </div>
                                        <div className={`${style.column} ${style.status} ${pos.status === 'Win' ? style.winPos : pos.status === 'Lose' ? style.losePos : null}`}>{pos.status}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    :
                    <>
                        {filteredEvents.length > 0 ? (
                            <div className={style.grid}>
                                {filteredEvents.map((event, index) => (
                                    <EventCard
                                        key={index}
                                        id={event.id}
                                        image={event.image}
                                        title={event.name}
                                        chance={event.chance}
                                        volume={event.volume}
                                        yesName={event.yesName}
                                        noName={event.noName}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={style.emptyWatchList}>
                                Your watchlist is empty
                            </div>
                        )}

                    </>
                }
            </div>
        </div>
    )
}

export default Profile
