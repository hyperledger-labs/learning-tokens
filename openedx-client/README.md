# Open edX API Client (TypeScript)

This project is a TypeScript client for interacting with the Open edX API. It provides functions to fetch courses, enrollments, course details, instructors, gradebooks, and course blocks from an Open edX instance.

## Folder Structure

```
.env
.gitignore
package.json
tsconfig.json
env/                # Python virtual environment (ignored by git)
  pyvenv.cfg
  bin/
  include/
  lib/
src/
  index.ts          # Main entry point
  api/
    edx.ts          # API functions for Open edX
  types/
    index.ts        # TypeScript interfaces for API data
```

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd openedx-client
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Edit the `.env` file in the root directory:
     ```
     BASE_URL=http://local.openedx.io
     ACCESS_TOKEN=your-access-token
     ```

## Running the Client

- **Development mode (TypeScript, with hot reload):**
  ```sh
  npm run dev
  ```

- **Build for production:**
  ```sh
  npm run build
  ```

- **Run compiled JavaScript:**
  ```sh
  npm start
  ```

## API Usage

All API functions are defined in [`src/api/edx.ts`](src/api/edx.ts). Types for responses are in [`src/types/index.ts`](src/types/index.ts).

Main functions:
- [`getCourses`](src/api/edx.ts): Fetch all courses.
- [`getCourseDetail`](src/api/edx.ts): Fetch details for a specific course.
- [`getCourseInstructors`](src/api/edx.ts): Get instructors for a course.
- [`getEnrollments`](src/api/edx.ts): Get enrollments for a user.
- [`getCourseGradebook`](src/api/edx.ts): Get gradebook for a course.
- [`getCourseBlocks`](src/api/edx.ts): Get all blocks for a course.

See [`src/index.ts`](src/index.ts) for example usage.

## Additional Information

- The project uses [Axios](https://github.com/axios/axios) for HTTP requests.
- Environment variables are loaded using [dotenv](https://github.com/motdotla/dotenv).
- TypeScript configuration is in [`tsconfig.json`](tsconfig.json).
- Python virtual environment in `env/` is ignored by git and not used by the TypeScript client.

## License

ISC