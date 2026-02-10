'use client';

export default function RotatingBadge() {
    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg
                className="absolute w-full h-full badge-rotate"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="transparent"
                    />
                </defs>
                <text className="text-[10px] font-bold fill-[#102214] uppercase tracking-[0.1em]">
                    <textPath href="#circlePath">
                        100% Fresh • Made Today • 100% Fresh •
                    </textPath>
                </text>
            </svg>
            <div className="bg-[#102214] text-[#f7e231] rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs z-10">
                FRESH
            </div>
        </div>
    );
}
