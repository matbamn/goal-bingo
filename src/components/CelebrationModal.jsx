import React from 'react'

function CelebrationModal({ reward, onClose }) {
    return (
        <div className="celebration-overlay" onClick={onClose}>
            <div className="celebration-content" onClick={e => e.stopPropagation()}>
                <div className="victory-icon">🎉</div>
                <h2>CONGRATULATIONS!</h2>
                <p>You've officially earned your reward:</p>
                <div className="earned-reward-box">
                    "{reward}"
                </div>
                <p className="claim-message">You did it! Now go enjoy your prize.</p>

                <div className="celebration-actions">
                    <button className="share-btn" onClick={() => alert('Feature coming soon!')}>Share Achievement</button>
                    <button className="close-victory-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default CelebrationModal
