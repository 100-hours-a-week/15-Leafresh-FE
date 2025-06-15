import GroupChallengeCard from '@features/challenge/components/challenge/group/list/GroupChallengeCard' // TODO: 같은 이름의 컴포넌트가 있음. 수정필요
import GridBox from '@shared/components/grid/ui/grid'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import styled from '@emotion/styled'

export const Container = styled.div`
  ${responsiveHorizontalPadding};

  max-width: 800px;
  min-height: 800px;
  display: flex;
  flex-direction: column;
`

export const BannerSection = styled.section<{ bannerUrl: string }>`
  min-width: 320px;
  max-width: 500px;
  width: 100vw;
  height: 240px;

  position: absolute;
  top: 0;
  left: 0;

  background-image: ${({ bannerUrl }) => `url(${bannerUrl})`};
  background-size: cover;
  background-position: center;

  display: flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.colors.lfWhite.base};
`

export const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 20px;
  margin-bottom: 40px;
`

export const ContentWrapper = styled.div`
  margin-top: 240px; /* BannerSection 높이와 동일하게 설정 */
  background-color: white;
  width: 100%;
  z-index: 1;
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
  z-index: 100;
`

export const AddButton = styled.button`
  all: unset;
  font-size: 24px;
  color: #333;
  cursor: pointer;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
`

export const SearchBar = styled.form`
  padding: 10px 0px;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 15px 10px 35px;
  border-radius: 6px;
  border: none;
  background-color: #f3f3f3;
  font-size: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;

  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

export const ChallengeWrapper = styled.div`
  padding: 16px 0px;
  display: flex;
  justify-content: center;
`

export const ObserverElement = styled.div`
  width: 100%;
  height: 20px;
`

export const EmptySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
export const StyledGroupChallengeCard = styled(GroupChallengeCard)`
  width: 100%;
`

export const Message = styled.div`
  padding: 40px;
  text-align: center;
`

export const Grid = styled(GridBox)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`
export const EmptyButton = styled.button`
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  width: 220px;
  height: 40px;
  align-self: center;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  cursor: pointer;
`
