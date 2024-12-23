'use client';
import { useEffect, useState } from "react";
import { useElementBoundaryObserver } from '../../../src/useElementBoundaryObserver';

export default function NextIntersectionObserver({ children, rootmargin, thresholdValue, classes, topIn, topOut, bottomIn, bottomOut }) {
    const [ref, boundary] = useElementBoundaryObserver(rootmargin, thresholdValue);
    const [className, setClassName] = useState(classes);

    useEffect(() => {
        // Update the className based on the boundary state.
        switch (boundary) {
            case 'topIn':
                setClassName(`${classes} ${topIn}`);
                break;
            case 'topOut':
                setClassName(`${classes} ${topOut}`);
                break;
            case 'bottomIn':
                setClassName(`${classes} ${bottomIn}`);
                break;
            case 'bottomOut':
                setClassName(`${classes} ${bottomOut}`);
                break;
            default:
                setClassName(`${classes} ${bottomOut}`);
                break;
        }
    }, [boundary, classes, topIn, topOut, bottomIn, bottomOut]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}