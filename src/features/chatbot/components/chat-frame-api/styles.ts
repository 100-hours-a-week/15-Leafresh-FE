import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
`

export const MessagesContainer = styled.div`
  display: flex;
  width: 100%;
  padding-right: 20px;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 10px;
`

export const SelectionWrapper = styled.div`
  margin: 8px 0;
  /* padding-left: 40px; */
  width: 100%;
`

export const InputContainer = styled.div`
  display: flex;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
`

export const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: #888888;
  }
`

export const SendButton = styled.button`
  width: 44px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`
