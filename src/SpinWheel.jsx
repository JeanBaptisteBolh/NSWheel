import { useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import balajiImage from './assets/balaji.png'
import './SpinWheel.css'

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [completedChallenge, setCompletedChallenge] = useState(null)
  const wheelRef = useRef(null)

  // Segments with variable angles - prize is smaller
  const segments = [
    { label: '50 Push-ups', color: '#FF4757', type: 'burn', angle: 38, challenge: '50 push-ups' },
    { label: 'Buy ETH', color: '#1E90FF', type: 'earn', angle: 38, challenge: 'eth' },
    { label: 'Smart Contracts', color: '#FFA502', type: 'learn', angle: 38, challenge: 'question1' },
    { label: 'Run 5K', color: '#FF6348', type: 'burn', angle: 38, challenge: 'run 5km' },
    { label: '🎁 PRIZE', color: '#FFD700', type: 'prize', angle: 18 }, // Smaller - Gold
    { label: 'Charter Cities', color: '#FF7F50', type: 'learn', angle: 38, challenge: 'question2' },
    { label: '100 Burpees', color: '#EE5A6F', type: 'burn', angle: 38, challenge: '100 burpees' },
    { label: 'Stake SOL', color: '#00A8FF', type: 'earn', angle: 38, challenge: 'solana' },
    { label: 'Learn DAOs', color: '#FF9F43', type: 'learn', angle: 38, challenge: 'question3' },
    { label: 'Buy Bitcoin', color: '#4A90E2', type: 'earn', angle: 38, challenge: 'bitcoin' },
  ]

  const leaderboard = [
    { name: 'Player 1', score: 1250 },
    { name: 'Player 2', score: 980 },
    { name: 'Player 3', score: 850 },
    { name: 'Player 4', score: 720 },
    { name: 'Player 5', score: 650 },
  ]

  const questions = [
    {
      id: 'question1',
      question: 'What are Smart Contracts?',
      options: [
        'Digital legal documents',
        'Self-executing contracts with code on blockchain',
        'AI-powered agreements'
      ],
      correct: 1
    },
    {
      id: 'question2',
      question: 'What is a Charter City?',
      options: [
        'A historical city with a charter',
        'A new city with special governance and regulations',
        'A city that rents boats'
      ],
      correct: 1
    },
    {
      id: 'question3',
      question: 'What is a DAO?',
      options: [
        'Digital Asset Organization',
        'Decentralized Autonomous Organization',
        'Data Analysis Office'
      ],
      correct: 1
    }
  ]

  const triggerPrizeConfetti = () => {
    // Regular confetti burst
    const duration = 4000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min, max) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Custom Bitcoin and Balaji images
    createCustomConfetti()
  }

  const createCustomConfetti = () => {
    const duration = 4000
    const images = ['₿', '🪙', '💰', '🎉', '⭐', '💎']
    const container = document.createElement('div')
    container.className = 'custom-confetti-container'
    document.body.appendChild(container)

    const interval = setInterval(() => {
      const piece = document.createElement('div')
      piece.className = 'confetti-piece'
      piece.textContent = images[Math.floor(Math.random() * images.length)]
      piece.style.left = Math.random() * 100 + '%'
      piece.style.animationDuration = (Math.random() * 2 + 2) + 's'
      piece.style.fontSize = (Math.random() * 60 + 40) + 'px'
      container.appendChild(piece)

      setTimeout(() => {
        piece.remove()
      }, 4000)
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      setTimeout(() => {
        container.remove()
      }, 4000)
    }, duration)

    // Add floating Balaji images
    createFloatingImages()
  }

  const createFloatingImages = () => {
    const container = document.createElement('div')
    container.className = 'floating-images-container'
    document.body.appendChild(container)

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const floater = document.createElement('img')
        floater.src = balajiImage
        floater.className = 'floating-balaji'
        floater.style.left = Math.random() * 80 + 10 + '%'
        floater.style.animationDelay = Math.random() * 0.5 + 's'
        floater.style.animationDuration = (Math.random() * 2 + 2) + 's'
        container.appendChild(floater)

        setTimeout(() => {
          floater.remove()
        }, 4000)
      }, i * 200)
    }

    setTimeout(() => {
      container.remove()
    }, 5000)
  }

  const getWinningSegment = (finalRotation) => {
    const normalizedRotation = ((finalRotation % 360) + 360) % 360
    const adjustedRotation = (360 - normalizedRotation + 90) % 360
    
    let currentAngle = 0
    for (let i = 0; i < segments.length; i++) {
      currentAngle += segments[i].angle
      if (adjustedRotation < currentAngle) {
        return segments[i]
      }
    }
    return segments[0]
  }

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)

    const minSpins = 5
    const maxSpins = 10
    const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + (randomSpins * 360) + randomAngle

    setRotation(totalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      
      const winningSegment = getWinningSegment(totalRotation)
      
      if (winningSegment.type === 'prize') {
        setTimeout(() => {
          triggerPrizeConfetti()
          // Show prize popup
          setCurrentChallenge(winningSegment)
          setShowPopup(true)
        }, 200)
      } else {
        // Show popup for other challenges
        setCurrentChallenge(winningSegment)
        setShowPopup(true)
      }
    }, 4000)
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setCurrentChallenge(null)
    setShowShareOptions(false)
    setCompletedChallenge(null)
  }

  const handleAnswer = (answerIndex) => {
    const question = questions.find(q => q.id === currentChallenge.challenge)
    if (question && answerIndex === question.correct) {
      setCompletedChallenge({
        type: 'learn',
        message: `Answered trivia correctly!`
      })
      setShowShareOptions(true)
    } else {
      alert('Incorrect. Try again.')
    }
  }

  const handleBurnComplete = () => {
    setCompletedChallenge({
      type: 'burn',
      message: `Completed ${currentChallenge.challenge}!`
    })
    setShowShareOptions(true)
  }

  const handleCryptoInvestment = (crypto, amount) => {
    const cryptoNames = {
      bitcoin: 'Bitcoin',
      eth: 'Ethereum',
      solana: 'Solana'
    }
    setCompletedChallenge({
      type: 'earn',
      message: `Invested $${amount} in ${cryptoNames[crypto]}!`
    })
    setShowShareOptions(true)
  }

  const handlePrizeClaim = () => {
    setCompletedChallenge({
      type: 'prize',
      message: 'Won one month at Network School!'
    })
    setShowShareOptions(true)
  }

  const handleShare = (platform) => {
    const messages = {
      learn: `🎓 Just learned about ${currentChallenge.label} on the Burn, Earn, Learn Wheel! #Web3 #Learning #Crypto`,
      burn: `💪 Just completed a fitness challenge: ${currentChallenge.challenge}! #BurnEarnLearn #Fitness`,
      earn: `💰 ${completedChallenge.message} #BurnEarnLearn #Crypto #Web3`,
      prize: `🎉 I WON ONE MONTH AT NETWORK SCHOOL! 🎉 #NetworkSchool #Winner #BurnEarnLearn`
    }

    const message = messages[completedChallenge.type]
    
    // Simulated share
    alert(`Sharing to ${platform}:\n\n"${message}"\n\n(This is a simulation - no actual post was made)`)
    handlePopupClose()
  }

  return (
    <div className="app-container">
      <img src={balajiImage} alt="Balaji" className="balaji-image" />
      <div className="main-content">
        <div className="wheel-section">
          <h1 className="wheel-title">🎡 Burn, Earn, Learn Wheel 🎡</h1>
          
          <div className="wheel-wrapper">
            <div className="wheel-pointer">▼</div>
            
            <div 
              ref={wheelRef}
              className="wheel"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
              }}
            >
              <svg viewBox="0 0 200 200" className="wheel-svg">
                <circle cx="100" cy="100" r="95" fill="#2c3e50" stroke="#fff" strokeWidth="2"/>
                
                {(() => {
                  let currentAngle = -90
                  return segments.map((segment, index) => {
                    const startAngle = currentAngle * (Math.PI / 180)
                    const endAngle = (currentAngle + segment.angle) * (Math.PI / 180)
                    const middleAngle = (currentAngle + segment.angle / 2) * (Math.PI / 180)
                    
                    const x1 = 100 + 95 * Math.cos(startAngle)
                    const y1 = 100 + 95 * Math.sin(startAngle)
                    const x2 = 100 + 95 * Math.cos(endAngle)
                    const y2 = 100 + 95 * Math.sin(endAngle)
                    
                    const largeArcFlag = segment.angle > 180 ? 1 : 0
                    const pathData = `M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
                    
                    // Texto alineado radialmente (del centro hacia afuera)
                    const textRadius = 65
                    const textX = 100 + textRadius * Math.cos(middleAngle)
                    const textY = 100 + textRadius * Math.sin(middleAngle)
                    const textRotation = currentAngle + segment.angle / 2
                    
                    currentAngle += segment.angle
                    
                    return (
                      <g key={index}>
                        <path d={pathData} fill={segment.color} stroke="#fff" strokeWidth="2"/>
                        <text
                          x={textX}
                          y={textY}
                          fill="#2c3e50"
                          fontSize={segment.type === 'prize' ? '9' : '8'}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        >
                          {segment.label}
                        </text>
                      </g>
                    )
                  })
                })()}
                
                <circle cx="100" cy="100" r="15" fill="#fff" stroke="#2c3e50" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          <button 
            className="spin-button"
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
          </button>
          
          <button 
            className="simulate-win-button"
            onClick={() => {
              triggerPrizeConfetti()
              setCurrentChallenge(segments.find(s => s.type === 'prize'))
              setShowPopup(true)
            }}
          >
            🎁 Simulate Win
          </button>
        </div>

        <div className="leaderboard">
          <h2>🏆 Leaderboard</h2>
          <div className="leaderboard-list">
            {leaderboard.map((player, index) => (
              <div key={index} className="leaderboard-item">
                <span className="player-rank">#{index + 1}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-score">{player.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popups */}
      {showPopup && currentChallenge && (
        <div className="popup-overlay" onClick={handlePopupClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {currentChallenge.type === 'learn' && (
              <>
                <h2>📚 Learning Challenge</h2>
                {(() => {
                  const question = questions.find(q => q.id === currentChallenge.challenge)
                  return (
                    <>
                      <p className="question-text">{question.question}</p>
                      <div className="options">
                        {question.options.map((option, index) => (
                          <button
                            key={index}
                            className="option-button"
                            onClick={() => handleAnswer(index)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </>
            )}

            {currentChallenge.type === 'burn' && !showShareOptions && (
              <>
                <h2>🔥 Fitness Challenge</h2>
                <p className="challenge-text">Complete this challenge!</p>
                <p className="challenge-detail">{currentChallenge.challenge}</p>
                <button className="complete-button" onClick={handleBurnComplete}>
                  ✓ Completed
                </button>
                <button className="cancel-button" onClick={handlePopupClose}>
                  Cancel
                </button>
              </>
            )}

            {currentChallenge.type === 'earn' && !showShareOptions && (
              <>
                <h2>💰 Crypto Investment</h2>
                <p className="challenge-text">
                  {currentChallenge.challenge === 'bitcoin' && 'Invest in Bitcoin - Digital Gold! 🪙'}
                  {currentChallenge.challenge === 'eth' && 'Invest in Ethereum - Smart Contract Platform! ⚡'}
                  {currentChallenge.challenge === 'solana' && 'Stake Solana - High-Speed Blockchain! 🚀'}
                </p>
                <div className="bitcoin-options">
                  <button className="bitcoin-button" onClick={() => handleCryptoInvestment(currentChallenge.challenge, 100)}>
                    Invest $100
                  </button>
                  <button className="bitcoin-button" onClick={() => handleCryptoInvestment(currentChallenge.challenge, 500)}>
                    Invest $500
                  </button>
                  <button className="bitcoin-button" onClick={() => handleCryptoInvestment(currentChallenge.challenge, 1000)}>
                    Invest $1000
                  </button>
                </div>
                <button className="cancel-button" onClick={handlePopupClose}>
                  Cancel
                </button>
              </>
            )}

            {currentChallenge.type === 'prize' && !showShareOptions && (
              <>
                <h2 className="prize-title">🎉 CONGRATULATIONS! 🎉</h2>
                <p className="prize-message">You Win One Month at NS!</p>
                <p className="prize-subtext">You've hit the grand prize! Get ready for an amazing experience at Network School.</p>
                <button className="prize-claim-button" onClick={handlePrizeClaim}>
                  🎁 Claim Your Prize
                </button>
              </>
            )}

            {showShareOptions && completedChallenge && (
              <>
                <h2>🎉 Challenge Completed!</h2>
                <p className="share-text">{completedChallenge.message}</p>
                <p className="share-prompt">Share your achievement:</p>
                <div className="share-buttons">
                  <button className="share-button twitter" onClick={() => handleShare('Twitter')}>
                    <span className="share-icon">🐦</span>
                    Twitter
                  </button>
                  <button className="share-button farcaster" onClick={() => handleShare('Farcaster')}>
                    <span className="share-icon">🟣</span>
                    Farcaster
                  </button>
                  <button className="share-button facebook" onClick={() => handleShare('Facebook')}>
                    <span className="share-icon">📘</span>
                    Facebook
                  </button>
                  <button className="share-button linkedin" onClick={() => handleShare('LinkedIn')}>
                    <span className="share-icon">💼</span>
                    LinkedIn
                  </button>
                </div>
                <button className="skip-button" onClick={handlePopupClose}>
                  Skip
                </button>
              </>
            )}

            <button className="close-popup" onClick={handlePopupClose}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpinWheel
