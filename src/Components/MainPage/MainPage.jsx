import React, { useRef, useState } from 'react';
import { useEffect, useContext } from 'react';
import style from './MainPage.module.css';
import { DataContext } from '../../context/DataContext';
import EventCard from '../EventCard/EventCard';
import { useNavigate } from 'react-router-dom';
import AdCard from '../AdCard/AdCard';
import SubCategory from '../SubCategory/SubCategory';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import cryptoCardImage from '../../assets/crypto.png';
import cultureCardImage from '../../assets/culture.png';
import politicsCardImage from '../../assets/politics.png';
import sportsCardImage from '../../assets/sports.png';

const MainPage = () => {
    const navigate = useNavigate();
    const { data, filteredEvents, setFilteredEvents, deviceType } = useContext(DataContext);
    const [loading, setLoading] = useState(true);
    const loadingArray = new Array(8).fill(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const adCardsRef = useRef(null);

    const adCards = [{
        name: 'Crypto Vibes',
        image: cryptoCardImage,
        category: 'crypto',
    }, {
        name: 'Cultural Beat',
        image: cultureCardImage,
        category: 'culture',
    }, {
        name: 'Power Moves',
        image: politicsCardImage,
        category: 'politics',
    }, {
        name: 'Game On',
        image: sportsCardImage,
        category: 'sports',
    }];

    useEffect(() => {
        if (data) {
            setFilteredEvents(data.slice(0, 8));
            setLoading(false);
        }
    }, [data, setFilteredEvents]);

    const handleDrag = {
        onMouseDown: (e) => {
            setIsDragging(true);
            setStartX(e.pageX - adCardsRef.current.offsetLeft);
            setScrollLeft(adCardsRef.current.scrollLeft);
        },
        onMouseMove: (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - adCardsRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            adCardsRef.current.scrollLeft = scrollLeft - walk;
        },
        onMouseUp: () => setIsDragging(false),
        onMouseLeave: () => setIsDragging(false)
    };

    const renderAdCards = () => (
        adCards?.map((event, index) => (
            <AdCard
                key={index}
                index={index}
                name={event.name}
                image={event.image}
                category={event.category}
            />
        ))
    );

    const renderEvents = () => (
        loading ? (
            loadingArray.map((_, index) => <SkeletonLoader key={index} />)
        ) : (
            filteredEvents.map((event, index) => (
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
            ))
        )
    );

    return (
        <div className={`${"content"} ${style.mainPageContent}`}>
            <div
                ref={adCardsRef}
                className={`${style.adCards} ${isDragging ? style.grabbing : style.grab}`}
                {...handleDrag}
            >
                {renderAdCards()}
            </div>
            <SubCategory />
            <div className={style.grid}>
                {renderEvents()}
            </div>
            <div className={style.viewAll}>
                <button
                    onClick={() => { navigate(`/category/all`) }}
                    className={style.viewButton}>
                    View all
                </button>
            </div>
        </div>
    );
};

export default MainPage;