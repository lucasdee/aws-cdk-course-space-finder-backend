import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTable/Create';

const event: APIGatewayProxyEvent = {
  body: {
    name: 'someName',
  },
} as any;

const result = handler(event as any, {} as any).then(apiRes => {
  // const items = JSON.parse(apiRes.body);
  debugger;
});
