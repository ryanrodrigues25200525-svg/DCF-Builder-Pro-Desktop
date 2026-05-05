import { SparklineProps } from './types';

export const Sparkline = ({ data, width = 60, height = 20, color = '#3b82f6' }: SparklineProps) => {
    const signature = `${width}:${height}:${Array.isArray(data) ? data.join(",") : ""}`;
    let hash = 0;
    for (let i = 0; i < signature.length; i++) {
        hash = ((hash << 5) - hash) + signature.charCodeAt(i);
        hash |= 0;
    }
    const gradientId = `sparkline-gradient-${Math.abs(hash)}`;

    if (!data || data.length < 2) {
        return (
            <svg width={width} height={height} className="opacity-30">
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="currentColor" strokeWidth="1" />
            </svg>
        );
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');
    const isPositive = data[data.length - 1] >= data[0];
    const strokeColor = color;

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx={width}
                cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
                r="2"
                fill={isPositive ? '#22c55e' : '#ef4444'}
            />
        </svg>
    );
};
