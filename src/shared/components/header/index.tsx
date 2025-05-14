'use client'

import { Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useRef } from 'react'
import styled from '@emotion/styled'
import { useMutation } from '@tanstack/react-query'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { LogoutResponseType, LogoutVariables } from '@features/member/api/logout'
import { Unregister } from '@features/member/api/unregister'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/Modal/ConfirmModalStore'
import { ToastType } from '@shared/context/Toast/type'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToast } from '@shared/hooks/useToast/useToast'
import { useToggle } from '@shared/hooks/useToggle/useToggle'
import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

interface HeaderProps {
  height: number
  padding: number
}

const Header = ({ height, padding }: HeaderProps) => {
  const router = useRouter()
  const { userInfo, clearUserInfo } = useOAuthUserStore()
  const { openConfirmModal, isOpen: isConfirmModalOpen } = useConfirmModalStore()
  const openToast = useToast()

  const { value: isOpen, toggle, setValue } = useToggle()
  const drawerRef = useRef<HTMLDivElement>(null)

  const isLoggedIn: boolean = !!userInfo

  useOutsideClick(drawerRef as React.RefObject<HTMLElement>, () => {
    if (!isConfirmModalOpen) toggle()
  })
  useKeyClose('Escape', drawerRef as React.RefObject<HTMLElement>, toggle)
  useScrollLock(isOpen)

  /** 로그아웃 */
  const { mutate: LogoutMutate, isPending: isLoggingOut } = useMutationStore<LogoutResponseType, LogoutVariables>(
    MUTATION_KEYS.MEMBER.AUTH.LOGOUT,
  )

  /** 회원탈퇴 */
  const { mutate: UnregisterMutate, isPending: isUnregistering } = useMutation({
    mutationFn: Unregister,
    onSuccess: response => {
      toggle()
      clearUserInfo()
      openToast(ToastType.Success, '회원탈퇴 성공')
      router.push(URL.MAIN.INDEX.value)
    },
    onError: () => {
      openToast(ToastType.Error, '회원탈퇴 실패.\n다시 시도해주세요')
    },
  })

  /** 라우팅 로직 */
  const handleRoute = (url: string) => {
    router.push(url)
    setValue(false)
  }

  /** 로그아웃 로직 */
  const handleLogout = () => {
    if (!userInfo) {
      // TODO: 유효한 로그인 정보 확인해서 분기 처리
      return
    }
    const provider = userInfo.provider
    LogoutMutate(
      { provider },
      {
        onSuccess: response => {
          toggle()
          clearUserInfo()
          openToast(ToastType.Success, '로그아웃 성공')
          router.push(URL.MAIN.INDEX.value)
        },
        onError: () => {
          openToast(ToastType.Error, '로그아웃 실패.\n다시 시도해주세요')
        },
      },
    )
  }

  /** 회원탈퇴 로직 */
  const handleUnregister = () => {
    if (!userInfo) {
      // TODO: 유효한 로그인 정보 확인해서 분기 처리
      return
    }
    openConfirmModal({
      title: '회원탈퇴 하시겠습니까?',
      description: '탈퇴 시 데이터를 복구할 수 없습니다.',
      onConfirm: () => UnregisterMutate(),
    })
  }
  return (
    <HeaderContainer height={height}>
      <CustomWidthWrapper padding={padding}>
        <LogoWrapper onClick={() => handleRoute(URL.MAIN.INDEX.value)}>
          <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
        </LogoWrapper>
        <MenuButton onClick={toggle}>
          <Menu size={24} strokeWidth={2.5} />
        </MenuButton>
      </CustomWidthWrapper>

      <AnimatePresence>
        {isOpen && (
          <>
            <Backdrop />
            <SlideDrawer
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              padding={padding}
            >
              <DrawerHeader>
                <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
              </DrawerHeader>

              {isLoggedIn ? (
                <>
                  <UserInfo>
                    <ProfileImage src={userInfo?.imageUrl as string} alt='유저 이미지' width={32} height={32} />
                    <Nickname>{userInfo?.nickname}</Nickname>
                    <Emoji>🌱</Emoji>
                  </UserInfo>
                  <StartButton onClick={() => handleRoute(URL.CHALLENGE.GROUP.CREATE.value)}>
                    친환경 챌린지 만들기
                  </StartButton>
                  <MenuItemWrapper>
                    <MenuItem onClick={() => handleRoute(URL.CHALLENGE.INDEX.value)}>챌린지 목록</MenuItem>
                    <MenuItem onClick={() => handleRoute(URL.CHALLENGE.PARTICIPATE.INDEX.value)}>인증하기</MenuItem>
                    {/* <MenuItem onClick={() => handleRoute(URL.STORE.INDEX.value)}>나뭇잎 상점</MenuItem> */}
                    <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                    <DangerItem onClick={handleUnregister}>회원탈퇴</DangerItem>
                  </MenuItemWrapper>
                </>
              ) : (
                <>
                  <AuthRouteButton onClick={() => handleRoute(URL.MEMBER.LOGIN.value)}>
                    로그인 / 회원가입
                  </AuthRouteButton>
                  <MenuItemWrapper>
                    <MenuItem onClick={() => handleRoute(URL.CHALLENGE.INDEX.value)}>챌린지 목록</MenuItem>
                    <MenuItem onClick={() => handleRoute(URL.STORE.INDEX.value)}>나뭇잎 상점</MenuItem>
                  </MenuItemWrapper>
                </>
              )}
            </SlideDrawer>
          </>
        )}
      </AnimatePresence>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.header<{ height: number }>`
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: ${({ height }) => `${height}px`};

  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.lfWhite.base};
  border-bottom: 1px solid ${theme.colors.lfLightGray.base};

  z-index: 100;
`

const CustomWidthWrapper = styled.div<{ padding: number }>`
  width: ${({ padding }) => `calc(100% - ${padding * 2}px)`};
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LogoWrapper = styled.div`
  cursor: pointer;
`

const StyledImage = styled(Image)`
  height: 40px;
  width: auto;
`

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`

const SlideDrawer = styled(motion.div)<{ padding: number }>`
  position: fixed;
  top: 0;
  right: 0;

  height: 100dvh;
  width: 70%;
  max-width: 300px;

  background-color: ${theme.colors.lfWhite.base};
  box-shadow: ${theme.shadow.lfPrime};
  padding: 20px 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
`
const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0 8px;
`

const ProfileImage = styled(Image)`
  border-radius: 50%;
`

const Nickname = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
`

const Emoji = styled.div`
  font-size: 18px;
`

const StartButton = styled.div`
  width: max-content;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  padding: 17px 30px;
  margin: 20px 0;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  cursor: pointer;
`

const AuthRouteButton = styled.button`
  width: fit-content;
  padding: 4px;
  margin: 20px 0px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  border-bottom: 1px solid ${theme.colors.lfBlack.base};
  align-self: center;
`

const MenuItemWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const MenuItem = styled.div`
  padding: 17px 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.lfBlue.hover};
  }
`

const DangerItem = styled(MenuItem)`
  color: ${theme.colors.lfRed.base};

  &:hover {
    color: ${theme.colors.lfRed.hover};
  }
`
