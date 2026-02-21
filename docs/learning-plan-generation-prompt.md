# AI Prompt: Generate TPM Learning Plan Content

## Context

You are generating structured learning content for a **Technical Product Manager (TPM) learning app**. The app is built with React + Supabase (PostgreSQL). The content is based on "The Technical Product Manager's Codex" — a 7-milestone curriculum covering SDLC/DevOps, SQL/Analytics, Cloud Infrastructure, System Design, APIs, Machine Learning, and Generative AI.

The app flow is: **Milestone → Lessons (read) → Lesson Quiz (after each lesson) → Milestone Test (comprehensive, end of milestone)**.

No project submissions. Focus on teaching content, practice questions, and assessments.

---

## Source Material

Below is the full codex text. Use it as the **authoritative source** for all content. Expand on concepts where the codex is brief, but do not contradict it. Preserve all technical accuracy.

<codex>

**The Technical Product Manager's Codex: A Comprehensive Learning Architecture**

**Executive Summary: The Strategic Necessity of Technical Depth**

The discipline of Product Management has undergone a radical bifurcation over the last decade. As software architectures have transitioned from monolithic, on-premise applications to distributed, cloud-native microservices, and as the value proposition of modern products has increasingly shifted toward algorithmic complexity and artificial intelligence, the "generalist" Product Manager is frequently finding themselves outmaneuvered by the complexity of their own roadmaps. This shift has given rise to the Technical Product Manager (TPM), a role that is not merely a project manager with a computer science degree, but a strategic leader capable of bridging the widening chasm between business requirements and engineering constraints.

Leading technology firms such as Google, Amazon (AWS), and Meta have formalized this distinction in their hiring rubrics. For instance, Google's requirements for Technical Product Managers explicitly demand experience in "taking technical products from conception to launch" and often require proficiency in specific technical domains like cloud infrastructure or machine learning. Similarly, Amazon's leadership principles regarding "Are Right, A Lot" and "Dive Deep" necessitate a TPM who can independently verify technical feasibility without relying solely on engineering hearsay. The baseline curriculum provided by community resources like roadmap.sh offers a strong foundation in general product thinking — covering stakeholder management, prioritization, and basic agile rituals — but it significantly under-indexes on the "Technical" branch required for these Tier-1 roles.

This curriculum is structured into seven logical "Milestones." Each milestone represents a distinct layer of the modern technology stack, moving from the operational machinery of software delivery (SDLC/DevOps) up through the data layer, infrastructure, system design, API economy, and finally arriving at the cutting edge of Machine Learning and Generative AI.

---

**Milestone 1: The Engine Room — SDLC, DevOps, and Release Engineering**

**1.1 Learning Objective**
The journey begins not with writing code, but with understanding how code is delivered. The primary objective of this milestone is to demystify the machinery of software production. An aspiring TPM must master the Software Development Life Cycle (SDLC) to understand where bottlenecks occur. The goal is to transition the learner's mental model from a "black box" view of engineering (where requirements go in and features come out) to a "glass box" view, where they can observe and optimize the flow of value through the delivery pipeline. By the end of this module, the learner will be able to articulate the operational differences between Waterfall, Agile, and DevOps methodologies, diagram a standard Continuous Integration/Continuous Deployment (CI/CD) pipeline, and apply advanced release strategies like Blue/Green deployments to mitigate business risk.

**1.2 Key Concepts and Theoretical Frameworks**

