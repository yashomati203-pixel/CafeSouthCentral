export function DecorativeBorderOverlay() {
    return (
        <>
            {/* Left Side Border */}
            <div
                className="fixed top-0 left-0 h-full w-[60px] z-[52] pointer-events-none"
                style={{
                    backgroundImage: "url('/Layer 5.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'left top'
                }}
            />
            {/* Right Side Border - Flipped */}
            <div
                className="fixed top-0 right-0 h-full w-[60px] z-[52] pointer-events-none"
                style={{
                    backgroundImage: "url('/Layer 5.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'left top',
                    transform: 'scaleX(-1)'
                }}
            />

            {/* Top Border */}
            <div className="fixed top-2 left-[58px] right-[58px] h-[45px] z-[51] pointer-events-none flex justify-center items-start overflow-hidden"
                style={{
                    backgroundImage: "url('/line3@1.5x.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%'
                }}
            />

            {/* Bottom Border */}
            <div className="fixed bottom-2 left-[58px] right-[58px] h-[45px] z-[51] pointer-events-none flex justify-center items-end overflow-hidden"
                style={{
                    backgroundImage: "url('/line3@1.5x.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    transform: 'scaleY(-1)'
                }}
            />
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
