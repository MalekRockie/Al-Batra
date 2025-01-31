import React from 'react';
import styles from '../../../scss/LoadingSpinner.module.scss'; // Create this CSS module

const LoadingSpinner = ({ 
    imageSrc, 
    imageSize = 80,
    borderSize = 4,
    spinnerSize = 100,
    spinnerColor = '#737373',
    animationSpeed = '1s',
    className 
  }) => {
    return (
      <div className={`${styles.spinnerContainer} ${className}`}>
        <div 
          className={styles.spinnerWrapper}
          style={{
            width: spinnerSize,
            height: spinnerSize,
            '--spinner-color': spinnerColor,
            '--animation-speed': animationSpeed
          }}
        >
          <div 
            className={styles.spinnerBorder}
            style={{
              borderWidth: borderSize
            }}
          ></div>
          <img 
            src={imageSrc} 
            alt="Loading content"
            style={{
              width: imageSize,
              height: imageSize
            }}
            className={styles.staticImage}
          />
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;