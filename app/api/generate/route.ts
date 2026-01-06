import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, type, context } = body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API Key (GROQ_API_KEY) missing in .env.local" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    // Using Llama 3.3 70B (Latest supported model)
    const model = "llama-3.3-70b-versatile";

    let systemPrompt = "You are an expert AI assistant for CareerFlow.";
    let userPrompt = "";

    // 1. QUIZ GENERATION
    if (type === "quiz_gen") {
      systemPrompt = "You are a coding tutor. You strictly output valid JSON arrays.";
      userPrompt = `
        Generate 5 multiple-choice questions for: ${context.topic} (${context.difficulty}).
        Return strictly a JSON Array. No markdown, no preambles.
        Format:
        [{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}]
      `;
    }
    // 2. INTERVIEW ANALYSIS
    else if (type === "interview") {
      systemPrompt = "You are an expert technical interviewer.";
      userPrompt = `
        Role: ${context.role}. Question: ${context.question}. Answer: "${text}".
        Provide feedback. Output format (Plain text):
        RATING: [0-100]
        FEEDBACK: [Critique]
        IMPROVEMENT: [Better answer]
      `;
    }
    // 3. RESUME WRITER
    else if (type === "summary") {
      systemPrompt = "You are a professional resume writer for FAANG companies.";
      userPrompt = `Rewrite this professional summary to be elite, action-oriented, and ATS-friendly (keep it under 4 sentences): "${text}"`;
    }
    // 4. EXPERIENCE ENHANCER
    else if (type === "experience") {
      systemPrompt = "You are an expert technical recruiter.";
      userPrompt = `Rewrite this job description to be quantifiable, result-driven, and impressive. Use strong action verbs: "${text}"`;
    }
    // 5. FULL RESUME GENERATOR
    else if (type === "full_resume") {
      systemPrompt = "You are a professional resume writer. You strictly output valid JSON.";
      userPrompt = `
        Create a professional resume based on this user input: "${text}".
        Return strictly a JSON Object with this structure:
        {
          "fullName": "Name (inferred or [[Name]])",
          "role": "Target Role (inferred or [[Role]])",
          "email": "email (inferred or [[Email]])",
          "phone": "phone (inferred or [[Phone]])",
          "summary": "Professional summary (4-5 strong sentences)",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
          "experience": [
            { "role": "Job Title", "company": "Company Name", "date": "Date Range", "points": ["Detailed point 1 (2 lines)", "Detailed point 2 (2 lines)", "Detailed point 3", "Detailed point 4", "Detailed point 5"] }
          ],
          "education": [
            { "degree": "Degree (e.g. BS Computer Science)", "school": "University Name", "date": "Graduation Class", "desc": "Honors or relevant coursework (optional)" }
          ]
        }
        
        CRITICAL INSTRUCTIONS:
        1. **VERBOSITY IS KEY**: Generate **4-6 detailed, quantifiable bullet points** for each job experience. Use the STAR method (Situation, Task, Action, Result). Each point should be long enough to two lines.
        2. **FILL THE PAGE**: The goal is to create a dense, full-page professional resume. Do not be brief.
        3. **Skills**: List at least 8-12 relevant technical and soft skills.
        4. If specific details (like Dates, Company Names, or Schools) are missing in the input, DO NOT INVENT THEM. Use placeholders like "[[Date Needed]]" or "[[Company Name]]".
        5. Infer the Role from the context if not explicitly stated.
      `;
    }

    // 6. LINKEDIN BIO OPTIMIZER
    else if (type === "linkedin_bio") {
      systemPrompt = "You are a LinkedIn Top Voice and Personal Branding Expert.";
      userPrompt = `
        Rewrite this LinkedIn Headline and About section to be a "Recruiter Magnet".
        Input: "${text}"
        
        Guidelines:
        - Headline: Catchy, uses keywords, authoritative (e.g., "Helping X do Y | Ex-Google").
        - About: Story-driven, starts with a hook, showcases achievements, and ends with a call to action.
        - Tone: Professional yet approachable and confident.
        
        Return ONLY the rewritten text, formatted clearly with "HEADLINE:" and "ABOUT:" sections.
      `;
    }

    // 7. LINKEDIN POST CREATOR
    else if (type === "linkedin_post") {
      systemPrompt = "You are a Viral LinkedIn Ghostwriter.";
      userPrompt = `
        Turn this topic into a viral LinkedIn post: "${text}"
        
        Structure:
        1. **The Hook**: A one-line scroll-stopper.
        2. **The Story/Insight**: Short, punchy sentences. Add white space.
        3. **The Takeaway**: Actionable advice.
        4. **Engagement**: A question at the end.
        5. **Hashtags**: 3-5 relevant hashtags.
        
        Tone: Inspirational, authentic, and "broetry" style (short lines) for readability.
      `;
    }

    // 8. LINKEDIN CONNECTION MESSAGE
    else if (type === "linkedin_message") {
      systemPrompt = "You are a Networking Expert.";
      userPrompt = `
        Write a personalized LinkedIn connection request (max 300 chars) based on this bio/context: "${text}"
        
        Guidelines:
        - Mention a specific detail from their bio if possible.
        - State clearly why I want to connect (learning, synergy, etc.).
        - No sales pitch. Be genuine.
        - SIGN OFF: "Best, [Your Name]"
      `;
    }

    // 9. AI CAREER COACH
    else if (type === "career_coach") {
      systemPrompt = "You are a Senior Tech Mentor and Career Coach.";
      userPrompt = `
        User Query: "${text}"
        
        Role: Guide the user on their tech career.
         Capabilities:
        - Recommend Tech Stacks (e.g. valid MERN, T3, etc).
        - Analyze specific gaps if they provide resume details.
        - Suggest certifications.
        - Be encouraging but realistic.
        
        Style: Conversational, helpful, and structured. Use Markdown.
      `;
    }

    // 10. INTERVIEW FEEDBACK (Text-Based)
    else if (type === "interview_feedback") {
      systemPrompt = "You are a Senior Technical Interviewer.";
      userPrompt = `
        Evaluate this answer for a ${context?.role} position.
        
        Question: "${context?.question}"
        Candidate Answer: "${text}"
        
        Return a JSON Object:
        {
          "score": 85,
          "feedback": "1-2 sentences on what was good.",
          "improvement": "1-2 specific technical improvements or missing keywords.",
          "example": "A short snippet of how a better answer would sound."
        }
      `;
    }

    // 11. INTERVIEW QUESTION GENERATOR
    else if (type === "interview_question") {
      systemPrompt = "You are a Senior Technical Interviewer.";
      userPrompt = `
        Generate a single ${context?.difficulty} technical question for a ${context?.role} role.
        
        Topic: ${context?.topic || "General"}
        Previous Question: "${context?.previousQuestion}" (Do not repeat this).
        
        Return strictly the question string.
      `;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 1024,
    });

    let enhancedText = completion.choices[0]?.message?.content || "";

    // Cleanup Markdown (Groq sometimes adds it despite instructions)
    enhancedText = enhancedText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Safety for JSON responses
    if ((type === "quiz_gen" || type === "full_resume") && (enhancedText.includes("[") || enhancedText.includes("{"))) {
      const firstChar = type === "quiz_gen" ? "[" : "{";
      const lastChar = type === "quiz_gen" ? "]" : "}";
      const start = enhancedText.indexOf(firstChar);
      const end = enhancedText.lastIndexOf(lastChar);
      enhancedText = enhancedText.substring(start, end + 1);
    }

    return NextResponse.json({ enhancedText });

  } catch (error: any) {
    console.error("🔥 Groq AI Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}