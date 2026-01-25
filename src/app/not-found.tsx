import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
            {/* Image Container */}
            <div className="relative w-full max-w-lg mb-8">
                <Image
                    src="/images/cat_404.png"
                    alt="404 Cat"
                    width={600}
                    height={600}
                    className="w-full h-auto object-contain"
                    priority
                />
            </div>

            {/* Text Content */}
            <h1 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2 text-black">
                Page Not Found <span role="img" aria-label="warning">⚠️</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-md text-base">
                We couldn't find the page you are looking for
            </p>

            {/* Action Button */}
            <Link
                href="/"
                className="px-6 py-3 bg-[#1F1F1F] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all active:scale-95"
            >
                Back to home page
            </Link>
        </div>
    );
}
