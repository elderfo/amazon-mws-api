import dotenv from 'dotenv';
import MWS from  '../';


describe('Orders', () => {
  const env = process.env;
  const explicitArray = false;
  const marketplaceId = 'ATVPDKIKX0DER';

  dotenv.config();

  const client = new MWS.Client(env.AccessKey, env.SecretKey, env.MerchantId, {explicitArray: explicitArray});

  it('list orders command', () =>{
    let listOrders = MWS.Orders.requests.ListOrders();
    listOrders.set('CreatedAfter', new Date(2005, 0, 1));
    listOrders.set('MarketplaceId', marketplaceId);

    return client.invoke(listOrders).then((resp)  =>{
      const orders = resp.ListOrdersResponse.ListOrdersResult.Orders.Order;

      expect(orders.length).toBeGreaterThan(0);
      expect(orders.length).toBeLessThan(10000);

      const nextToken = resp.ListOrdersResponse.ListOrdersResult.NextToken;
      expect(nextToken).toBeDefined();
    });
  });
  
  // it('get single order', function(done){
  //   var getOrder = MWS.Orders.requests.GetOrder();
  //   console.log(getOrder);
  //   // 000-0000000-0000000
  //   getOrder.set('AmazonOrderId', '112-8444240-5137016');
  //   client.invoke(getOrder, function (resp) {
  //     var order = resp.GetOrderResponse.GetOrderResult[0].Orders[0].Order;
  //     console.log(JSON.stringify(order));
  //     done();
  //   });
  // });

});
