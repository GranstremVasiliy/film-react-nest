import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let dto: CreateOrderDto;

  const orderServiceMock = {
    createOrder: jest.fn<OrderService['createOrder']>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    dto = {
      email: 'test@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
          session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('передаёт DTO сервису и возвращает созданный заказ', async () => {
    const serviceResult = {
      total: 1,
      items: [
        {
          id: '9ed1d70e-afbb-4b79-9fc7-9247832c075e',
          ...dto.tickets[0],
        },
      ],
    };

    orderServiceMock.createOrder.mockResolvedValue(serviceResult);

    const result = await controller.createOrder(dto);

    expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);
    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(dto);
    expect(result).toBe(serviceResult);
  });

  it('передаёт ошибку сервиса, если место уже занято', async () => {
    const error = new BadRequestException('Место уже занято');

    orderServiceMock.createOrder.mockRejectedValue(error);

    await expect(controller.createOrder(dto)).rejects.toBe(error);

    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(dto);
  });

  it('передаёт ошибку сервиса, если сеанс не найден', async () => {
    const error = new NotFoundException('Сеанс не найден');

    orderServiceMock.createOrder.mockRejectedValue(error);

    await expect(controller.createOrder(dto)).rejects.toBe(error);

    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(dto);
  });

  it('передаёт заказ без билетов сервису и его ошибку вызывающему коду', async () => {
    dto.tickets = [];

    const error = new BadRequestException('Нет билетов в заказе');

    orderServiceMock.createOrder.mockRejectedValue(error);

    await expect(controller.createOrder(dto)).rejects.toBe(error);

    expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);
    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(dto);
  });
});
