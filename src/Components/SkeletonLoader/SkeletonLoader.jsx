import React from 'react';
import styles from './SkeletonLoader.module.css';

const SkeletonLoader = () => {
    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonTitle} />
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.skeletonVariantList} />
                    <div className={styles.cardVolume}>
                        <div className={styles.skeletonVolume} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;