*The Evolution of SDLC Methodologies*
To understand the current state of DevOps, one must understand the history it rejected. The Waterfall model, derived from manufacturing and construction, posits a linear progression: Requirements → Design → Implementation → Verification → Maintenance. While often maligned in modern SaaS, Waterfall remains relevant in hardware TPM roles (e.g., at Apple or in Google's Pixel division) where the cost of change is physical and exorbitant. A TPM must recognize that Waterfall provides predictability at the cost of adaptability.

In contrast, Agile methodologies (Scrum, Kanban) emerged to address the "software crisis" of the 1990s, where long release cycles led to products that were obsolete upon arrival. Agile shifts the focus to iterative development, breaking work into sprints. However, for a TPM, Agile is not just about rituals like stand-ups; it is about backlog hygiene and the "Definition of Ready." The TPM ensures that technical enablers — work required to support future features — are prioritized alongside user-facing stories.

The current industry standard, DevOps, represents a cultural synthesis of Development (Dev) and Operations (Ops). Historically, these groups had opposing incentives: Developers were incentivized to ship changes (velocity), while Operations were incentivized to maintain stability (uptime). DevOps aligns these incentives through automation. A TPM operating in a DevOps environment must understand that "shipping" is not a handover but a continuous flow. The concept of Site Reliability Engineering (SRE), pioneered by Google, further refines this by treating operations as a software problem, introducing concepts like Service Level Objectives (SLOs) and Error Budgets which are critical for TPM decision-making.

*The CI/CD Pipeline as a Product*
For the Technical Product Manager, the internal developer platform is a product in itself. The Continuous Integration (CI) process involves developers merging their changes to the main branch frequently, triggering automated builds and tests. The "Integration" phase is the first line of defense against quality regression. If the build breaks, value delivery stops. A TPM must champion a culture where maintaining a "green build" is paramount.

Continuous Deployment (CD) extends this by automating the release to production. This requires immense trust in automated testing. The distinction between Continuous Delivery (where code is *ready* to ship) and Continuous Deployment (where code *automatically* ships) is a key strategic decision a TPM helps facilitate based on the organization's risk appetite. Amazon, for instance, famously deploys code every few seconds, a feat made possible only through rigorous CD pipelines.

*Release Management and Risk Mitigation*
A critical distinction for TPMs is the decoupling of Deployment (moving code to production servers) from Release (exposing features to users). This decoupling is achieved through Feature Flags (or Feature Toggles). Feature flags allow a TPM to merge a half-finished feature into production but keep it dormant, hidden behind a conditional code block (if feature_enabled). This enables Dark Launches, where code is tested in production without user awareness, and Canary Releases, where a feature is rolled out to a small subset of users (e.g., 1% or internal employees) to monitor for smoke before a full rollout.

Blue/Green Deployment is another architectural pattern for risk reduction. The engineering team maintains two identical production environments: Blue (live) and Green (idle). New code is deployed to Green. Once verified, the router switches all traffic to Green. If an issue is discovered, the TPM can authorize an instant rollback by switching the router back to Blue. This capability fundamentally changes the risk calculus of product launches, allowing for more aggressive iteration.

**1.4 Knowledge Check**
Assessment Questions:
1. Explain the difference between Deployment and Release. How does using Feature Flags allow you to decouple these two events?
2. In a CI/CD pipeline, what is the specific purpose of the "Integration" phase, and why is a "broken build" considered a critical failure in DevOps culture?
3. You are managing a release and notice error rates spiking to 5% immediately after deployment. Using Blue/Green methodology, what is your immediate next step, and how long should it take?
4. Your Engineering Lead suggests moving from a 2-week Sprint release cycle to Continuous Deployment. What "Definition of Ready" or testing infrastructure prerequisites would you insist on before approving this shift?
5. Define MTTR (Mean Time to Recovery) and MTBF (Mean Time Between Failures). Which of these metrics is improved by moving to smaller, more frequent releases, and why?

Recommended Reading:
- Atlassian Agile Coach — A foundational guide to the phases of SDLC and how they map to Jira/Agile workflows.
- Amazon Builders' Library — An insider look at how Amazon uses pipelines to deploy code safely at massive scale.
- Splunk Learn — Key metrics and strategies for managing releases without downtime.
- Google SRE Book — The "bible" of site reliability, explaining hermetic builds and rollout strategies.
- LaunchDarkly Blog — A practical guide to using Feature Flags for risk mitigation.

---

**Milestone 2: Data Fluency — SQL, Analytics, and Decision Science**

**2.1 Learning Objective**
In the modern product ecosystem, intuition is insufficient. "Data Fluency" for a TPM extends far beyond the ability to read a dashboard created by a data analyst. It requires the technical capability to retrieve, interrogate, and validate data independently. The objective of this milestone is to empower the TPM to bypass the "analyst bottleneck" by writing their own SQL queries and understanding the underlying architecture of data storage. By the end of this module, the learner will be able to distinguish between OLTP and OLAP databases, write complex SQL queries involving Joins and Window Functions, and define robust Service Level Indicators (SLIs) that map to business KPIs.

**2.2 Key Concepts and Theoretical Frameworks**

*The Relational Model and Database Anatomy*
At the core of most business applications lies the Relational Database Management System (RDBMS). A TPM must understand the relational model not just as a storage mechanism, but as a logical representation of the business. Data is organized into Tables (Entities) composed of Rows (Records) and Columns (Attributes). The power of the relational model comes from the connections between these tables, enforced through Primary Keys (unique identifiers for a row) and Foreign Keys (pointers to a primary key in another table).

Understanding Normalization — the process of organizing data to reduce redundancy — is crucial for a TPM. A highly normalized database is efficient for writing data (creating an order) but can be complex for reading data (reporting on orders), often requiring multiple tables to be joined together. This trade-off between "Write Efficiency" and "Read Efficiency" is a fundamental architectural decision. Furthermore, the TPM must distinguish between OLTP (Online Transaction Processing) databases, which power the live application and are optimized for fast, small transactions (e.g., PostgreSQL, MySQL), and OLAP (Online Analytical Processing) databases (Data Warehouses), which are optimized for heavy analysis across millions of rows (e.g., Snowflake, BigQuery, Redshift). A cardinal sin for a TPM is running a heavy analytical query on the production OLTP database, potentially causing latency for active users.

*Essential SQL for Strategic Analysis*
SQL is the lingua franca of data. For a TPM, mastery involves moving beyond simple SELECT statements to answering complex behavioral questions.
- Joins: The ability to combine data from disparate sources is the most powerful tool in a TPM's arsenal. Understanding the difference between an INNER JOIN (intersection of two sets) and a LEFT JOIN (all of the first set, plus matching records from the second) allows a TPM to find, for instance, users who signed up but never performed a key action (a classic "Null" result in a Left Join).
- Aggregations: Functions like GROUP BY, COUNT, SUM, and AVG allow the TPM to synthesize raw logs into metrics.
- Window Functions: Advanced concepts like RANK(), LEAD(), and LAG() are essential for time-series analysis, such as calculating week-over-week growth or identifying user sessions, without the need for complex self-joins.

*Data Lineage and ETL Pipelines*
Data does not magically appear in a dashboard; it travels through a pipeline. The ETL (Extract, Transform, Load) or ELT process involves moving data from operational sources, cleaning/transforming it, and loading it into a warehouse. A TPM must understand Data Lineage — the path data takes — to debug discrepancies. If the dashboard shows zero sales for today, a TPM should be able to ask, "Is the ETL job stuck?" rather than assuming sales have actually stopped. This understanding is also critical for data governance and compliance with regulations like GDPR, where knowing exactly where user data lives is a legal requirement.

**2.4 Knowledge Check**
Assessment Questions:
1. Explain the difference between INNER JOIN and LEFT JOIN. In what scenario would a Product Manager specifically need to use a LEFT JOIN when analyzing a user funnel?
2. Why should you generally avoid running complex analytical queries on a production OLTP database? What is the preferred alternative?
3. You want to find the top 3 customers by spend for each country. Which SQL concept is most appropriate: GROUP BY, HAVING, or a Window Function like RANK()?
4. You notice a discrepancy between the data in Salesforce and the data in your internal Data Warehouse. Describe the concept of "Data Lineage" and how an ETL pipeline failure might cause this.
5. Write a pseudo-SQL query to calculate "Day 1 Retention" (users who logged in exactly one day after signing up).

Recommended Reading:
- HelloPM — A concise guide focusing on the specific subset of SQL needed for product analytics.
- DataCamp — Excellent resource for practicing the syntax and logic required for data retrieval.
- PM101 — Demystifies database concepts and CRUD operations for non-engineers.
- Google SRE Book — While operational, this chapter teaches you how to measure reliability using data.
- Jess Ramos (YouTube) — Practical advice on how to structure a data project for a portfolio.

---

**Milestone 3: Cloud Infrastructure & Modern Architecture**

**3.1 Learning Objective**
The cloud is the canvas upon which modern software is painted. For a TPM, "Cloud Fluency" is not about knowing how to configure a firewall, but about understanding the Unit Economics and Architectural Patterns of the cloud. The objective of this milestone is to enable the TPM to participate in architectural discussions with Engineering Leads. The learner will understand the trade-offs between IaaS, PaaS, and SaaS, comprehend the revolution of Containerization and Serverless computing, and apply the CAP Theorem to database selection decisions.

**3.2 Key Concepts and Theoretical Frameworks**

*Service Models and the Shared Responsibility Model*
Cloud computing is fundamentally about abstraction — how much of the "stack" you want to manage versus rent.
- Infrastructure as a Service (IaaS): The digital equivalent of renting land and building your own house. You rent raw storage and compute power (e.g., AWS EC2, Google Compute Engine). You are responsible for the OS, patching, and applications. Maximum control, high overhead.
- Platform as a Service (PaaS): Renting an apartment. You bring the code; the cloud provider manages the runtime, OS, and hardware (e.g., Heroku, Google App Engine, AWS Elastic Beanstalk). Increases developer velocity but introduces vendor lock-in.
- Software as a Service (SaaS): Staying in a hotel. You use the room but own nothing. (e.g., Salesforce, Google Workspace).
- The Shared Responsibility Model is a critical security concept. In IaaS, if the OS is hacked, it's your fault. In SaaS, it's the provider's fault. Understanding where the line is drawn is vital for security compliance.

*The Container Revolution: Docker and Kubernetes*
Before containers, software often failed because of environmental differences ("It works on my machine!"). Docker solved this by packaging code along with all its dependencies into a lightweight, portable "Container." Kubernetes (K8s) automates the deployment, scaling, and management of containerized applications. For a TPM, "moving to Kubernetes" usually means a strategic shift toward Microservices — breaking a monolithic app into smaller, independent pieces.

*Serverless Computing*
Serverless (e.g., AWS Lambda, Google Cloud Functions) is the ultimate abstraction. You upload a function and it runs only when triggered. You pay only for the milliseconds the code runs. Most cost-effective for sporadic traffic but can suffer from "Cold Starts." A TPM might advocate for Serverless to reduce costs for background tasks.

*The CAP Theorem and Database Selection*
In a distributed cloud system, physics imposes constraints defined by the CAP Theorem. You can only guarantee two of three: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), Partition Tolerance (system operates despite network failures). Since Partition Tolerance is non-negotiable, a TPM must choose between CP (banking ledger — stop rather than show wrong balance) and AP (social media feed — show old post rather than error).

