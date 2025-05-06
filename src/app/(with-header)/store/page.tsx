'use client'

import { z } from 'zod'

import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'

import Dropdown, { DropdownProps } from '@shared/components/dropdown'
import ErrorText from '@shared/components/errortext'
import Input from '@shared/components/input'
import { StyledGeneric } from '@shared/styles/emotion/utils'
import { theme } from '@shared/styles/theme'

const schema = z.object({
  title: z.string().min(1, '챌린지 제목을 입력해주세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
})

type FormValues = z.infer<typeof schema>

type CategoryType = {
  id: string
  label: string
}
const CATEGORY_OPTIONS = [
  { id: '1', label: '제로웨이스트' },
  { id: '2', label: '플로깅' },
  { id: '3', label: '비건' },
  { id: '4', label: '제로웨이스트' },
  { id: '5', label: '플로깅' },
  { id: '6', label: '비건' },
  { id: '7', label: '제로웨이스트' },
  { id: '8', label: '플로깅' },
  { id: '9', label: '비건' },
  { id: '10', label: '제로웨이스트' },
  { id: '11', label: '플로깅' },
  { id: '12', label: '비건' },
]

const DropdownInputForm = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: '',
    },
  })

  const selectedCategory = CATEGORY_OPTIONS.find(option => option.id === watch('category'))
  const title = watch('title')

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Input label='챌린지 제목' value={title} required {...register('title')} />
        <ErrorText message={errors.title?.message} />
      </FieldGroup>

      <FieldGroup>
        <StyledDropdown
          label='카테고리 선택 *'
          options={CATEGORY_OPTIONS}
          selected={selectedCategory}
          getOptionKey={opt => opt.id}
          getOptionLabel={opt => opt.label}
          onChange={opt => setValue('category', opt.id)}
        />
        <ErrorText message={errors.category?.message} />
      </FieldGroup>

      <SubmitButton type='submit'>제출</SubmitButton>
    </Form>
  )
}

export default DropdownInputForm

const Form = styled.form`
  width: 100%;
  /* max-width: 320px; */
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-top: 24px;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const StyledDropdown = StyledGeneric<DropdownProps<CategoryType>>(
  Dropdown,
  `
  width: 100%;
`,
)

const SubmitButton = styled.button`
  padding: 10px 16px;
  font-size: ${theme.fontSize.sm};
  background-color: ${theme.colors.lfGreenMain.base};
  color: white;
  border: none;
  border-radius: ${theme.radius.base};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`
