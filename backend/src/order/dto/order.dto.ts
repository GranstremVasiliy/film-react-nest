export class TicketDto {
  film!: string;
  session!: string;
  daytime!: string;
  day!: string;
  time!: string;
  row!: number;
  seat!: number;
  price!: number;
}

export class CreateOrderDto {
  email!: string;
  phone!: string;
  tickets!: TicketDto[];
}
