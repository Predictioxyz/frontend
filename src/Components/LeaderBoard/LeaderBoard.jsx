import React from "react";
import style from './LeaderBoard.module.css';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import Loader from "../Loader/Loader";

const LeaderBoard = () => {
    const { volumeLeaders, profitLeaders, deviceType } = useContext(DataContext);

    const formatWallet = (wallet, device) => {
        const lengths = {
            pc: { start: 8, end: 6 },
            mobile: { start: 4, end: 2 }
        };
        const { start, end } = lengths[device] || lengths.pc;
        return `${wallet.slice(0, start)}...${wallet.slice(-end)}`;
    }

    const getRankStyle = (index) => {
        const ranks = {
            0: style.rankGold,
            1: style.rankSilver,
            2: style.rankBronze
        };
        return ranks[index] || '';
    };

    const LeaderItem = ({ user, index }) => (
        <div className={`${style.leader} ${index === 0 ? style.unbordered : ''}`}>
            <div className={`${style.userRank} ${getRankStyle(index)}`}>
                {index + 1}
            </div>
            <div className={style.userInfo}>
                <div className={style.userWallet}>
                    {deviceType === "phone"
                        ? formatWallet(user.wallet, 'mobile')
                        : formatWallet(user.wallet, 'pc')}
                </div>
                <div className={style.userBank}>
                    {user.bank}
                </div>
            </div>
        </div>
    );

    const VolumeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
        </svg>
    );

    const ProfitIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
        </svg>
    );

    const LeaderSection = ({ title, icon: Icon, users }) => (
        <div>
            <div className={style.leadersContainerHeader}>
                <Icon />
                <p>{title}</p>
            </div>
            <div className={style.leaders}>
                {users.slice(0, 20).map((user, index) => (
                    <LeaderItem key={index} user={user} index={index} />
                ))}
            </div>
        </div>
    );

    if (volumeLeaders().length < 1 || profitLeaders().length < 1) {
        return <Loader />
    }

    return (
        <div className={`${style.leadersPage} ${"content"}`}>
            <div className={style.pageTitle}>
                <h1>Leaderboard</h1>
            </div>
            <div className={style.leadersContainer}>
                <LeaderSection
                    title="Volume"
                    icon={VolumeIcon}
                    users={volumeLeaders()}
                />
                <LeaderSection
                    title="Profit"
                    icon={ProfitIcon}
                    users={profitLeaders()}
                />
            </div>
        </div>
    )
};
export default LeaderBoard;