"""
Mock CV analysis service.
Provides template-based feedback simulating AI analysis.
"""

import random

# Predefined feedback templates
STRENGTHS_POOL = [
    "Clear and concise summary section that highlights key achievements",
    "Well-organized work experience with quantifiable results",
    "Strong technical skills section with relevant technologies",
    "Consistent formatting and professional layout",
    "Good use of action verbs in job descriptions",
    "Education credentials clearly presented",
    "Contact information complete and accessible",
    "Appropriate length for experience level"
]

WEAKPOINTS_POOL = [
    "Education section lacks details about relevant coursework",
    "Some job descriptions are too brief and lack impact",
    "Missing certifications or professional development",
    "Contact information could include LinkedIn profile",
    "No metrics quantifying achievements",
    "Skills section could be more comprehensive",
    "Missing dates on some positions",
    "Could benefit from a professional summary"
]

KEYWORDS_POOL = [
    "Project Management", "Agile", "Leadership", "Cross-functional",
    "Strategic Planning", "Data Analysis", "Stakeholder Management",
    "Team Collaboration", "Problem Solving", "Communication",
    "Innovation", "Process Improvement", "Budget Management"
]

SUGGESTIONS_POOL = [
    "Add metrics to achievement statements (e.g., 'increased sales by 25%')",
    "Include a professional summary at the top highlighting 3-5 years experience",
    "Expand on leadership roles and team management experience",
    "Consider adding a projects section showcasing key accomplishments",
    "Update contact section with LinkedIn and portfolio links",
    "Add relevant certifications and training",
    "Use more action verbs to start bullet points",
    "Tailor skills section to target job requirements",
    "Include volunteer work or community involvement",
    "Ensure consistent date formatting throughout"
]


def analyze_cv(text_content, filename):
    """
    Perform mock CV analysis on extracted text.

    Args:
        text_content: Extracted text from CV
        filename: Original filename

    Returns:
        Dictionary containing analysis results with feedback categories
    """
    # Generate random overall score between 6.5 and 8.5
    overall_score = round(random.uniform(6.5, 8.5), 1)

    # Randomly select feedback items from pools
    strengths = random.sample(STRENGTHS_POOL, k=random.randint(3, 5))
    weak_points = random.sample(WEAKPOINTS_POOL, k=random.randint(3, 4))
    missing_keywords = random.sample(KEYWORDS_POOL, k=random.randint(5, 8))
    suggestions = random.sample(SUGGESTIONS_POOL, k=random.randint(4, 6))

    return {
        "overall_score": overall_score,
        "strengths": strengths,
        "weak_points": weak_points,
        "missing_keywords": missing_keywords,
        "suggestions": suggestions
    }


# Future: OpenAI Integration placeholder
# from openai import OpenAI
# import os
#
# def analyze_cv_with_openai(text_content):
#     """
#     Analyze CV using OpenAI GPT-4 (placeholder for future implementation).
#     """
#     client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
#     response = client.chat.completions.create(
#         model="gpt-4",
#         messages=[{
#             "role": "user",
#             "content": f"Analyze this CV and provide structured feedback: {text_content}"
#         }]
#     )
#     return response.choices[0].message.content
