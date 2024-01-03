export type OrderStateProps =
  | 'WAITING'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'RETURNED';

export class OrderState {
  public value: OrderStateProps;

  constructor(value: OrderStateProps) {
    this.value = value;
  }

  static create(value?: OrderStateProps) {
    if (!value) {
      return new OrderState('WAITING');
    }

    return new OrderState(value);
  }
}
