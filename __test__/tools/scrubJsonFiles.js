/* eslint-disable no-console */
import 'colors';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid';

import ListOrders from '../data/ListOrders.json';

export function scrubListFile() {

  const listOrdersFile = path.join(__dirname, '../data/ListOrders.json');

  console.log(`Scrubbing file: ${listOrdersFile}`.yellow);

  const orders = ListOrders.ListOrdersResponse.ListOrdersResult.Orders.Order;
  orders.forEach(order => {
    const name = uuid.v4();

    order.BuyerEmail = uuid.v4();
    order.AmazonOrderId = uuid.v4();
    order.BuyerName = name;
    order.MarketplaceId = uuid.v4();

    if (order.ShippingAddress) {
      Object.keys(order.ShippingAddress).forEach((key) => {
        order.ShippingAddress[key] = uuid.v4();
      });

      order.ShippingAddress.Name = name;
    }
  });

  ListOrders.ListOrdersResponse.ListOrdersResult.NextToken = uuid.v4();

  fs.writeFile(listOrdersFile, JSON.stringify(ListOrders, null, 2), 'utf-8', err => {
    if (err) {
      console.log(`Failed to save file: ${err}`.red);
    }
  });
}

scrubListFile();
