import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaArrowRight, FaHome, FaUsers, FaRocket } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Success = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(3)
  const [particles, setParticles] = useState([])

  // Create floating particles
  useEffect(() => {
    const particleCount = 30
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }))
    setParticles(newParticles)
  }, [])

  // Countdown and redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/register')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 to-green-300/30"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}

      {/* Geometric background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border-2 border-emerald-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border-2 border-green-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-300/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Animated Success Icon */}
          <div className="relative mb-12">
            <div className="relative inline-block">
              {/* Outer glow ring */}
              <div className="absolute inset-0 w-64 h-64 bg-gradient-to-r from-emerald-500/30 to-green-400/30 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Middle ring */}
              <div className="absolute inset-0 w-48 h-48 bg-gradient-to-r from-emerald-400/40 to-green-300/40 rounded-full animate-spin-slow"></div>
              
              {/* Icon container */}
              <div className="relative w-40 h-40 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <FaCheckCircle className="text-emerald-600 text-7xl animate-bounce" />
              </div>
              
              {/* Floating dots around icon */}
              {[0, 90, 180, 270].map((degree) => (
                <div
                  key={degree}
                  className="absolute w-4 h-4 bg-emerald-400 rounded-full"
                  style={{
                    left: `${50 + 80 * Math.cos((degree * Math.PI) / 180)}%`,
                    top: `${50 + 80 * Math.sin((degree * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `orbit 3s linear infinite ${degree * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Text */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent mb-6 animate-fade-in">
              Successfully Registered!
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-xl sm:text-2xl text-emerald-100 mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                Your laptop has been successfully registered in the system
              </p>
              <p className="text-lg text-emerald-200/80 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                Welcome to AASTU's Laptop Management Portal
              </p>
            </div>
          </div>

          {/* Success Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-400/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl font-bold text-white mb-2">✓</div>
              <div className="text-lg font-semibold text-emerald-100">Registration Complete</div>
              <div className="text-sm text-emerald-200/70">All details verified</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-400/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 animate-slide-up" style={{ animationDelay: '1s' }}>
              <div className="text-4xl font-bold text-white mb-2">🛡️</div>
              <div className="text-lg font-semibold text-emerald-100">Security Activated</div>
              <div className="text-sm text-emerald-200/70">System protected</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-400/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <div className="text-4xl font-bold text-white mb-2">🚀</div>
              <div className="text-lg font-semibold text-emerald-100">Ready to Go</div>
              <div className="text-sm text-emerald-200/70">Access granted</div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-emerald-100 font-medium">Redirecting in {countdown} seconds...</span>
                <span className="text-white font-bold text-lg">{countdown}s</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-3 bg-emerald-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 rounded-full transition-all duration-1000"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                />
              </div>
              
              {/* Progress dots */}
              <div className="flex justify-between mt-2">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      dot <= (3 - countdown) 
                        ? 'bg-emerald-400 scale-125' 
                        : 'bg-emerald-900/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="group px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaHome />
                <span>Go to Dashboard</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/list')}
                className="group px-8 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-100 border border-emerald-500/30 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaUsers />
                <span>View All Laptops</span>
              </button>
              
              <button
                onClick={() => navigate('/register')}
                className="group px-8 py-3 bg-transparent hover:bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaRocket />
                <span>Register Another</span>
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-emerald-500/20 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '1.5s' }}>
            <p className="text-emerald-200/60 text-sm">
              Your registration is now complete. You can access the laptop list or dashboard anytime.
            </p>
            <p className="text-emerald-300/40 text-xs mt-2">
              Need help? Contact IT Support at support@aastu.edu.et
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(80px) rotate(-360deg);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .text-7xl {
            font-size: 3.5rem;
          }
          .text-6xl {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Success