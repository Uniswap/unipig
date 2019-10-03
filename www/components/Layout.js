import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'

import RouteLoader from './RouteLoader'
import Header from './Header'
import WalletModal from './WalletModal'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
  justify-content: flex-start;
`

// const BackroundElement = styled.div`
//   width: 100vw;
//   height: 100vh;
//   overflow: none;
//   position: fixed;
//   top: 0px;
//   left: 0px;
//   z-index: -1;
//   overflow: hidden;
//   filter: brightness(30%);
//   transform: scale(1.2);

//   img {
//     position: absolute;
//     top: -30%;
//     right: -400px;
//   }

//   @media only screen and (max-width: 480px) {
//     transform: scale(1);
//     img {
//       top: -50%;
//       right: -40vw;
//     }
//   }
// `

// const rotate = keyframes`
//   from {
//     transform: rotate(0deg);
//   }

//   to {
//     transform: rotate(360deg);
//   }
// `

// const AnimatedImg = styled.img`
//   animation: ${rotate} ${({ time }) => time} linear infinite;
//   user-select: none;
// `

const Element = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify || 'center'};
  align-items: 'flex-start';
  flex: 0 1 auto;
  width: 100vw;

  ${({ header }) =>
    header &&
    css`
      padding: 0.75rem;
      @media only screen and (max-width: 480px) {
        padding: 0.75rem 0.75rem 0.75rem 0;
      }
    `}

  ${({ body }) =>
    body &&
    css`
      max-width: 525px;
      padding: 0 1rem 2rem 1rem;
    `}
`

export default function Layout({
  wallet,
  team,
  addressData,
  updateAddressData,
  OVMBalances,
  updateOVMBalances,
  marketDetails,
  walletModalIsOpen,
  setWalletModalIsOpen,
  updateTotal,
  children
}) {
  const { pathname } = useRouter()
  const onboarding = ['/welcome', '/join-team', '/confirm-wallet'].includes(pathname)
  const home = pathname === '/'
  const showIcons = home
  const showUpdater = !home && !onboarding

  return (
    <>
      <Root>
        {/* <BackroundElement>
          <AnimatedImg time={'200s'} src="static/blob_2.svg" />
          <AnimatedImg time={'500s'} src="static/blob_3.svg" />
          <AnimatedImg time={'250s'} src="static/blob_1.svg" />
        </BackroundElement> */}
        <Element noPadding>
          <RouteLoader />
        </Element>
        <Element header justify={showIcons || showUpdater ? 'space-between' : 'flex-start'} direction="row">
          <Header
            team={team}
            marketDetails={marketDetails}
            updateTotal={updateTotal}
            showIcons={showIcons}
            showUpdater={showUpdater}
            boostsLeft={addressData.boostsLeft || 0}
            setWalletModalIsOpen={setWalletModalIsOpen}
          />
        </Element>
        <Element body>{children}</Element>
        <WalletModal
          wallet={wallet}
          team={team}
          addressData={addressData}
          updateAddressData={updateAddressData}
          OVMBalances={OVMBalances}
          updateOVMBalances={updateOVMBalances}
          isOpen={walletModalIsOpen}
          onDismiss={() => {
            setWalletModalIsOpen(false)
          }}
        />
      </Root>
    </>
  )
}
