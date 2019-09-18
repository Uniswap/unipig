import ReactConfetti from 'react-confetti'

import { useWindowSize } from '../hooks'

export default function Confetti({ start }) {
  const { width, height } = useWindowSize()

  return (
    <ReactConfetti
      numberOfPieces={100}
      recycle={false}
      run={start}
      width={width}
      height={height}
      confettiSource={{
        x: width / 2,
        y: height / 2
      }}
      initialVelocityX={15}
      initialVelocityY={25}
      gravity={0.5}
      tweenDuration={250}
      wind={0.05}
    />
  )
}
