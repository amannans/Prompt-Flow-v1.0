import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Chatbot
  app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server. Please add it via Settings > Secrets.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are "FlowAI", the virtual assistant for Prompt Flow, a premier UK marketing agency.
Your goal is to answer visitor questions about our services and packages, build trust, and gently guide them to fill out our contact form or book a "Free Strategy Call" at the bottom of the page (#contact).

Prompt Flow specializes in helping UK businesses generate high-quality leads, automate sales, and scale rapidly with AI and premium digital infrastructure.

We offer these 4 packages:
1. Social Media Starter Growth (£499/month):
   - Brand Creation from Scratch
   - Social Media Presence Setup
   - Content Calendar & Scheduling
   - Branded Creatives & Graphics
   - Daily Social Media Postings
   - Community Engagement & Management
   - Analytics & Performance Reports

2. Social Media Growth Pro (£699/month):
   - Everything in Social Media Starter Growth
   - Meta Ads Campaign Management
   - AI Video Reels Production
   - Platform Growth Strategy

3. Social Media Premium Growth Pro (£1199/month):
   - Everything in Social Media Growth Pro
   - Advanced Paid Ads (Meta, Google, TikTok)
   - High-Response AI Chatbot Integration
   - 4K Video Production / Premium Reels
   - Weekly 1-on-1 Content Strategy Calls
   - Dedicated Account Creator & Copywriter

4. Social Media Enterprise Growth (£2499/month or custom, "Let's Talk"):
   - Complete Omni-channel Strategy
   - Handcrafted Brand Voice & Custom Graphics
   - Dedicated Video Production Team
   - Advanced AI Autopilot Agents & Workflow Automations
   - Multi-channel Paid Advertising Dominance

Our general services are:
- Lead Generation: Google Ads/PPC, Meta Ads mastery, high-converting landing pages, lead qualification systems.
- AI Automation: 24/7 multi-channel chatbots, automated CRM workflows, instant response systems.
- Social Media Growth: Short-form video production, content scheduling, viral growth frameworks, active community management.
- SEO Dominance: Lead-driven search ranking, local SEO, authority building.

Always be polite, enthusiastic, professional, and succinct. Do not use complex jargon. If they ask about buying or getting started, recommend selecting their package in our "Packages" section or filling out our Strategy Call form in the "#contact" section.`;

      const contents = messages.map((m: any) => ({
        role: m.role || 'user',
        parts: [{ text: m.text }]
      }));

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: result.text });
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      res.status(500).json({ error: 'Failed to generate response. Please try again later.' });
    }
  });

  // API Route for Contact Form
  app.post('/api/contact', async (req, res) => {
    const { name, email, phone, company, website, message, goal, budget, package: pkg } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    try {
      // Configure Nodemailer
      // Note: User needs to provide these env vars in the AI Studio Secrets panel
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: 'abdulmannansaqib@gmail.com',
        replyTo: email,
        subject: `New Lead from Prompt Flow: ${name} (${company || 'N/A'})`,
        text: `
          New Inquiry from Website Contact Form:
          
          Full Name: ${name}
          Email: ${email}
          Phone: ${phone || 'N/A'}
          Company: ${company || 'N/A'}
          Website: ${website || 'N/A'}
          Primary Goal: ${goal || 'N/A'}
          Monthly Budget: ${budget || 'N/A'}
          Selected Package: ${pkg || 'None'}
          
          Message:
          ${message || 'No message provided.'}
        `,
        html: `
          <h3>New Inquiry from Website Contact Form</h3>
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Website:</strong> <a href="${website}">${website || 'N/A'}</a></p>
          <p><strong>Primary Goal:</strong> ${goal}</p>
          <p><strong>Monthly Budget:</strong> ${budget}</p>
          <p><strong>Selected Package:</strong> ${pkg || 'None'}</p>
          <br/>
          <p><strong>Message:</strong></p>
          <p>${message ? message.replace(/\n/g, '<br/>') : 'No message provided.'}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email. Ensure SMTP credentials are set.' });
    }
  });

  // API Route for Stripe Checkout Session
  app.post('/api/create-checkout-session', async (req, res) => {
    const { userId, packageName, email } = req.body;

    if (!userId || !packageName) {
      return res.status(400).json({ error: 'UserId and packageName are required.' });
    }

    // Lazy initialization of Stripe to prevent crashing if keys are missing
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.warn("STRIPE_SECRET_KEY is undefined. Falling back to frontend sandbox simulation mode.");
      return res.status(400).json({ 
        error: "Stripe key not configured.", 
        fallback: true 
      });
    }

    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(stripeKey);

      // Package Price Mapper (GBP)
      const packagePrices: Record<string, number> = {
        'Social Media Starter Growth': 499,
        'Social Media Growth Pro': 699,
        'Social Media Premium Growth Pro': 1199,
        'Social Media Enterprise Growth': 2499
      };

      const priceAmount = packagePrices[packageName] || 495;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${packageName} Package Subscription`,
                description: `Prompt Flow digital marketing & automation services for ${packageName}`,
              },
              unit_amount: priceAmount * 100, // in pence
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/dashboard?payment=cancelled`,
        metadata: {
          userId,
          packageName
        }
      });

      res.status(200).json({ url: session.url });
    } catch (err: any) {
      console.error('Stripe session generation error:', err);
      res.status(500).json({ error: err.message || 'Failed to create Stripe session.' });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
