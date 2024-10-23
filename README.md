# BCB Agent Demo

BCB Agent Demo is an advanced system for identifying and remediating vulnerabilities in software infrastructure. This Next.js application demonstrates a three-phase approach to comprehensive protection and efficient problem-solving.

## Features

1. **Command Line Suggestion & Timeline**: Suggests command line and terminal fixes for identified vulnerabilities.
2. **RAG-Based Personalized Remediation**: Provides personalized remediation steps based on system information and context.
3. **Automated Agent-Based Remediation**: Demonstrates fully automated vulnerability remediation with minimal user intervention.

## Key Components

- **Interactive UI**: Built with React and various UI components for a smooth user experience.
- **PDF Parsing**: Ability to upload and parse PDF files for additional context.
- **OpenAI Integration**: Utilizes GPT-4 for generating remediation suggestions.
- **Progress Tracking**: Visual representation of remediation progress and phase completion.
- **Performance Comparison**: Compares Time to Remediate (TTR) with and without the system.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
     ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3005](http://localhost:3005) in your browser

## Usage

1. Navigate to the "Start Remediation" page.
2. Enter a bug description in the provided text area.
3. (Optional) Upload system information and/or a PDF file for additional context.
4. Click "Start Remediation" to begin the process.
5. Explore the different phases of the remediation process.
6. Provide feedback on the remediation suggestions.

## Technologies Used

- Next.js
- React
- OpenAI API
- Tailwind CSS
- Framer Motion for animations

## Note

This is a demo application and should not be used in production environments without proper security measures and thorough testing.

## License

[MIT License](LICENSE)
