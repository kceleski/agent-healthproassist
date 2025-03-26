
import React from 'react';

const AvaHeartbeatLogo: React.FC<{
  width?: number | string;
  height?: number | string;
  className?: string;
}> = ({ width = 300, height = 100, className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-slate-900 rounded-lg"></div>
      
      <svg 
        viewBox="0 0 300 100" 
        width="100%" 
        height="100%" 
        preserveAspectRatio="xMidYMid meet"
        className="relative z-10"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Adding white outline effect */}
          <filter id="white-outline" x="-10%" y="-10%" width="120%" height="120%">
            <feFlood floodColor="white" floodOpacity="0.5" result="outlineColor"/>
            <feComposite in="outlineColor" in2="SourceAlpha" operator="in" result="outlineImage"/>
            <feGaussianBlur in="outlineImage" stdDeviation="2" result="outlineBlur"/>
            <feComposite in="SourceGraphic" in2="outlineBlur" operator="over"/>
          </filter>
        </defs>
        
        {/* The main path that will be animated */}
        <path
          d="M 0,50 
             L 30,50 
             L 45,50 
             L 55,20 
             L 65,80 
             L 75,50 
             L 90,50
             L 120,50
             L 135,50 
             L 145,20 
             L 155,80 
             L 165,50 
             L 180,50
             L 210,50
             L 225,50 
             L 235,20 
             L 245,80 
             L 255,50 
             L 270,50
             L 300,50"
          fill="none"
          stroke="#00b3ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="heartbeat-path"
        />
        
        {/* The text AVA - made more prominent */}
        <text 
          x="150" 
          y="75" 
          textAnchor="middle" 
          fill="#00b3ff" 
          fontSize="24"
          fontWeight="bold"
          filter="url(#white-outline)"
          className="text-ava"
        >
          AVA
        </text>
      </svg>
      
      {/* Adding the CSS animation using standard style tag, not jsx */}
      <style>
        {`
        .heartbeat-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 3s linear forwards infinite;
        }
        
        @keyframes dash {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .text-ava {
          opacity: 0;
          animation: fadeIn 0.5s ease-in forwards;
          animation-delay: 2.5s;
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        `}
      </style>
    </div>
  );
};

export default AvaHeartbeatLogo;
