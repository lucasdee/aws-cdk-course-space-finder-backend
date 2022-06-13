import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTable/Read';

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    location: 'London',
  },
} as any;

const result = handler(event as any, {} as any).then(apiRes => {
  // const items = JSON.parse(apiRes.body);
  debugger;
});
