import { LogoCharacterImage } from '@/shared/assets'

import { Feedback } from './feedback'

interface NoContentFeedbackProps {
  title: string
  buttonText: string
  clickHandler: (...args: unknown[]) => void
  className?: string
}

export const NoContentFeedback = ({ title, buttonText, clickHandler, className }: NoContentFeedbackProps) => {
  return (
    <Feedback className={className}>
      <Feedback.Image src={LogoCharacterImage} />
      <Feedback.Title text={title} />
      <Feedback.Action clickHandler={clickHandler} text={buttonText} />
    </Feedback>
  )
}
