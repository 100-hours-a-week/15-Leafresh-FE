import { ApologizeImage } from '@/shared/assets'

import { Feedback } from './feedback'

interface ApologizeFeedbackProps {
  title: string
  description: string
  className?: string
}

export const ApologizeFeedback = ({ title, description, className }: ApologizeFeedbackProps) => {
  return (
    <Feedback className={className}>
      <Feedback.Image src={ApologizeImage} />
      <Feedback.Title text={title} />
      {description && <Feedback.Description text={description} />}
    </Feedback>
  )
}
