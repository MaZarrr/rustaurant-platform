export class CreateUserDto {
  _id: number | string
  isActivated?: boolean
  // ckeckedNum?: number
  username?: string
  age?: number
  password?: string
  products?: any
  phone?: string
  save?()
  }