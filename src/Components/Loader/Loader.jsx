import React, { useEffect, useState } from "react";
import styles from "./Loader.module.css";
import loader2 from "../../assets/loader2.png";

const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = (err) => reject(err);
        })
    )
  );
};

const Loader = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const imagesToLoad = [loader2];
    preloadImages(imagesToLoad)
      .then(() => setImagesLoaded(true))
      .catch((err) => console.error("Error loading images", err));
  }, []);

  if (!imagesLoaded) {
    return <div className={styles.loaderWrapper}>Загрузка...</div>;
  }

  return (
    <div className={styles.loaderWrapper}>
      <img src={loader2} className={styles.name} alt="Loader Name" />
    </div>
  );
};

export default Loader;
