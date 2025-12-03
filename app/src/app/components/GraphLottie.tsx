import dynamic from 'next/dynamic'
import GRAPH_ANIMATION from '../../../public/LottieGraph.json'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const GraphLottie = ({ style = { scale: '1.1' } }) => {
  return (
    <Lottie
      animationData={GRAPH_ANIMATION}
      style={style}
      loop={true}
      autoplay={true}
    />
  )
}

export default GraphLottie
