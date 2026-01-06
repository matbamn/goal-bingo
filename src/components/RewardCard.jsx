import React from 'react'

function RewardCard({ reward, isUnlocked, isClaimed, onClaim, completedLines = 0 }) {
    const stars = [1, 2, 3, 4, 5]

    return (
        <div className={`reward-card ${isUnlocked ? 'unlocked' : 'locked'} ${isClaimed ? 'claimed' : ''}`}>
            <div className="reward-content">
                <h3 className="reward-label">TOP QUEST REWARD</h3>

                <div className="reward-main-row">
                    <span className="trophy-icon" style={{ fontSize: '2rem' }}>🏆</span>
                    <p className="reward-text">{reward}</p>
                </div>

                <div className="bingo-stars" title={`${completedLines} Bingo Lines achieved!`}>
                    {stars.map((star) => (
                        <span
                            key={star}
                            className={`star ${completedLines >= star ? 'active' : ''}`}
                        >
                            ⭐
                        </span>
                    ))}
                </div>

                {!isUnlocked && (
                    <div className="reward-overlay">
                        <span className="lock-icon" style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔒</span>
                        <p style={{ fontSize: '0.8rem' }}>Achieve a BINGO to unlock</p>
                    </div>
                )}

                {isUnlocked && !isClaimed && (
                    <button className="retro-btn" onClick={onClaim} style={{ marginTop: '1rem' }}>
                        CLAIM REWARD!
                    </button>
                )}

                {isClaimed && (
                    <div className="claimed-stamp">CLAIMED</div>
                )}
            </div>
        </div>
    )
}

export default RewardCard
