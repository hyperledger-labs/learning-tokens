import { run } from '../src/zoomprocessor';

test('fetch and process Zoom data', async () => {
  const accountId = "YOUR_ACCOUNT_ID";
  const clientId = "YOUR_CLIENT_ID";
  const clientSecret = "YOUR_CLIENT_SECRET";
  const meetingId = 'YOUR_MEETING_ID';

  const processedData = await run(accountId, clientId, clientSecret, meetingId);
  expect(processedData).toMatchSnapshot();
});