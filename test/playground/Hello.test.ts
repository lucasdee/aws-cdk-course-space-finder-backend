import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTable/Read';

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: 'be44c721-61c4-44ca-afab-3c363db43740',
  },
} as any;

const result = handler(event as any, {} as any).then(apiRes => {
  const items = JSON.parse(apiRes.body);
  debugger;
});
