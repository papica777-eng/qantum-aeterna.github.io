/**
 *
 *  COGNITIVE PARTNER - Advanced AI Agent with Context Understanding
 *
 *
 *  This module creates a truly cognitive autonomous partner that:
 *  - Understands context like a human developer
 *  - Remembers conversation history and preferences
 *  - Learns from interactions
 *  - Makes intelligent decisions autonomously
 *  - Works proactively, not just reactively
 *
 *  Inspired by: Advanced AI assistants with cognitive reasoning
 *
 *
 */

import * as fs from "fs";
import * as path from "path";

//
//  INTERFACES
//

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  context?: any;
}

interface ConversationMemory {
  messages: Message[];
  userPreferences: Map<string, any>;
  projectContext: Map<string, any>;
  learnings: string[];
}

interface Task {
  id: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  steps: string[];
  currentStep: number;
  result?: any;
  error?: string;
}

//
//  TF-IDF SEMANTIC SEARCH UTILITIES (Lightweight RAG)
//

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function calculateTF(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {};
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(tf), 1);
  for (const token in tf) {
    tf[token] = tf[token] / maxFreq;
  }
  return tf;
}

function calculateIDF(documents: string[][]): Record<string, number> {
  const idf: Record<string, number> = {};
  const N = documents.length;
  for (const doc of documents) {
    const uniqueTokens = new Set(doc);
    for (const token of uniqueTokens) {
      idf[token] = (idf[token] || 0) + 1;
    }
  }
  for (const token in idf) {
    idf[token] = Math.log(N / idf[token]);
  }
  return idf;
}

function getCosineSimilarity(
  queryTfIdf: Record<string, number>,
  docTfIdf: Record<string, number>,
): number {
  let dotProduct = 0;
  let queryNorm = 0;
  let docNorm = 0;

  const allTokens = new Set([
    ...Object.keys(queryTfIdf),
    ...Object.keys(docTfIdf),
  ]);

  for (const token of allTokens) {
    const qVal = queryTfIdf[token] || 0;
    const dVal = docTfIdf[token] || 0;

    dotProduct += qVal * dVal;
    queryNorm += qVal * qVal;
    docNorm += dVal * dVal;
  }

  if (queryNorm === 0 || docNorm === 0) return 0;
  return dotProduct / (Math.sqrt(queryNorm) * Math.sqrt(docNorm));
}

//
//  COGNITIVE PARTNER CLASS
//

export class CognitivePartner {
  private memory: ConversationMemory;
  private memoryFile: string;
  private ollamaUrl: string;
  private model: string;
  private activeTasks: Map<string, Task> = new Map();

  constructor(
    ollamaUrl: string = "http://localhost:11434",
    model: string = "qantum-supreme",
  ) {
    this.ollamaUrl = ollamaUrl;
    this.model = model;
    this.memoryFile = path.join(
      __dirname,
      "../",
      "data",
      "cognitive-memory.json",
    );
    this.memory = this.loadMemory();

    // Initialize with system context
    if (this.memory.messages.length === 0) {
      this.addSystemMessage(this.getSystemPrompt());
    }
  }

  /**
   * System prompt that defines the agent's personality and capabilities
   */
  private getSystemPrompt(): string {
    return `You are QAntum, an advanced autonomous coding partner with deep cognitive abilities.

CORE IDENTITY:
- You are not just a code generator - you are a thinking partner
- You understand context, remember conversations, and learn preferences
- You work proactively, anticipating needs before being asked
- You explain your reasoning and decision-making process
- You ask clarifying questions when needed

CAPABILITIES YOU HAVE ACCESS TO:
- 977 integrated modules across the entire codebase
- 52,573 vectors in Pinecone RAG for semantic search
- Full codebase analysis and understanding
- Git operations and version control
- Testing and debugging capabilities
- Documentation generation
- Architecture analysis and recommendations

YOUR APPROACH:
1. UNDERSTAND: Deeply analyze the user's request and context
2. PLAN: Break down complex tasks into clear steps
3. EXECUTE: Implement solutions using available modules
4. VERIFY: Test and validate your work
5. EXPLAIN: Communicate what you did and why

PERSONALITY:
- Professional but friendly
- Proactive and helpful
- Honest about limitations
- Detail-oriented
- Always learning and improving

REMEMBER:
- The user wants you to work like an advanced AI assistant
- Think before acting
- Use context from previous conversations
- Learn from feedback
- Be autonomous but collaborative`;
  }

