import { EventChallenge } from '@entities/challenge/api'

export interface EventSectionProps {
  eventChallenges: EventChallenge[]
  className?: string
}
