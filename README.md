# Smart CV Checker

AI-powered CV/resume analysis web application that provides instant feedback on structure, clarity, grammar, keywords, and job relevance.

## Features

- 📄 Upload CV in PDF or DOCX format
- 🤖 AI-powered analysis and feedback
- ✅ Identifies strengths and weak points
- 🔑 Suggests missing keywords
- 💬 Provides actionable improvements
- 🌙 Dark/Light mode support
- 📥 Download analysis reports

## Tech Stack

**Frontend:**
- React 18
- TailwindCSS
- React Router
- Vite

**Backend:**
- Python Flask
- PyPDF2 / python-docx
- OpenAI SDK (placeholder for future integration)

## Project Structure

```
SmartCV/
├── frontend/          # React application
├── backend/           # Flask API
├── .gitignore
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

5. Create uploads directory:
   ```bash
   mkdir uploads
   ```

6. Run Flask server:
   ```bash
   python app.py
   ```

   Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

   Frontend will run on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Click "Get Started" to upload your CV
3. Drag and drop or browse for your PDF/DOCX file
4. Wait for analysis to complete
5. Review detailed feedback report
6. Download or copy feedback as needed

## API Endpoints

- `POST /api/analyze` - Upload and analyze CV
- `GET /api/analysis/{id}/status` - Check analysis progress
- `GET /api/analysis/{id}` - Retrieve analysis results

## Future Enhancements

- OpenAI GPT-4 integration for advanced analysis
- Multiple language support
- Job description matching
- Industry-specific feedback
- Resume templates and examples
- User accounts and history

## License

MIT
