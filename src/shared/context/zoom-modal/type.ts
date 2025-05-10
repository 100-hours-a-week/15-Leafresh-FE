export interface ZoomModalStore<DataType> {
  isOpen: boolean
  data: DataType[]
  targetIndex: number
  open: (data: DataType[], targetIndex: number) => void
  close: () => void
  setTargetIndex: (targetIndex: number) => void
}
