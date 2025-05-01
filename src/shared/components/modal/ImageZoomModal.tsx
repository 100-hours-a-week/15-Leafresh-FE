'use client'

import { Check, X } from 'lucide-react'
import Image from 'next/image'

import styled from '@emotion/styled'

import { ChallengeVerificationResultType } from '@entities/challenge/type'
import { useImageZoomStore } from '@shared/context/ImageZoomState'

const Wrapper = styled.div`
  width: 390px;
  height: 100dvh;

  position: absolute;
  top: 0;

  display: flex;
  flex-direction: column;

  background-color: #dedede;
`

const Header = styled.div`
  padding: 12px 12px;
  font-size: 14px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #444;
  color: #fff;
`

const ResultBar = styled.div<{ result: ChallengeVerificationResultType }>`
  background-color: ${({ result }) => (result === 'SUCCESS' ? '#2e7d32' : '#c62828')};
  color: #fff;
  text-align: center;
  padding: 2px 0px;
`

const ImageWrapper = styled.div`
  // 정사각형
  height: 390px;
  width: 390px;

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Description = styled.div`
  flex: 1;

  text-align: center;
  font-size: 12px;
  background-color: #444;
  color: #fff;

  padding: 12px;
`

const ImageZoomModal = () => {
  /** 이미지 데이터 가져오기 */
  const { isOpen, close, data, targetIndex } = useImageZoomStore()

  if (!isOpen) return null
  /** 표시할 데이터 */
  const { result, imageSrc, description } = data[targetIndex]

  const IMAGE_COUNT = data.length
  return (
    isOpen && (
      <Wrapper>
        <Header>
          <span>
            {targetIndex + 1}/{IMAGE_COUNT}
          </span>
          <X size={20} onClick={close} style={{ cursor: 'pointer', position: 'absolute', right: '10px' }} />
        </Header>

        <ResultBar result={result}>{result === 'SUCCESS' ? <Check size={20} /> : <X size={20} />}</ResultBar>

        <ImageWrapper>
          <StyledImage src={imageSrc} alt='zoom-image' width={390} height={390} />
        </ImageWrapper>

        <Description>{description}</Description>
      </Wrapper>
    )
  )
}

export default ImageZoomModal
