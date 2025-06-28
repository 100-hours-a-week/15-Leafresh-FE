import styled from '@emotion/styled'

export const CardContainer = styled.div`
  cursor: pointer;
  width: 180px;
  border-radius: ${({ theme }) => theme.radius.base};
  overflow: hidden;
  cursor: pointer;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
`

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
`
//이미지가 유효하지 않을 시
export const PlaceholderWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #d1d5db;
`

export const PlaceholderIcon = styled.div`
  display: flex;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background-color: white;
`

export const PlaceholderIconInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const PlaceholderCircle = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  background-color: #d1d5db;
`

export const PlaceholderRect = styled.div`
  margin-top: 0.5rem;
  height: 2rem;
  width: 3rem;
  background-color: #d1d5db;
`

export const CoverImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`
export const RewardBadge = styled.div`
  align-self: flex-end;
  margin-top: 14px;

  display: flex;
  align-items: center;
  margin-right: 8px;
  border-radius: 5px;
`

export const RewardText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xss};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px 8px;
`

export const Title = styled.div`
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const TagsContainer = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;
`

export const Tag = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSize.xss};
  color: #3b82f6;
`
