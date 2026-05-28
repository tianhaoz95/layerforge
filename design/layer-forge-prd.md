# **Product Requirement Document (PRD): LayerForge (V2)**

**Document Version:** 2.0  
**Target Audience:** Core Engineering, Product, and Design Teams  
**Status:** Draft / Ready for Review

## ---

**1\. Executive Summary & Value Proposition**

LayerForge is a specialized knowledge and learning platform designed for advanced AI engineers, researchers, and systems developers. The platform shifts away from traditional, theory-heavy curricula, adopting a hardcore **"learn-by-doing" (code-first) philosophy**. Users immediately write low-level code (e.g., building transformer layers from scratch) and interact with an on-demand AI guidance system only when they make mistakes or explicitly opt in for assistance.  
This approach maximizes engineering efficiency, accelerates time-to-market for the MVP, and drives high user retention through continuous, hands-on engagement and gamification.

## ---

**2\. Core User Experience (UX) Flow & Mechanics**

The user journey prioritizes developer autonomy and friction-free interaction, mapping out as follows:

1. **Authentication & Dashboard:** The user signs in via Google Auth and lands on a minimal dashboard displaying available modules (e.g., "Transformer Layers", "Attention Mechanisms", "Agentic Frameworks").  
2. **Challenge Arena:** Upon selecting a challenge, the user is presented with a technical problem description and an in-browser code editor configured for either Python or Rust.  
3. **Code Submission & Evaluation:** The user writes their implementation and hits "Submit". The code is run against fixed dummy inputs in an isolated runtime sandbox.  
4. **Progressive Error Disclosure:**  
   * If the submission fails or contains bugs, the system does *not* automatically invoke the AI. Instead, it displays a standard compiler/test error alongside a subtle hint trigger: "AI can help you with this \[Get Hint\]".  
   * The AI feature only kicks in when the user explicitly clicks the hint button. This opt-in structure empowers the user and acts as a financial safeguard to control token budget.

## ---

**3\. Technical & System Architecture**

To support rapid deployment and scalable, cost-effective execution, LayerForge utilizes a serverless, decoupled architecture built entirely on top of the Firebase ecosystem and containerized sandboxes.

| Component | Technology Stack | Architectural Responsibility   |
| :---- | :---- | :---- |
| **Authentication** | Firebase Authentication | Handles secure Google Sign-In and session provisioning. |
| **Database** | Cloud Firestore (NoSQL) | Manages immutable user progress states, module sessions, logs, and user profile data. |
| **Orchestration Layer** | Firebase Cloud Functions | Acts as the serverless backend API to trigger code execution and safely manage Gemini API keys. |
| **Execution Sandbox** | Serverless Containers (AWS Fargate / Google Cloud Run) | Provides isolated environments pre-configured with Python interpreters and Rust compilers to execute submissions against dummy inputs. |
| **AI Inference Core** | Gemini Flash / Flashlight | Consumes JSON compilation/runtime error outputs along with specific system prompts to generate step-by-step contextual hints. |

### **Data Flow Sequencing:**

When a user requests AI assistance, the data propagates through the following pipeline:  
`[User Frontend] ──(Click Hint)──> [Firebase Cloud Functions]`  
                                         `│`  
                                   `(Executes Code)`  
                                         `▼`  
                             `[Isolated Docker Sandbox]`  
                                         `│`  
                             `(Returns JSON Output/Errors)`  
                                         `▼`  
 `[User Frontend] <──(Markdown UI)── [Gemini Flash API]`

## ---

**4\. Pricing, Token Budget, and Financial Strategy**

To accommodate the heavy computational overhead of code execution and large language model inference while maintaining business viability, the pricing structure is strictly tiered:

* **Individual / B2C Free Tier:** Users get access to the platform with a strict, fixed cap on AI credits per month. Once individual credits are exhausted, the user cannot purchase overages, keeping the system logic highly straightforward and preventing unexpected B2C billing complications.  
* **Enterprise / Internal Training Tier:** Charged at an enterprise SaaS per-seat license rate. B2B accounts include a baseline credit tier accompanied by a dedicated **"overage headroom"** option, allowing teams to seamlessly purchase additional tokens as their usage scales.  
* **Infrastructure Cost Safeguard:** Running small transformer layers with dummy inputs inside serverless environments (like Cloud Run) takes 1–2 seconds, costing pennies per execution. Capping average consumer requests at 50–100 compute cycles per month maintains infrastructure costs at mere cents per user.

## ---

**5\. Go-To-Market (GTM) & Marketing Themes**

Marketing campaigns and launch themes will explicitly align with the platform's core identity of technical acceleration and engineering mastery:

* **Primary Advertising Narrative:** Highlight how traditional courses waste valuable developer time on surface-level slide decks. Focus on maximizing learning efficiency.  
* **Core Slogans:**  
  * *"Bridge the AI experience gap."*  
  * *"Master modern AI architectures at your own pace."*  
* **Target Focus:** Target enterprise upskilling programs looking to quickly turn traditional software engineers into functional AI architects, alongside indie researchers seeking hardcore implementation practice.