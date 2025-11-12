
import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 200"
        aria-label="Sistem Rikkes TNI AU Logo"
        {...props}
    >
        <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        
        {/* Shield Background */}
        <path 
            d="M 100,10 L 180,50 L 180,120 C 180,160 140,190 100,190 C 60,190 20,160 20,120 L 20,50 Z" 
            fill="url(#shieldGradient)"
        />

        {/* Inner White Shape for Contrast */}
        <g transform="scale(0.85)" transform-origin="center">
             <path 
                d="M 100,10 L 180,50 L 180,120 C 180,160 140,190 100,190 C 60,190 20,160 20,120 L 20,50 Z" 
                fill="white"
                stroke="currentColor"
                strokeWidth="5"
            />
        </g>
        
        {/* Wings */}
        <g fill="currentColor">
            {/* Left Wing */}
            <path d="M 90,70 C 70,70 50,80 30,100 C 50,95 70,90 90,90 Z" />
            <path d="M 90,95 C 65,95 45,105 25,125 C 45,120 65,115 90,115 Z" />
            <path d="M 90,120 C 60,120 40,130 20,150 C 40,145 60,140 90,140 Z" />
        </g>
        <g fill="currentColor" transform="translate(200, 0) scale(-1, 1)">
            {/* Right Wing */}
            <path d="M 90,70 C 70,70 50,80 30,100 C 50,95 70,90 90,90 Z" />
            <path d="M 90,95 C 65,95 45,105 25,125 C 45,120 65,115 90,115 Z" />
            <path d="M 90,120 C 60,120 40,130 20,150 C 40,145 60,140 90,140 Z" />
        </g>
        
        {/* Medical Cross */}
        <rect x="90" y="80" width="20" height="60" rx="3" fill="white" stroke="currentColor" strokeWidth="2" />
        <rect x="70" y="100" width="60" height="20" rx="3" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export default Logo;
