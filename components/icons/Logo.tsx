import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="E-Learnify Logo"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="200" height="200" fill="#111827" />
            
            {/* Brain */}
            <g fill="url(#logoGradient)">
                {/* Left Brain Half */}
                <path d="M91,30 C70,30 60,50 60,65 C60,80 70,90 80,95 L80,50 C80,40 85,35 91,30 Z" />
                <path d="M80 95 C75 100 70 110 75 120 C80 130 90 125 95 120 L95 90 Z" transform="translate(-10, 0)" />
                <circle cx="65" cy="45" r="5" />
                <circle cx="70" cy="65" r="6" />
                <circle cx="68" cy="85" r="4" />
                <line x1="70" y1="65" x2="80" y2="75" stroke="url(#logoGradient)" strokeWidth="2" />
                <line x1="65" y1="45" x2="80" y2="55" stroke="url(#logoGradient)" strokeWidth="2" />
                <line x1="68" y1="85" x2="80" y2="85" stroke="url(#logoGradient)" strokeWidth="2" />
                
                {/* Right Brain Half */}
                <path d="M109,30 C130,30 140,50 140,65 C140,80 130,90 120,95 L120,50 C120,40 115,35 109,30 Z" />
                <path d="M120 95 C125 100 130 110 125 120 C120 130 110 125 105 120 L105 90 Z" transform="translate(10, 0)" />
                <circle cx="135" cy="45" r="5" />
                <circle cx="130" cy="65" r="6" />
                <circle cx="132" cy="85" r="4" />
                <line x1="130" y1="65" x2="120" y2="75" stroke="url(#logoGradient)" strokeWidth="2" />
                <line x1="135" y1="45" x2="120" y2="55" stroke="url(#logoGradient)" strokeWidth="2" />
                <line x1="132" y1="85" x2="120" y2="85" stroke="url(#logoGradient)" strokeWidth="2" />
                
                {/* Center Line */}
                <rect x="98" y="30" width="4" height="65" />
            </g>

            {/* Book */}
            <path d="M30,120 C40,100 80,90 100,100 L100,125 C80,115 40,125 30,140 Z" fill="url(#logoGradient)" />
            <path d="M170,120 C160,100 120,90 100,100 L100,125 C120,115 160,125 170,140 Z" fill="url(#logoGradient)" />
            
             {/* Text */}
            <text
                x="100"
                y="160"
                fontFamily="sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
            >
                E-Learnify
            </text>
            <text
                x="100"
                y="175"
                fontFamily="sans-serif"
                fontSize="8"
                fontWeight="normal"
                fill="white"
                textAnchor="middle"
                letterSpacing="0.5"
            >
                LEARN SMARTER. GROW FASTER.
            </text>
        </svg>
    );
};

export default Logo;
