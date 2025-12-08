import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center h-screen bg-white text-black p-6 overflow-hidden">
        
        {/* Main Content (centered) */}
        <div className="z-10 flex flex-col items-center justify-center h-full">
          <Image
            src={`../svgs/logo.svg`}
            alt='wholesale-logo'
            height={200}
            width={200}
            className='bg-gray-900 p-3 rounded-xl'
          />
          
          <h1 className="text-5xl font-extrabold text-green-500 tracking-wider">
            404
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-semibold mt-4 mb-2 text-gray-500">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-500 max-w-lg text-center leading-relaxed mb-8">
            We are sorry, but the page you requested could not be found. 
            It might be an old link or the page may have been moved.
          </p>
          
          <Link 
            href="/" 
            className="hover:cursor-pointer px-6 py-3 text-lg font-medium text-white transition duration-300 ease-in-out 
                      bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </>
  );
}