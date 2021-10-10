type ModelDB = {
  _id: string;
  isActivated: boolean;
  phone: string;
};

export class UserDto {
  public id: string;
  public isActivated: boolean;
  public phone: string;

  constructor(_id, isActivated, phone) {
    this.id = _id;
    this.isActivated = isActivated;
    this.phone = phone;
  }
}
