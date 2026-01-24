export default function SectionDivider() {
    return (
        <div className="w-full my-8 flex flex-col items-center">
            {/* 1. Solid Top Line (Base) */}
            <div className="w-full h-2 bg-[#5C3A1A]"></div>

            {/* 2. Gradient Checkerboard Transition */}
            <div className="w-full h-12 relative bg-[#F9F6F0] dark:bg-black">
                {/* Pattern Layer with Gradient Mask */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(45deg, #5C3A1A 25%, transparent 25%), 
                        linear-gradient(-45deg, #5C3A1A 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #5C3A1A 75%), 
                        linear-gradient(-45deg, transparent 75%, #5C3A1A 75%)
                    `,
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    backgroundSize: '20px 20px',
                    opacity: 0.6,
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                }}></div>
            </div>
        </div>
    );
}
