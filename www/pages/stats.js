import NavButton from '../components/NavButton'
import { ButtonText } from '../components/Type'

function Stats() {
  return (
    <NavButton variant="gradient" stretch href="/">
      <ButtonText>Dope</ButtonText>
    </NavButton>
  )
}

// TODO add PG API and deal with decimals
Stats.getInitialProps = async () => {
  return {}
}

export default Stats