**3.4 Knowledge Check**
Assessment Questions:
1. Explain "Serverless" to a CFO. Why is it often cheaper for variable workloads but potentially more expensive for constant workloads?
2. What is the primary problem that "Docker" solves? How does this relate to "It works on my machine"?
3. You are building a system for a stock exchange. Would you prioritize Consistency (CP) or Availability (AP)? Why?
4. Under the "Shared Responsibility Model" using AWS EC2, who is responsible for updating OS security patches?
5. Explain Vertical Scaling vs Horizontal Scaling. Which one requires "load balancing"?

Recommended Reading:
- AWS Whitepaper — The essential dictionary for cloud terminology.
- Netflix Tech Blog (https://netflixtechblog.com/the-netflix-cosmos-platform-35c14d9351ad) — How Netflix orchestrates microservices and serverless functions at scale.
- Rohit Verma (Medium) — IaaS vs PaaS vs SaaS for PMs.
- Great Learning YouTube (https://www.youtube.com/watch?v=UH6qCty0nF4) — Visual explanation of cloud architecture.
- Google Cloud Training — Official Google guides on Core Infrastructure and Kubernetes.

---

**Milestone 4: System Design and Scalability for Product Managers**

**4.1 Learning Objective**
This milestone addresses the "Final Boss" of the TPM interview at FAANG companies. TPM System Design interviews test architectural judgment and requirements framing. The objective is to teach the learner when to use a load balancer, why it is necessary, and what trade-offs it introduces. The learner will be able to lead a "Whiteboard Session," designing a system like YouTube or Uber at a high level, identifying bottlenecks, and defining Non-Functional Requirements (NFRs).

**4.2 Key Concepts and Theoretical Frameworks**

*Functional vs. Non-Functional Requirements*
The most common failure mode in System Design is jumping straight to drawing boxes. A TPM must first constrain the problem space.
- Functional Requirements: What the system does. ("Users can upload video.")
- Non-Functional Requirements (NFRs): How the system behaves.
  - Scalability: Can we handle 100M DAU?
  - Latency: Can the feed load in under 200ms?
  - Availability: 99.9% or 99.999%?
  - Consistency: Is it okay if a "Like" takes 5 seconds to appear?

*Scalability Patterns: Scale Up vs. Scale Out*
- Vertical Scaling (Scale Up): Bigger server. Simple but has a hard physical limit.
- Horizontal Scaling (Scale Out): More servers. Requires load balancing.
- Load Balancing strategies: Round Robin, Least Connections, Sticky Sessions.

*Database Scaling: Sharding and Replication*
- Read Replicas: Copies of the database for reading. Master handles writes.
- Sharding: Splitting a database by a key (e.g., User A-M on Shard 1, N-Z on Shard 2). Introduces "Hot Partition" risk.

*Caching Strategies*
- CDN Caching: Static files near the user.
- Application Caching (Redis/Memcached): Database query results.
- Strategies: Write-Through (safe, slow), Write-Back (fast, risky), Cache Invalidation (TTL policies).

**4.4 Knowledge Check**
Assessment Questions:
1. Why is it critical to clarify NFRs before drawing architecture diagrams?
2. Explain "Database Sharding." What is a "Hot Partition" issue, and how would you mitigate it for Twitter?
3. For a YouTube "View Counter," would you use Strong Consistency or Eventual Consistency? Why?
4. What is a Load Balancer? Explain Round Robin vs Least Connections.
5. Explain "Cache Invalidation" to a non-technical stakeholder.

Recommended Reading:
- Aakash Gupta — PM design vs engineering design (strategy/trade-offs).
- Vishal Bairwa (Medium) — Step-by-step Netflix architecture design.
- System Design Handbook — Amazon TPM design interview guide.
- YouTube — Video breakdown of Spotify's architecture.
- High Scalability — The "Why" and "What" of building systems.

---

**Milestone 5: API Product Management and Platform Engineering**

**5.1 Learning Objective**
In the API Economy, the API is a product. Companies like Stripe, Twilio, and Plaid built multi-billion dollar businesses treating APIs as their primary offering. A TPM manages "Developer Experience" (DX) as their UX. The learner will master REST, GraphQL, and gRPC distinctions, understand Idempotency in financial systems, and treat Documentation as a core product feature.

**5.2 Key Concepts and Theoretical Frameworks**

*API Architectural Styles: The Triad*
1. REST: HTTP verbs (GET, POST, PUT, DELETE), resource-oriented URLs. Pros: Cacheable, scalable. Cons: Over-fetching, under-fetching.
2. GraphQL: Client asks for exactly the data it needs. Pros: Solves over/under-fetching. Cons: Server complexity, cache difficulty, security risks.
3. gRPC: High-performance, Protocol Buffers (binary). Pros: Ultra-low latency, compact. Cons: Not human-readable.
Strategy: REST for public APIs, GraphQL for complex mobile apps, gRPC for internal microservices.

*Idempotency: The Reliability Keystone*
In distributed systems, networks fail. Without idempotency, a user clicking "Pay $50" twice (due to lost response) gets charged $100. With an Idempotency-Key header, the server recognizes the duplicate and returns the original response without re-charging. Critical for Fintech TPMs.

*API Governance: Versioning and Documentation*
- URI Versioning: api.company.com/v1/resource. Clear but leads to code bloat.
- Header Versioning: Client requests a specific version in the HTTP header.
- Stripe's Approach: Rolling date-based versions (2024-02-15). Gold standard.
- OpenAPI (Swagger): API described in YAML, generates interactive documentation.

**5.4 Knowledge Check**
Assessment Questions:
1. Compare REST vs. GraphQL. When would you advocate for GraphQL despite its complexity?
2. Define "Idempotency" in the context of a payment API. Why is a payment POST without an idempotency key dangerous?
3. How do you handle a "Breaking Change" (deleting a field due to privacy law) without crashing customers' apps?
4. What is the difference between PUT and PATCH in RESTful design?
5. Explain "Webhooks" to a business stakeholder. Why are they preferred over "Polling"?

Recommended Reading:
- Stripe Engineering (https://stripe.com/blog/idempotency) — Why payment APIs must handle network failures gracefully.
- Zuplo — Treating APIs as products, including monetization and metrics.
- SmartDev (https://smartdev.com/ai-powered-apis-grpc-vs-rest-vs-graphql/) — REST vs GraphQL vs gRPC performance comparison.
- Stripe Blog — Stripe's date-based versioning system.
- Manning Books — Resource modeling mastery.

---

**Milestone 6: The Machine Learning Lifecycle for Product Managers**

**6.1 Learning Objective**
AI has transitioned from a research curiosity to a core product layer. Traditional software is Deterministic (if x then y). AI is Probabilistic (if x, 85% probability of y). A TPM must navigate this ambiguity. The learner will manage the end-to-end ML Lifecycle, from data ingestion to model monitoring, ensuring business goals are correctly translated into mathematical objectives.

**6.2 Key Concepts and Theoretical Frameworks**

*The ML Lifecycle*
1. Data Collection & Preparation: Often 80% of the effort. The TPM defines "Ground Truth" — who decides what is spam?
2. Model Engineering: Selecting the algorithm (Random Forest for tabular data, CNN for images).
3. Training & Validation: The model learns from historical data. TPM ensures representative data to avoid Bias.
4. Inference: Model makes predictions on new data.
5. Monitoring & Maintenance: Models "rot." Concept Drift occurs when relationships change over time (Pre-COVID vs Post-COVID shopping). TPM schedules retraining.

*Evaluation Metrics: Precision, Recall, and F1 Score*
- Precision: Of items labeled "Positive," how many were actually positive? High Precision for: Spam Filter (don't block legitimate email).
- Recall: Of all actual "Positive" items, how many did the model find? High Recall for: Cancer Detection (don't miss a sick person).
- F1 Score: Harmonic mean of Precision and Recall. You cannot have 100% of both — the TPM makes the trade-off.

*Infrastructure: Training vs. Inference*
- Training: Massive compute (GPUs), hours/days, offline.
- Batch Inference: Predictions overnight (weekly recommendations). Cheap.
- Real-Time Inference: Prediction on user click. Expensive.
- Edge ML: Model on user's phone (CoreML). Zero latency, high privacy, smaller model.

**6.4 Knowledge Check**
Assessment Questions:
1. Explain Precision vs Recall. In a Child Safety Content Filter, optimize for High Precision or High Recall? Why?
2. What is "Concept Drift"? Example of how a pandemic could cause a credit-scoring model to fail.
3. Explain "Batch Inference" vs "Real-time Inference." Why use Batch for "Weekly Music Recommendations"?
4. What is "Ground Truth" in supervised learning? Why is acquiring it often the most expensive part?
5. A stakeholder asks why your ML model is "wrong" 10% of the time. How do you explain probabilistic vs deterministic?

Recommended Reading:
- Clarifai — End-to-end ML journey from planning to deployment.
- Evidently AI — How models degrade over time (Drift).
- ACM Blog — Shift from feature shipping to model managing.
- GoPractice — Common ML pitfalls.
- RBC Borealis — Managing uncertainty in ML projects.

---

**Milestone 7: Generative AI, LLMs, and RAG**

**7.1 Learning Objective**
Generative AI creates new content rather than classifying existing content. A TPM in 2026 must understand the "GenAI Stack," specifically RAG vs Fine-Tuning trade-offs, Token-based pricing economics, and evaluating non-deterministic outputs.

**7.2 Key Concepts and Theoretical Frameworks**

*RAG vs. Fine-Tuning*
| Feature | Fine-Tuning | RAG |
|---|---|---|
| Mechanism | Retraining the model's weights on your dataset | Searching a database for relevant text and pasting it into the prompt |
| Knowledge | Static (cutoff date) | Dynamic (real-time) |
| Cost | High (GPU training time) | Low (Storage + Inference) |
| Hallucination | Risk of "Catastrophic Forgetting" | Reduced (Grounding) |
| TPM Verdict | Use for Style (speaking like a pirate) | Use for Knowledge ("Search my Wiki"). RAG is the industry standard. |

*The GenAI Stack*
- Embeddings: Turning text into vectors representing semantic meaning. "Dog" and "Puppy" are mathematically close.
- Vector Database: Specialized DB for storing and searching vectors (Pinecone, Milvus).
- Orchestration Frameworks (LangChain): Glue code chaining steps together.

*Prompt Engineering as Product Engineering*
- System Prompt: Defines AI persona and guardrails.
- Chain of Thought: "Think step-by-step" improves reasoning.
- Few-Shot Prompting: Providing examples in the prompt.
- TPM Role: Managing the Prompt Registry. Prompts must be version-controlled like code.

**7.4 Knowledge Check**
Assessment Questions:
1. Explain Fine-Tuning vs RAG. Which is better for a chatbot answering questions about daily changing inventory?
2. Explain Token-based pricing. What happens to cost and latency if you increase context window from 4k to 128k tokens?
3. How do you build an automated test suite for a non-deterministic LLM feature? (LLM-as-a-Judge, Golden Datasets)
4. What are "Embeddings" and how do they enable "Semantic Search" vs "Keyword Search"?
5. What is "Hallucination"? Name two techniques to reduce it in a customer-facing bot.

Recommended Reading:
- Oracle — When to build vs buy in GenAI.
- Medium — Practical RAG evaluation guide.
- DZone (https://dzone.com/articles/crafting-success-llm-strategies-for-product-manage) — LLM strategies from idea to market.
- Orq.ai — Unique lifecycle challenges of generative models.
- Mitul Shah (Medium) — Step-by-step RAG tutorial.

</codex>

---

## Output Format: 4 CSV Files

Generate exactly 4 CSV files with the columns specified below. Use double-quote escaping for any field that contains commas, newlines, or quotes. Use Markdown formatting inside `content_markdown` fields (headings, bold, bullet lists, code blocks).

---

### CSV 1: `milestones.csv`

One row per milestone. 7 rows total.

| Column | Type | Description |
|--------|------|-------------|
| `milestone_id` | integer | Sequential ID: 1–7 |
| `title` | string | Short milestone title (e.g., "The Engine Room") |
| `topic` | string | Topic subtitle (e.g., "SDLC, DevOps & Release Engineering") |
| `description` | string | 2–3 sentence overview of what the learner will gain. Written in second person ("You will learn..."). This is shown on milestone cards. |
| `icon` | string | Single emoji representing the milestone theme |
| `sort_order` | integer | Same as milestone_id (1–7) |
| `total_lessons` | integer | Number of lessons in this milestone (count from CSV 2) |

---

### CSV 2: `lessons.csv`

Each milestone should be broken into **3–5 lessons**. Each lesson is a self-contained reading section that takes 5–15 minutes. Total: ~25–30 rows.

Break each milestone's content into lessons following this pattern:
- **Lesson 1**: Learning Objective & Overview (from section X.1)
- **Lessons 2–N**: One lesson per major concept (from section X.2 sub-sections)

Do NOT include project/practical sections.

| Column | Type | Description |
|--------|------|-------------|
| `lesson_id` | integer | Global sequential ID starting from 1 |
| `milestone_id` | integer | FK to milestones.milestone_id |
| `title` | string | Lesson title (e.g., "The Evolution of SDLC Methodologies") |
| `subtitle` | string | One-line hook or summary shown below the title |
| `content_markdown` | string | **Full lesson text in Markdown.** This is ALL the text the user reads. Include: headings (##, ###), bold terms on first use, bullet lists, real-world examples, analogies. Minimum 400 words, maximum 1200 words per lesson. Write for a smart non-engineer audience. |
| `key_terms` | string | Pipe-separated list of key vocabulary introduced in this lesson (e.g., "Waterfall\|Agile\|Scrum\|Kanban\|Sprint") |
| `sort_order` | integer | Order within the milestone (1, 2, 3...) |
| `estimated_minutes` | integer | Estimated reading time (5–15) |

**Content guidelines for `content_markdown`:**
- Start with a brief contextual hook (why this matters for a TPM)
- Define every technical term in bold on first use
- Use concrete real-world examples (Google, Amazon, Netflix, Stripe, etc.)
- Include at least one analogy per lesson to anchor abstract concepts
- End with a "Key Takeaway" summary (2–3 bullet points)
- Do NOT reference "this milestone" or "this course" — write as standalone reading

---

### CSV 3: `questions.csv`

Two types of questions:
1. **`lesson_check`** — 2–3 questions after each lesson. These are quick comprehension checks. Directly test concepts from that specific lesson.
2. **`milestone_test`** — 5 questions at the end of each milestone. These are harder, scenario-based, and may combine concepts from multiple lessons. Use the Assessment Questions from the codex as the basis for milestone_test questions, but convert them from open-ended to multiple-choice with 4 options.

Total: ~100–120 rows.

| Column | Type | Description |
|--------|------|-------------|
| `question_id` | integer | Global sequential ID starting from 1 |
| `milestone_id` | integer | FK to milestones.milestone_id |
| `lesson_id` | integer or empty | FK to lessons.lesson_id for lesson_check questions. **Empty** for milestone_test questions. |
| `question_type` | string | Either `lesson_check` or `milestone_test` |
| `question` | string | The question text. For scenario questions, include a brief scenario setup. |
| `option_a` | string | Answer option A |
| `option_b` | string | Answer option B |
| `option_c` | string | Answer option C |
| `option_d` | string | Answer option D |
| `correct_option` | string | The letter of the correct answer: `A`, `B`, `C`, or `D` |
| `explanation` | string | 1–3 sentences explaining WHY the correct answer is right and why a common wrong answer is wrong. Shown after the user answers. |
| `difficulty` | string | `easy`, `medium`, or `hard`. lesson_check = easy/medium. milestone_test = medium/hard. |

**Question quality guidelines:**
- Every option must be plausible (no joke answers)
- Distractors should represent common misconceptions
- Scenario-based questions should include a brief real-world context
- Explanations should teach, not just state the answer

---

### CSV 4: `resources.csv`

Recommended reading links per milestone. Use the links from the codex "Recommended Reading" sections. Add 1–2 additional high-quality resources per milestone where appropriate.

| Column | Type | Description |
|--------|------|-------------|
| `resource_id` | integer | Global sequential ID starting from 1 |
| `milestone_id` | integer | FK to milestones.milestone_id |
| `title` | string | Resource title (e.g., "Amazon Builders' Library") |
| `url` | string | Full URL. Use placeholder `https://example.com/topic` if the original codex URL was empty/broken. |
| `description` | string | 1 sentence describing what the learner will gain from this resource |
| `source_type` | string | One of: `article`, `video`, `book`, `documentation`, `tutorial` |

---

## Quality Checklist

Before finalizing, verify:
- [ ] Every milestone has 5-7 lessons
- [ ] Every lesson has 3-5 lesson_check questions
- [ ] Every milestone has 5-7 milestone_test questions
- [ ] All question options are plausible; no trick answers
- [ ] `content_markdown` uses proper Markdown (not HTML)
- [ ] All `lesson_id` references in questions.csv match actual lesson_ids in lessons.csv
- [ ] All `milestone_id` references are consistent across all 4 CSVs
- [ ] `key_terms` in lessons.csv cover all bolded terms in content_markdown
- [ ] Resources include at least 5 per milestone
- [ ] No project/submission content is included anywhere

---

## App Schema Changes Required

The following new Supabase tables must be created to support this content:

```sql
-- New table: lessons
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  content_markdown TEXT NOT NULL,
  key_terms TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- New table: resources
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL DEFAULT 'article',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alter existing questions table
ALTER TABLE questions ADD COLUMN lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL;
ALTER TABLE questions ADD COLUMN question_type TEXT NOT NULL DEFAULT 'milestone_test';

-- Alter existing milestones table
ALTER TABLE milestones ADD COLUMN description TEXT NOT NULL DEFAULT '';
ALTER TABLE milestones ADD COLUMN total_lessons INTEGER NOT NULL DEFAULT 0;
```
