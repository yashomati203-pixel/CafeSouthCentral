export function DecorativeBorderOverlay() {
    return (
        <>
            {/* Left Side Border */}
            <div
                className="fixed top-0 left-0 h-full w-[40px] md:w-[60px] z-[52] pointer-events-none"
                style={{
                    backgroundImage: "url('/Layer 5.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'left top'
                }}
            />
            {/* Right Side Border - Flipped */}
            <div
                className="fixed top-0 right-0 h-full w-[40px] md:w-[60px] z-[52] pointer-events-none"
                style={{
                    backgroundImage: "url('/Layer 5.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'left top',
                    transform: 'scaleX(-1)'
                }}
            />

            {/* Top Border */}
            <div className="fixed top-2 left-[38px] md:left-[58px] right-[38px] md:right-[58px] h-[45px] z-[51] pointer-events-none flex justify-center items-start overflow-hidden">
                <img
                    src="/line3@1.5x.png"
                    alt="Top Border"
                    className="w-full h-full object-fill pointer-events-none"
                />
            </div>

            {/* Bottom Border */}
            <div className="fixed bottom-2 left-[38px] md:left-[58px] right-[38px] md:right-[58px] h-[45px] z-[51] pointer-events-none flex justify-center items-end overflow-hidden">
                <img
                    src="/line3@1.5x.png"
                    alt="Bottom Border"
                    className="w-full h-full object-fill transform scale-y-[-1] pointer-events-none"
                />
            </div>
        </>
    );
}

export function DecorativeBorderLogo({ children, size = 'md' }: { children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
    const paddingClass = size === 'sm' ? 'py-0 px-3' : 'py-0 px-6';

    return (
        <div className={`relative inline-flex justify-center items-center ${paddingClass}`}>
            {/* The Logo itself */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