  /**
   * Load conversation memory from disk
   */
  private loadMemory(): ConversationMemory {
    try {
      if (fs.existsSync(this.memoryFile)) {
        const data = fs.readFileSync(this.memoryFile, "utf-8");
        const parsed = JSON.parse(data);
        return {
          messages: parsed.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
          userPreferences: new Map(
            Object.entries(parsed.userPreferences || {}),
          ),
          projectContext: new Map(Object.entries(parsed.projectContext || {})),
          learnings: parsed.learnings || [],
        };
      }
    } catch (error) {
      console.error("Error loading memory:", error);
    }

    return {
      messages: [],
      userPreferences: new Map(),
      projectContext: new Map(),
      learnings: [],
    };
  }

  /**
   * Save conversation memory to disk
   */
  private saveMemory(): void {
    try {
      const dir = path.dirname(this.memoryFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const data = {
        messages: this.memory.messages,
        userPreferences: Object.fromEntries(this.memory.userPreferences),
        projectContext: Object.fromEntries(this.memory.projectContext),
        learnings: this.memory.learnings,
      };

      fs.writeFileSync(this.memoryFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving memory:", error);
    }
  }

  /**
   * Add a system message
   */
  private addSystemMessage(content: string): void {
    this.memory.messages.push({
      role: "system",
      content,
      timestamp: new Date(),
    });
    this.saveMemory();
  }

  /**
   * Add a user message
   */
  private addUserMessage(content: string, context?: any): void {
    this.memory.messages.push({
      role: "user",
      content,
      timestamp: new Date(),
      context,
    });
    this.saveMemory();
  }

  /**
   * Add an assistant message
   */
  private addAssistantMessage(content: string): void {
    this.memory.messages.push({
      role: "assistant",
      content,
      timestamp: new Date(),
    });
    this.saveMemory();
  }

  /**
   * Get relevant context from conversation history using lightweight RAG (TF-IDF)
   */
  private getRelevantContext(
    userMessage: string,
    maxMessages: number = 10,
    recentWindow: number = 3,
  ): Message[] {
    // If not enough messages, just return what we have
    if (this.memory.messages.length <= maxMessages) {
      return [...this.memory.messages];
    }

    // Always include the most recent messages to maintain immediate context
    const recentMessages = this.memory.messages.slice(-recentWindow);
    const olderMessages = this.memory.messages.slice(0, -recentWindow);

    // If no older messages, return recent ones
    if (olderMessages.length === 0) {
      return recentMessages;
    }

    // Prepare TF-IDF for semantic search
    const queryTokens = tokenize(userMessage);

    // If query is empty or no valid tokens, just return recent messages up to maxMessages
    if (queryTokens.length === 0) {
      return this.memory.messages.slice(-maxMessages);
    }

    // Convert all older messages to tokens
    const docTokens = olderMessages.map((m) => tokenize(m.content));

    // Calculate IDF across older messages
    const idf = calculateIDF(docTokens);

    // Calculate query TF-IDF
    const queryTf = calculateTF(queryTokens);
    const queryTfIdf: Record<string, number> = {};
    for (const token in queryTf) {
      queryTfIdf[token] = queryTf[token] * (idf[token] || 0);
    }

    // Calculate document TF-IDF and similarities
    const scoredDocs = olderMessages.map((m, index) => {
      const docTf = calculateTF(docTokens[index]);
      const docTfIdf: Record<string, number> = {};
      for (const token in docTf) {
        docTfIdf[token] = docTf[token] * (idf[token] || 0);
      }
      const score = getCosineSimilarity(queryTfIdf, docTfIdf);
      return { message: m, score };
    });

    // Sort by semantic similarity score
    scoredDocs.sort((a, b) => b.score - a.score);

    // Number of RAG messages to include
    const ragCount = Math.max(0, maxMessages - recentWindow);

    // Get top relevant older messages (filter out zero scores if we want to be strict,
    // but here we just take the top matches)
    const topRelevantMessages = scoredDocs
      .filter((d) => d.score > 0)
      .slice(0, ragCount)
      .map((d) => d.message);

    // Combine relevant messages with recent messages
    const combinedContext = [...topRelevantMessages, ...recentMessages];

    // Sort by timestamp to maintain chronological order in the prompt
    combinedContext.sort((a, b) => {
      // In case timestamps are objects/strings, use Date.getTime()
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    // Optional: Deduplicate if same message was somehow included (mostly a safeguard)
    const uniqueContext = Array.from(new Set(combinedContext));

    return uniqueContext;
  }

  /**
   * Analyze user intent and extract key information
   */
  private analyzeIntent(message: string): {
    intent: string;
    entities: string[];
    isQuestion: boolean;
    requiresAction: boolean;
  } {
    const lowerMessage = message.toLowerCase();

    // Detect intent
    let intent = "general";
    if (lowerMessage.includes("create") || lowerMessage.includes("generate")) {
      intent = "create";
    } else if (lowerMessage.includes("fix") || lowerMessage.includes("debug")) {
      intent = "debug";
    } else if (
      lowerMessage.includes("explain") ||
      lowerMessage.includes("what")
    ) {
      intent = "explain";
    } else if (
      lowerMessage.includes("refactor") ||
      lowerMessage.includes("improve")
    ) {
      intent = "refactor";
    } else if (lowerMessage.includes("test")) {
      intent = "test";
    }

    // Extract entities (simplified - in production, use NER)
    const entities: string[] = [];
    const codePatterns = /`([^`]+)`/g;
    let match;
    while ((match = codePatterns.exec(message)) !== null) {
      entities.push(match[1]);
    }

    return {
      intent,
      entities,
      isQuestion:
        message.includes("?") ||
        lowerMessage.startsWith("what") ||
        lowerMessage.startsWith("how"),
      requiresAction: intent !== "general" && intent !== "explain",
    };
  }

  /**
   * Create a task breakdown for complex requests
   */
  private createTaskPlan(userMessage: string, intent: string): Task {
    const taskId = `task-${Date.now()}`;
    const steps: string[] = [];

    // Create intelligent task breakdown based on intent
    switch (intent) {
      case "create":
        steps.push("Analyze requirements and specifications");
        steps.push("Search RAG for similar existing code");
        steps.push("Design solution architecture");
        steps.push("Generate code using Ollama Brain");
        steps.push("Add error handling and validation");
        steps.push("Generate tests");
        steps.push("Create documentation");
        break;

      case "debug":
        steps.push("Analyze error or issue");
        steps.push("Search codebase for related code");
        steps.push("Identify root cause");
        steps.push("Propose solution");
        steps.push("Implement fix");
        steps.push("Verify fix works");
        break;

      case "refactor":
        steps.push("Analyze current code");
        steps.push("Identify improvement opportunities");
        steps.push("Plan refactoring approach");
        steps.push("Implement changes incrementally");
        steps.push("Ensure tests still pass");
        steps.push("Update documentation");
        break;

      default:
        steps.push("Understand request");
        steps.push("Gather necessary context");
        steps.push("Execute task");
        steps.push("Verify result");
    }

    const task: Task = {
      id: taskId,
      description: userMessage,
      status: "pending",
      steps,
      currentStep: 0,
    };

    this.activeTasks.set(taskId, task);
    return task;
  }

  /**
   * Generate response using Ollama with full context
   */
  private async generateWithOllama(
    prompt: string,
    context: Message[],
  ): Promise<string> {
    try {
      // Build conversation context
      const messages = context.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Add current prompt
      messages.push({
        role: "user",
        content: prompt,
      });

      // Call Ollama API
      const response = await fetch(`${this.ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error("Ollama generation error:", error);
      return "I apologize, but I encountered an error connecting to my neural core. Please ensure Ollama is running.";
    }
  }

  /**
   * Main method: Process user message and generate cognitive response
   */
  async processMessage(
    userMessage: string,
    additionalContext?: any,
  ): Promise<string> {
    // Add user message to memory
    this.addUserMessage(userMessage, additionalContext);

    // Analyze intent
    const analysis = this.analyzeIntent(userMessage);
    console.log("Intent analysis:", analysis);

    // Get relevant context from history
    const context = this.getRelevantContext(userMessage);

    // For complex tasks, create a plan
    let taskPlan: Task | null = null;
    if (analysis.requiresAction && !analysis.isQuestion) {
      taskPlan = this.createTaskPlan(userMessage, analysis.intent);
      console.log("Created task plan:", taskPlan);
    }

    // Build enhanced prompt with thinking process
    let enhancedPrompt = userMessage;

    if (taskPlan) {
      enhancedPrompt = `User request: ${userMessage}

I've analyzed this request and created a plan:
${taskPlan.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Please provide a thoughtful response that:
1. Acknowledges the request
2. Explains your understanding
3. Outlines your approach
4. Asks any clarifying questions if needed
5. Begins execution if everything is clear

Remember: Think step-by-step, explain your reasoning, and be proactive.`;
    }

    // Generate response using Ollama with full context
    const response = await this.generateWithOllama(enhancedPrompt, context);

    // Add assistant response to memory
    this.addAssistantMessage(response);

    // Learn from interaction
    this.learnFromInteraction(userMessage, response, analysis);

    return response;
  }

  /**
   * Learn from interactions to improve over time
   */
  private learnFromInteraction(
    userMessage: string,
    response: string,
    analysis: any,
  ): void {
    // Extract learnings
    const learning = `Intent: ${analysis.intent}, Context: ${userMessage.substring(0, 50)}...`;

    // Avoid duplicates
    if (!this.memory.learnings.includes(learning)) {
      this.memory.learnings.push(learning);

      // Keep only last 100 learnings
      if (this.memory.learnings.length > 100) {
        this.memory.learnings = this.memory.learnings.slice(-100);
      }

      this.saveMemory();
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(limit: number = 50): Message[] {
    return this.memory.messages.slice(-limit);
  }

  /**
   * Clear conversation history (but keep learnings and preferences)
   */
  clearHistory(): void {
    this.memory.messages = [];
    this.addSystemMessage(this.getSystemPrompt());
    this.saveMemory();
  }

  /**
   * Set user preference
   */
  setPreference(key: string, value: any): void {
    this.memory.userPreferences.set(key, value);
    this.saveMemory();
  }

  /**
   * Get user preference
   */
  getPreference(key: string): any {
    return this.memory.userPreferences.get(key);
  }

  /**
   * Update project context
   */
  updateProjectContext(key: string, value: any): void {
    this.memory.projectContext.set(key, value);
    this.saveMemory();
  }

  /**
   * Get project context
   */
  getProjectContext(key: string): any {
    return this.memory.projectContext.get(key);
  }

  /**
   * Get active tasks
   */
  getActiveTasks(): Task[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Update task status
   */
  updateTaskStatus(
    taskId: string,
    status: Task["status"],
    result?: any,
    error?: string,
  ): void {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.status = status;
      if (result) task.result = result;
      if (error) task.error = error;
    }
  }
}

//
//  EXPORT
//

export default CognitivePartner;
