import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTable/Delete';

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: '42a5673a-c8fc-42fd-b947-9538a1d197bb',
  },
} as any;

const result = handler(event as any, {} as any).then(apiRes => {
  // const items = JSON.parse(apiRes.body);
  debugger;
});
