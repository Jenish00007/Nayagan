import React, { useState, useEffect, useRef } from 'react';

const Typewriter = ({ 
    text, 
    speed = 100, 
    delay = 1000, 
    className = "",
    cursor = true,
    onComplete = null,
    restart = false
}) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const startTyping = () => {
        setIsTyping(true);
        setDisplayText('');
        setCurrentIndex(0);
        
        // Initial delay before starting to type
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev < text.length) {
                        setDisplayText(current => current + text[prev]);
                        return prev + 1;
                    } else {
                        clearInterval(intervalRef.current);
                        setIsTyping(false);
                        if (onComplete) onComplete();
                        return prev;
                    }
                });
            }, speed);
        }, delay);
    };

    const stopTyping = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsTyping(false);
    };

    useEffect(() => {
        if (text) {
            startTyping();
        }

        return () => {
            stopTyping();
        };
    }, [text, restart]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTyping();
        };
    }, []);

    return (
        <span className={className}>
            {displayText}
            {cursor && isTyping && (
                <span className="animate-pulse text-white">|</span>
            )}
        </span>
    );
};

export default Typewriter; 