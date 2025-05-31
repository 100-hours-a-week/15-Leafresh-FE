'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { useUserStore } from '@entities/member/context/UserStore'
import { LogoutResponse, LogoutVariables } from '@features/member/api/logout'
import { UnregisterResponse } from '@features/member/api/unregister'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { useInfoModalStore } from '@shared/context/modal/InfoModalStore'
import { useDrawerStore } from '@shared/context/slide-drawer/DrawerStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import LogoImage from '@public/image/logo.svg'

interface SlideDrawerProps {
  height: number
  padding: number
}
const SlideDrawer = ({ height, padding }: SlideDrawerProps) => {
  const router = useRouter()
  const { isOpen, close, toggle } = useDrawerStore()
  const { openConfirmModal, isOpen: isConfirmModalOpen } = useConfirmModalStore()
  const { openInfoModal, isOpen: isInfoModalOpen } = useInfoModalStore()
  const { userInfo, clearUserInfo } = useUserStore()
  const { OAuthUserInfo, clearOAuthUserInfo } = useOAuthUserStore()
  const { isLoggedIn } = useAuth()
  const [scrollTop, setScrollTop] = useState<number>(0)

  const drawerRef = useRef<HTMLDivElement>(null)

  const openToast = useToast()

  /** 해당 useEffect는 useScrollLock() 위에 존재해야 합니다! */
  useEffect(() => {
    if (isOpen) {
      setScrollTop(window.scrollY)
    }
  }, [isOpen])

  useOutsideClick(drawerRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) close()
  })
  useKeyClose('Escape', drawerRef as React.RefObject<HTMLElement>, toggle)
  useScrollLock(isOpen)

  /** 로그아웃 */
  const { mutate: LogoutMutate, isPending: isLoggingOut } = useMutationStore<LogoutResponse, LogoutVariables>(
    MUTATION_KEYS.MEMBER.AUTH.LOGOUT,
  )

  /** 회원탈퇴 */
  const { mutate: UnregisterMutate, isPending: isUnregistering } = useMutationStore<UnregisterResponse, undefined>(
    MUTATION_KEYS.MEMBER.UNREGISTER,
  )

  /** 라우팅 로직 */
  const handleRoute = (url: string) => {
    router.push(url)
    close()
  }

  /** 로그아웃 로직 */
  const handleLogout = () => {
    if (!OAuthUserInfo) {
      // TODO: 유효한 로그인 정보 확인해서 분기 처리
      return
    }
    const provider = OAuthUserInfo.provider
    LogoutMutate(
      { provider },
      {
        onSuccess: response => {
          toggle()
          clearOAuthUserInfo()
          clearUserInfo()
          openToast(ToastType.Success, '로그아웃 성공')
          router.push(URL.MAIN.INDEX.value)
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
      onConfirm: () =>
        UnregisterMutate(undefined, {
          onSuccess: response => {
            toggle()
            clearOAuthUserInfo()
            clearUserInfo()
            openToast(ToastType.Success, '회원탈퇴 성공')
            router.push(URL.MAIN.INDEX.value)
          },
        }),
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop />
          <Drawer
            ref={drawerRef}
            style={{ top: `${scrollTop}px` }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            padding={padding}
          >
            <DrawerHeader>
              <StyledImage src={LogoImage} alt='Leafresh 로고' priority />
              <CloseButton name='X' size={24} onClick={close} />
            </DrawerHeader>

            {isLoggedIn ? (
              <UserInfo>
                <ProfileImage src={userInfo?.imageUrl as string} alt='유저 이미지' width={32} height={32} />
                <Nickname>{userInfo?.nickname}</Nickname>
              </UserInfo>
            ) : (
              <AuthRouteButton onClick={() => handleRoute(URL.MEMBER.LOGIN.value)}>로그인 / 회원가입</AuthRouteButton>
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
              <MenuItem
                disabled={false}
                onClick={() => openInfoModal({ title: '추가 예정입니다!', description: 'V2를 기대해주세요!' })}
              >
                포스팅
              </MenuItem>
              {/* <MenuItem disabled={false} onClick={() => handleRoute(URL.STORE.INDEX.value)}>
                포스팅
              </MenuItem> */}
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
        </>
      )}
    </AnimatePresence>
  )
}

export default SlideDrawer

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);
  z-index: 999;
`
const StyledImage = styled(Image)`
  height: 40px;
  width: auto;
`

const Drawer = styled(motion.div)<{ padding: number }>`
  position: absolute;
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
  align-items: center;
`

const MenuItem = styled.button<{ disabled?: boolean }>`
  all: unset;
  padding: 17px 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfBlack.base)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfBlue.hover)};
  }

  width: 100%;
  text-align: center;
`

const DangerItem = styled(MenuItem)<{ disabled?: boolean }>`
  color: ${({ disabled }) => (disabled ? theme.colors.lfGray.base : theme.colors.lfRed.base)};

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
