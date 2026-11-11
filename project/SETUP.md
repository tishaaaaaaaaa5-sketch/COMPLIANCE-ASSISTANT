> **Prototype notice:** This application generates preliminary AI-assisted observations. It does not certify compliance or replace an independent audit. Verify every finding and framework mapping. Model/API pricing and free-tier limits can change; check the provider's current terms rather than relying on fixed quotas or zero-cost claims.

# 🚀 Compliance Assistant - Setup Guide

## ⚠️ IMPORTANT: API Key Configuration

This project now uses **Google Gemini** for AI-powered compliance analysis. You need to add your Gemini API key!

## 📋 Prerequisites

- Node.js 18+ installed
- Google AI Studio account with API access
- (Optional) GitHub Personal Access Token for higher rate limits

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd project
npm install
```

This will install:
- `@google/generative-ai` - Google Gemini SDK
- `dotenv` - Environment variable management
- `express` - Web server
- `axios` - HTTP client
- `pdfkit` - PDF generation
- Other dependencies

### 2. Configure Environment Variables

The `.env` file needs your Gemini API key:

1. Open `project/.env`
2. Find the line: `GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual Gemini API key

**How to get your Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key
6. Paste it into your `.env` file

### 3. (Optional) Add GitHub Token

To increase GitHub API rate limits from 60 to 5000 requests/hour:

1. Go to https://github.com/settings/tokens
2. Generate a new token (classic)
3. Select scope: `public_repo` (read access to public repositories)
4. Copy the token
5. Add to `.env`: `GITHUB_TOKEN=your_token_here`

### 4. Start the Server

```bash
npm start
```

The server will start on http://localhost:5000

You should see:
```
Compliance Assistant listening on port 5000
```

If credentials are missing, you'll see a warning:
```
⚠️  WARNING: WATSONX_API_KEY or WATSONX_PROJECT_ID not set!
```

## 💰 Google Gemini Pricing & Usage



**Free Tier Limits:**
- **Gemini Pro**: 60 requests per minute



**Paid Tier (if needed):**
- Very competitive pricing
- Pay-as-you-go model
- Monitor usage at https://aistudio.google.com/

**Benefits:**


- ✅ High-quality AI responses
- ✅ Fast response times

##  Security Best Practices

### ✅ DO:
- Keep `.env` file secure and never commit it
- Use `.env.example` as a template for others
- Rotate API keys regularly
- Set usage limits in OpenAI dashboard
- Use environment-specific `.env` files (`.env.development`, `.env.production`)

### ❌ DON'T:
- Never commit `.env` to version control (already in `.gitignore`)
- Never share API keys in chat, email, or screenshots
- Never hardcode credentials in source code
- Never expose `.env` file publicly

## 🧪 Testing the Setup

1. Open http://localhost:5000 in your browser
2. Try a sample question: "Is our payment processing PCI-DSS compliant?"
3. If configured correctly, you'll get an AI-powered response from Google Gemini
4. If not configured, you'll see: "This Compliance Assistant is not configured yet..."

## 📁 File Structure

```
project/
├── .env                 # Your credentials (NEVER COMMIT!)
├── .env.example         # Template for credentials
├── server.js            # Express server with dotenv
├── package.json         # Dependencies including dotenv
├── public/
│   └── index.html       # Enhanced frontend
├── lib/
│   ├── compliance.js    # AI logic
│   └── report.js        # PDF generation
└── sample-repo/         # Sample code for testing
```

## 🐛 Troubleshooting

### "This Compliance Assistant is not configured yet"
- Check that `.env` file exists in `project/` directory
- Verify `GEMINI_API_KEY` is set correctly
- Restart the server after changing `.env`

### "Invalid API key" or "API key not valid"
- Verify your Gemini API key is correct
- Check if the key has been revoked
- Ensure the API key is enabled in Google AI Studio
- Visit https://aistudio.google.com/app/apikey to verify

### "Rate limit exceeded" or "Quota exceeded"
- You've exceeded the free tier limits (60 requests/minute)
- Wait a minute and try again
- Consider upgrading to paid tier if needed
- Check usage at https://aistudio.google.com/

### "Model not found" or "Permission denied"
- Ensure Gemini API is enabled for your project
- Check that your API key has proper permissions
- Try regenerating your API key

### GitHub rate limit errors
- Add a `GITHUB_TOKEN` to `.env`
- Wait an hour for rate limit to reset
- Use the bundled sample files instead

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add your OpenAI API key to `.env`
3. ✅ Start the server: `npm start`
4. ✅ Test the application
5. ✅ (Optional) Add GitHub token for higher limits
6. ✅ Monitor your OpenAI usage and costs

## 🔧 Advanced Configuration

### Changing the AI Model

Edit `project/lib/compliance.js` and modify the `callGemini` function:

```javascript
// For Gemini Pro (default - balanced performance)
model: 'gemini-pro',

// For Gemini Pro Vision (if you need image analysis)
model: 'gemini-pro-vision',
```

### Adjusting Generation Settings

You can customize the generation config in `callGemini`:

```javascript
const generationConfig = {
  temperature: 0.7,  // Creativity (0.0-1.0)
  topK: 40,          // Token selection diversity
  topP: 0.95,        // Cumulative probability
  maxOutputTokens: 2048,  // Response length
};

const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  generationConfig,
});
```

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify your Gemini API key is set correctly
3. Ensure you have network access to Google AI services
4. Check Google Cloud status at https://status.cloud.google.com/
5. Review your API usage at https://aistudio.google.com/
6. Visit Google AI documentation at https://ai.google.dev/docs

## 🎉 You're Ready!

Once configured, your Compliance Assistant will:
- ✅ Audit code for PCI-DSS, GDPR, HIPAA, SOC 2, ISO 27001 compliance
- ✅ Scan GitHub repositories
- ✅ Assess legacy systems for modernization
- ✅ Generate professional PDF audit reports
- ✅ Provide AI-powered compliance recommendations using Google Gemini

**Powered by Google Gemini Pro** for intelligent, context-aware compliance analysis! 🚀

### Why Gemini?

- ⚡ **Fast responses** - Quick analysis and recommendations
- 🎯 **High quality** - Advanced AI capabilities