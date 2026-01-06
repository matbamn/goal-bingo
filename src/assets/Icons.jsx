// Pixel Art Icon Images
import shoeIcon from './icons/shoe.png'
import bookIcon from './icons/book.png'
import appleIcon from './icons/apple.png'
import coffeeIcon from './icons/coffee.png'
import heartIcon from './icons/heart.png'
import starIcon from './icons/star.png'
import medalIcon from './icons/medal.png'
import sunIcon from './icons/sun.png'
import giftIcon from './icons/gift.png'

// Icon mapping object
export const ICON_MAP = {
    Shoe: shoeIcon,
    Book: bookIcon,
    Apple: appleIcon,
    Coffee: coffeeIcon,
    Heart: heartIcon,
    Star: starIcon,
    Medal: medalIcon,
    Sun: sunIcon,
    Gift: giftIcon
}

// Helper component to render icon images
export const PixelIcon = ({ name, size = 32, style = {} }) => {
    const iconSrc = ICON_MAP[name] || ICON_MAP.Star

    return (
        <img
            src={iconSrc}
            alt={name}
            style={{
                width: size,
                height: size,
                imageRendering: 'pixelated',
                ...style
            }}
        />
    )
}
