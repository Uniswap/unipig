import ReactConfetti from 'react-confetti'

import { useWindowSize } from '../hooks'

export default function Confetti({ start, variant }) {
  const { width, height } = useWindowSize()

  const _variant = variant ? variant : height && width && height > 1.5 * width ? 'bottom' : variant

  return start ? (
    <ReactConfetti
      style={{ zIndex: 1401 }}
      numberOfPieces={100}
      recycle={false}
      run={true}
      width={width}
      height={height}
      confettiSource={{
        x: width / 2,
        y: _variant === 'top' ? height * 0.25 : _variant === 'bottom' ? height * 0.75 : height * 0.5
      }}
      initialVelocityX={15}
      initialVelocityY={30}
      gravity={0.45}
      tweenDuration={100}
      wind={0.05}
    />
  ) : null
}
