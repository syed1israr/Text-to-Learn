# Text-to-Learn: AI-Powered Course Generator

Text-to-Learn is a full-stack web application that transforms free-form topic descriptions into structured, multi-module learning courses with video lessons, interactive slides, and text-to-speech narration. The application uses Azure OpenAI to generate course structures and lesson content, Remotion for video rendering, and Fonada API for voice narration.

## Live Demo

**Live Application:** [https://text-to-learn-isr.vercel.app/](https://text-to-learn-isr.vercel.app/)

The application is fully responsive and optimized for both desktop and mobile devices.

## Hackathon Alignment

This project addresses the "Text-to-Learn: AI-Powered Course Generator" hackathon problem statement by implementing an end-to-end solution that converts unstructured topic inputs into structured educational content.

The system operates on a hierarchical structure:

- **Topics → Courses**: User-provided free-form topics are processed by Azure OpenAI to generate complete course configurations, including course names, descriptions, difficulty levels, and organizational structure.

- **Courses → Modules**: Each generated course consists of up to 3 major modules (chapters), each designed as a distinct learning unit with its own title and learning objectives.

- **Modules → Lessons**: Each module contains multiple sub-lessons (subContent), where each sub-lesson is converted into an animated slide with synchronized narration. This multi-level structure ensures comprehensive coverage of the topic while maintaining clear learning progression.

The implementation of 3 major modules with multiple sub-lessons per module satisfies the requirement for "multi-module, multi-lesson" structured learning content, enabling users to learn complex topics through progressive, organized delivery.

## Key Features

- **Topic-to-Course Generation**: Users enter any topic description, and Azure OpenAI generates a structured course outline with modules and lessons
- **Structured Modules and Lessons**: Courses are organized into chapters (modules) with multiple sub-lessons, each mapped to individual slides
- **Video-Based Lessons**: Lessons are rendered as interactive videos using Remotion, combining HTML slides with synchronized audio playback
- **HTML Slide Content**: Each lesson slide is generated as self-contained HTML with Tailwind CSS, featuring progressive reveal animations tied to narration timing
- **Text-to-Speech Narration**: Fonada API generates natural voice narration for each slide, synchronized with visual content reveals
- **Persistent Course Storage**: All generated courses, chapters, and slides are stored in PostgreSQL (Neon) and can be accessed anytime
- **User Authentication**: Clerk handles user authentication and authorization, ensuring course data is user-specific
- **Responsive UI**: Fully responsive interface using Tailwind CSS with mobile-first design principles and breakpoint optimizations
- **Course Library**: Users can view all their previously generated courses from the homepage
- **Interactive Course Viewer**: Courses can be viewed as full course videos or individual module videos with integrated slide navigation
- **Notes View**: Slide content can be viewed as structured notes with narration text, accessible without video playback

## Application Flow

1. **Topic Input**: User navigates to the homepage and enters a topic description in the text area, optionally selecting "Full Course" or "Video Series" type
2. **Authentication Check**: If not authenticated, user is prompted to sign in via Clerk
3. **Course Structure Generation**: Upon submission, the application generates a unique course ID and calls the course-layout API, which uses Azure OpenAI to create a JSON course structure with up to 3 chapters
4. **Course Persistence**: The generated course structure is saved to PostgreSQL and the user is redirected to the course detail page
5. **Content Generation**: If slides don't exist, the application automatically generates video content for each chapter sequentially, showing progress indicators
6. **Slide and Audio Generation**: For each chapter, Azure OpenAI generates HTML slides with narration text, then Fonada API converts narration to audio files stored in Azure Blob Storage
7. **Video Rendering**: Generated slides are rendered using Remotion Player with synchronized audio, supporting both full-course and chapter-level playback
8. **Course Access**: Users can return to any previously generated course from their course library on the homepage

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| **UI Components** | Radix UI primitives (accordion, dialog, tabs, etc.), Lucide React icons |
| **Backend** | Next.js API Routes (Route Handlers) |
| **Database** | PostgreSQL (Neon) with Drizzle ORM |
| **AI Generation** | Azure OpenAI (GPT-5-mini) for course structure and slide content generation |
| **Media** | Remotion 4 for video composition and playback, Fonada API for TTS |
| **Storage** | Azure Blob Storage for audio files |
| **Authentication** | Clerk |
| **Deployment** | Vercel |
| **State Management** | React hooks (useState, useEffect) |
| **HTTP Client** | Axios |

## Architecture Overview

**Frontend Responsibilities:**

The frontend is built with Next.js App Router, utilizing server and client components strategically. Client components handle interactive features such as course generation forms, video playback controls, and course navigation. The UI is composed using Radix UI primitives for accessibility and custom styling with Tailwind CSS. Remotion Player is integrated as a React component to render course videos client-side, with frame-by-frame synchronization of HTML slide content and audio narration.

**Backend Responsibilities:**

Next.js API Routes handle all backend logic:
- `/api/course-layout`: Receives topic input, calls Azure OpenAI with a structured prompt to generate course JSON, validates response, and persists to database
- `/api/video-content`: Generates HTML slides and narration for individual chapters using Azure OpenAI, creates audio files via Fonada API, uploads audio to Azure Blob Storage, and stores slide metadata in the database
- `/api/course`: Retrieves course data and associated slides, supports both full course listing (by user) and individual course fetching (by courseId)

**AI Generation Pipeline:**

1. **Course Structure**: User input is sent to Azure OpenAI with a system prompt defining the expected JSON structure (courseName, courseDescription, level, chapters with subContent arrays). The model returns a validated course configuration.
2. **Slide Generation**: For each chapter, the chapter data is sent to Azure OpenAI with a different system prompt specifying HTML slide generation requirements, including reveal animations, Tailwind CSS styling, and narration text extraction.
3. **Narration Processing**: Generated narration text is sent to Fonada API with voice parameters, receiving audio buffers that are uploaded to Azure Blob Storage with public URLs.

**Data Persistence Model:**

The database schema consists of four main tables:
- `users`: Stores user email, name, and credits
- `courses`: Stores course metadata, user input, course layout JSON, and references to user email
- `chapters`: Stores chapter metadata and references to courseId (currently not actively used in the current implementation)
- `chapter_content_slides`: Stores individual slide data including HTML, narration JSON, reveal data array, audio file URLs, and indexing information

Relationships are maintained through foreign keys on courseId and chapterId fields, enabling efficient queries for course and slide retrieval.

## Environment Variables

**Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Database:**
- `DATABASE_URL` (Neon PostgreSQL connection string)

**AI Services:**
- `OPEN_API_ENDPOINT` (Azure OpenAI endpoint)
- `OPEN_API_KEY` (Azure OpenAI API key)
- `OPEN_API_DEPLOYMENT_NAME` (Azure OpenAI deployment name)
- `OPEN_API_VERSION` (Azure OpenAI API version)

**Media Services:**
- `FONADALAB_API_KEY` (Fonada API key for TTS)
- `AZURE_STORAGE_CONNECTION_STRING` (Azure Blob Storage connection string)
- `AZURE_STORAGE_CONTAINER` (Azure Blob Storage container name)
- `AZURE_STORAGE_PUBLIC_BASE_URL` (Public base URL for audio file access)

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/syed1israr/AzTask.git
   cd AzTask
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and add all required environment variables listed in the Environment Variables section above.

4. **Set up the database:**
   Ensure your Neon PostgreSQL database is created and the `DATABASE_URL` is configured. Run database migrations if necessary using Drizzle Kit:
   ```bash
   npx drizzle-kit push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically handle authentication flows via Clerk and connect to your configured services for AI generation and media processing.

## Version Control & Development Practices

This project follows a feature-branch workflow with multiple branches used during development:

- **Main branch**: Production-ready code deployed to Vercel
- **Feature branches**: Individual features developed in isolation (e.g., `AI-Integration`, `Course-Page`, `Rendering`, `Authentication`)
- **Integration branches**: Branches for specific integration work (e.g., `Built-initial-deployment`, `Final-Changes`)

Development emphasized modular component architecture with clear separation of concerns:
- Feature components organized in `src/Features/` directory
- Reusable UI components in `src/components/ui/`
- API routes organized by resource type
- Type definitions centralized in `src/lib/types.ts`
- Configuration and constants separated into dedicated files

This structure facilitates maintainability and enables independent development of features without conflicts.

## Limitations & Future Improvements

**Current Limitations:**

- PDF export functionality is not implemented
- Multiple-choice questions (MCQs) or quizzes are not generated
- Course editing after generation is not supported
- No progress tracking persistence across sessions (progress is client-side only)
- Audio generation happens sequentially per chapter, which can result in longer wait times for courses with multiple modules

**Potential Future Enhancements:**

- Export courses as PDF documents for offline access
- Generate interactive quizzes and assessments for each module
- Allow users to edit generated course content
- Implement server-side progress tracking with completion certificates
- Parallel audio generation for faster course creation
- Support for multiple languages in narration
- Custom voice selection for TTS
- Video export functionality for offline viewing
- Social sharing features for generated courses
- Course rating and feedback system

## License / Usage

This project is developed for educational and hackathon purposes. The codebase is available for review and learning. Please refer to individual dependency licenses for usage terms of third-party libraries and services.
