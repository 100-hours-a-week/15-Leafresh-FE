import { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  if (!open) return null

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

// Modal 컴포지션용 Slot
Modal.Trigger = function Trigger({ children }: { children: ReactNode }) {
  return <>{children}</>
}

Modal.Header = function Header({ children }: { children: ReactNode }) {
  return <div className='modal-header'>{children}</div>
}

Modal.Body = function Body({ children }: { children: ReactNode }) {
  return <div className='modal-body'>{children}</div>
}

Modal.Footer = function Footer({ children }: { children: ReactNode }) {
  return <div className='modal-footer'>{children}</div>
}

export default Modal
