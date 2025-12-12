import React, { useEffect } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Success = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to login or home page after 3 seconds
      navigate('/register') // Change this to your desired redirect path
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='items-center flex flex-col justify-center h-screen bg-gradient-to-br from-green-50 to-emerald-100'>
      {/* Animated Success Icon */}
      <div className='relative mb-8'>
        <div className='absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20'></div>
        <FaCheckCircle className='text-green-500 text-9xl animate-bounce' />
      </div>

      {/* Animated Text */}
      <h1 className='text-green-600 font-bold text-5xl md:text-6xl mb-4 animate-fade-in'>
        Registration Successful!
      </h1>
      
      {/* Subtitle with fade-in animation */}
      <p className='text-gray-600 text-xl mb-8 animate-slide-up opacity-0' style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        Welcome to our community!
      </p>

      {/* Progress bar showing 3-second countdown */}
      <div className='w-64 h-1 bg-gray-200 rounded-full overflow-hidden mt-8'>
        <div className='h-full bg-green-500 animate-progress-bar'></div>
      </div>

      {/* Redirect message */}
      <p className='text-gray-500 mt-4 text-sm'>
        Redirecting in 3 seconds...
      </p>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-progress-bar {
          animation: progress-bar 3s linear forwards;
        }
      `}</style>
    </div>
  )
}

export default Success