# [ltsdk](https://www.npmjs.com/package/ltsdk)

This package provides functions to interact with the Zoom API, fetch participant and poll data, process this data, and return the processed results.

## Installation

To install the package, use the following command:

```sh
npm install ltsdk
```

## Usage
Here is an example of how to use the run function from the ltsdk package:

```typescript
import { run } from 'ltsdk';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  const accountId = "YOUR_ACCOUNT_ID";
  const clientId = "YOUR_CLIENT_ID";
  const clientSecret = "YOUR_CLIENT_SECRET";
  const meetingId = "YOUR_MEETING_ID";
  try {
    const processedData = await run(accountId, clientId, clientSecret, meetingId);
    console.log(processedData);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

Run the script: 

```bash
tsc .\index.ts
node .\index.js
```

## Parameters
accountId (string): The Zoom account ID.
clientId (string): The Zoom client ID.
clientSecret (string): The Zoom client secret.
meetingId (string): The ID of the Zoom meeting.

## Returns
A promise that resolves to the processed data.

## License
Linux Foundation