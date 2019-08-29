import styled from 'styled-components'

import { useStyledTheme } from '../hooks'

enum Fill {
  gradient,
  transparent,
  solid
}

enum Border {
  transparent,
  solid
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BaseButtonStyledStripped = ({ fill, border, solidColor, textColor, ...rest }): JSX.Element => <button {...rest} />
const BaseButtonStyled = styled(BaseButtonStyledStripped)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 10rem;
  min-height: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  user-select: none;

  font-family: inherit;
  font-size: 100%;

  /* disabled */
  opacity: ${({ disabled }): string => disabled && '0.5'};

  /* fill and background color */
  ${({ fill, theme }): string => fill === Fill.gradient && theme.gradientBackground}
  ${({ fill, theme }): string => fill === Fill.transparent && theme.transparentBackground}
  ${({ fill, theme, solidColor }): string => fill === Fill.solid && theme.colorBackground(solidColor)}

  /* text color */
  color: ${({ fill, theme }): string => fill === Fill.gradient && theme.colors.white};
  color: ${({ fill, solidColor }): string => fill === Fill.transparent && solidColor};
  color: ${({ fill, textColor }): string => fill === Fill.solid && textColor};

  /* border */
  border: ${({ border, theme }): string => border === Border.transparent && `1px solid ${theme.colors.transparent}`};
  border: ${({ border, solidColor }): string => border === Border.solid && `1px solid ${solidColor}`};

  :hover {
    cursor: ${({ onClick, href, disabled }): string => !!((onClick || href) && !disabled) && 'pointer'};
  }
`

interface ButtonArguments {
  fill: Fill
  border: Border
  solidColor?: any
  textColor?: any
  children: any
}

function BaseButton({ fill, border, solidColor, textColor, children, ...rest }: ButtonArguments): JSX.Element {
  return (
    <BaseButtonStyled fill={fill} border={border} solidColor={solidColor} textColor={textColor} {...rest}>
      {children}
    </BaseButtonStyled>
  )
}

export function GradientButton({ children, ...rest }): JSX.Element {
  return (
    <BaseButton fill={Fill.gradient} border={Border.transparent} {...rest}>
      {children}
    </BaseButton>
  )
}

export function TransparentButton({ children, color, ...rest }): JSX.Element {
  const theme = useStyledTheme()

  return (
    <BaseButton fill={Fill.transparent} border={Border.solid} solidColor={color || theme.colors.uniswap} {...rest}>
      {children}
    </BaseButton>
  )
}

export function SolidButton({ children, color, textColor, ...rest }): JSX.Element {
  const theme = useStyledTheme()

  return (
    <BaseButton
      fill={Fill.solid}
      border={Border.transparent}
      solidColor={color || theme.colors.uniswap}
      textColor={textColor || theme.colors.white}
      {...rest}
    >
      {children}
    </BaseButton>
  )
}
