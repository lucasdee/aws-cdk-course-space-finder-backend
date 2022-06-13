import { handler } from '../../services/SpacesTable/Read';

const result = handler({} as any, {} as any).then((apiRes) => {
  const items = JSON.parse(apiRes.body);
  debugger;
});
