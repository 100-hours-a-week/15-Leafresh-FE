import { z } from 'zod'

import { profileSchema } from './consts'

export interface MemberProfileModifyPageProps {
  className?: string
}

export type ProfileForm = z.infer<typeof profileSchema>
