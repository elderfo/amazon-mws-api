import 'colors';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid';

import ListOrders from '../data/ListOrders.json';



// {
//     "LatestShipDate": "2014-08-27T06:59:59Z",
//     "OrderType": "StandardOrder",
//     "PurchaseDate": "2014-08-22T18:34:21Z",
//     "BuyerEmail": "fx70ptsf4gm9rs4@marketplace.amazon.com",
//     "AmazonOrderId": "114-5041254-6073041",
//     "LastUpdateDate": "2014-08-22T22:33:20Z",
//     "ShipServiceLevel": "Std Cont US Street Addr",
//     "NumberOfItemsShipped": "1",
//     "OrderStatus": "Shipped",
//     "SalesChannel": "Amazon.com",
//     "ShippedByAmazonTFM": "false",
//     "IsBusinessOrder": "false",
//     "LatestDeliveryDate": "2014-09-04T06:59:59Z",
//     "NumberOfItemsUnshipped": "0",
//     "BuyerName": "James E. Crytzer",
//     "EarliestDeliveryDate": "2014-08-28T07:00:00Z",
//     "OrderTotal": {
//     "CurrencyCode": "USD",
//         "Amount": "13.89"
// },
//     "IsPremiumOrder": "false",
//     "EarliestShipDate": "2014-08-25T07:00:00Z",
//     "MarketplaceId": "ATVPDKIKX0DER",
//     "FulfillmentChannel": "MFN",
//     "PaymentMethod": "Other",
//     "ShippingAddress": {
//     "StateOrRegion": "PA",
//         "City": "Oil City",
//         "CountryCode": "US",
//         "PostalCode": "16301",
//         "Name": "James E. Crytzer",
//         "AddressLine1": "166 Hahn Lane"
// },
//     "IsPrime": "false",
//     "ShipmentServiceLevelCategory": "Standard"
// }

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

        if ( order.ShippingAddress)
        {
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