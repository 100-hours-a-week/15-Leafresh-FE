'use client'

import { Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation } from '@tanstack/react-query'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { Logout } from '@features/member/api/logout'
import { Unregister } from '@features/member/api/unregister'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/Modal/ConfirmModalStore'
import { useDrawerStore } from '@shared/context/slide-drawer/DrawerStore'
import { ToastType } from '@shared/context/Toast/type'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

interface HeaderProps {
  height: number
  padding: number
}

const Header = ({ height, padding }: HeaderProps) => {
  const router = useRouter()
  const { isOpen, close, toggle } = useDrawerStore()
  const { openConfirmModal, isOpen: isConfirmModalOpen } = useConfirmModalStore()

  const { userInfo, clearUserInfo } = useOAuthUserStore()

  const isLoggedIn: boolean = !!userInfo

  const headerRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const [drawerRight, setDrawerRight] = useState<number>(0)

  const openToast = useToast()

  useLayoutEffect(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect()
      const rightOffset = window.innerWidth - rect.right
      setDrawerRight(rightOffset)
    }
  }, [isOpen]) // Drawer 열릴 때 계산

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setDrawerRight(window.innerWidth - rect.right)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useOutsideClick(drawerRef as React.RefObject<HTMLElement>, () => {
    if (!isConfirmModalOpen) toggle()
  })
  useKeyClose('Escape', drawerRef as React.RefObject<HTMLElement>, toggle)
  useScrollLock(isOpen)

  /** 로그아웃 */
  const { mutate: LogoutMutate, isPending: isLoggingOut } = useMutation({
    mutationFn: Logout,
    onSuccess: response => {
      toggle()
      clearUserInfo()
      openToast(ToastType.Success, '로그아웃 성공')
      router.push(URL.MAIN.INDEX.value)
    },
    onError: () => {
      openToast(ToastType.Error, '로그아웃 실패.\n다시 시도해주세요')
    },
  })

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
    close()
  }

  /** 로그아웃 로직 */
  const handleLogout = () => {
    if (!userInfo) {
      // TODO: 유효한 로그인 정보 확인해서 분기 처리
      return
    }
    LogoutMutate(userInfo.provider)
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
    <HeaderContainer height={height} ref={headerRef}>
      <ContentWrapper padding={padding}>
        <CustomWidthWrapper padding={padding}>
          <LogoWrapper onClick={() => router.push(URL.MAIN.INDEX.value)}>
            <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
          </LogoWrapper>
          <MenuButtons>
            <AlarmButton name='Bell' size={24} onClick={() => router.push(URL.MEMBER.ALARM.value)} />
            <Menu size={24} strokeWidth={2.5} onClick={toggle} />
          </MenuButtons>
        </CustomWidthWrapper>

        <AnimatePresence>
          {isOpen && (
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* <Backdrop /> */}
              <Drawer
                ref={drawerRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                padding={padding}
                style={{ right: `${drawerRight}px` }}
              >
                <DrawerHeader>
                  <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
                  <CloseButton name='X' size={24} onClick={close} />
                </DrawerHeader>

                {isLoggedIn ? (
                  <UserInfo>
                    <ProfileImage src={userInfo?.imageUrl as string} alt='유저 이미지' width={32} height={32} />
                    <Nickname>{userInfo?.nickname}</Nickname>
                    <Emoji>🌱</Emoji>ㅡ
                  </UserInfo>
                ) : (
                  <AuthRouteButton onClick={() => handleRoute(URL.MEMBER.LOGIN.value)}>
                    로그인 / 회원가입
                  </AuthRouteButton>
                )}
                <StartButton onClick={() => handleRoute(URL.CHALLENGE.GROUP.CREATE.value)}>
                  친환경 챌린지 만들기
                </StartButton>
                <MenuItemWrapper>
                  <MenuItem disabled={false} onClick={() => handleRoute(URL.CHALLENGE.INDEX.value)}>
                    챌린지 목록
                  </MenuItem>
                  <MenuItem disabled={!isLoggedIn} onClick={() => handleRoute(URL.CHALLENGE.PARTICIPATE.INDEX.value)}>
                    인증하기
                  </MenuItem>
                  <MenuItem disabled={false} onClick={() => handleRoute(URL.STORE.INDEX.value)}>
                    포스팅
                  </MenuItem>
                  <MenuItem disabled={false} onClick={() => handleRoute(URL.STORE.INDEX.value)}>
                    나뭇잎 상점
                  </MenuItem>
                  <MenuItem disabled={!isLoggedIn} onClick={handleLogout}>
                    로그아웃
                  </MenuItem>
                  <DangerItem disabled={!isLoggedIn} onClick={handleUnregister}>
                    회원탈퇴
                  </DangerItem>
                </MenuItemWrapper>
              </Drawer>
            </Overlay>
          )}
        </AnimatePresence>
      </ContentWrapper>
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

const ContentWrapper = styled.div<{ padding: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;

  /* overflow: hidden; */
  display: flex;
  align-items: center;
  justify-content: center;
`

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100dvh;
  position: absolute;

  inset: 0;
  background-color: ${theme.colors.lfBackdrop.base};
  overflow: hidden;
  z-index: 999;
`

const CustomWidthWrapper = styled.div<{ padding: number }>`
  width: 100%;
  padding: ${({ padding }) => `0px ${padding}px`};
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

const MenuButtons = styled.button`
  position: absolute;
  right: 35px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;

  background: none;
  border: none;
  cursor: pointer;
`

const AlarmButton = styled(LucideIcon)``

const Drawer = styled(motion.div)<{ padding: number }>`
  position: fixed;
  top: 0;
  right: 0;

  height: 100dvh;
  width: 80%;
  max-width: 300px;

  background-color: ${theme.colors.lfWhite.base};
  box-shadow: ${theme.shadow.lfPrime};
  padding: 20px 24px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;

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

  cursor: pointer;
`

const MenuItemWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MenuItem = styled.button<{ disabled?: boolean }>`
  all: unset;
  padding: 17px 0;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfBlack.base)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  cursor: pointer;

  &:hover {
    color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfBlue.hover)};
  }

  width: 100%;
  text-align: center;
`

const DangerItem = styled(MenuItem)`
  color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfRed.base)};

  cursor: pointer;
  &:hover {
    color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfRed.hover)};
  }
`

const CloseButton = styled(LucideIcon)`
  position: absolute;
  top: 15px;
  right: 15px;

  cursor: pointer;
`
