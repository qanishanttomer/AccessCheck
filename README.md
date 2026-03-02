# AccessCheck - Enterprise-Grade Accessibility Crawler

AccessCheck is a powerful, real-time accessibility auditing tool built to help teams guarantee their web applications meet strict international accessibility and legal standards.

Unlike basic, single-page SEO tools, AccessCheck features a **Deep Domain Crawler** that maps and scans an entire website, providing a unified, comprehensive accessibility scorecard.

![AccessCheck Screenshot](/public/ratl-logo.png)

## Why This Tool is Required for True Compliance

Many standard accessibility tools fail because they only parse static HTML text files. Modern web applications (built with React, Vue, Next.js, etc.) use JavaScript to render the interface dynamically. 

**If your scanner doesn't execute JavaScript, it isn't seeing what the user sees.**

AccessCheck solves this using an enterprise-grade architecture:
1. **Real Browser Rendering**: It uses **Playwright** (a headless Chromium browser) to navigate to the URL, fully execute all JavaScript, and wait for the DOM to completely build before scanning.
2. **Deep Domain Crawling**: It doesn't stop at the homepage. It extracts all internal `<a>` links and recursively crawls the domain to ensure every hidden sub-page is tested.
3. **Gold-Standard Auditing Engine**: Once the page is rendered, it injects **Axe-core**, the exact same accessibility ruleset used by Google Chrome's Lighthouse, Microsoft, and Deque Systems.

## Supported Legal & Technical Standards

This tool is explicitly configured to guarantee compliance with the following international standards and laws:

*   **WCAG 2.0 & 2.1 (Levels A and AA)**: The global technical standard for digital accessibility.
*   **ADA (Americans with Disabilities Act)**: Covered via strict adherence to WCAG 2.1 AA.
*   **AODA (Accessibility for Ontarians with Disabilities Act)**: Covered via strict adherence to WCAG 2.0 AA.
*   **Section 508 (United States)**: The US Rehabilitation Act standard for federal agencies and contractors.
*   **EN 301 549 (European Union)**: The European standard for digital accessibility.

If your application scores a 100/100 on AccessCheck, it is legally and technically compliant across North America and Europe.

## Technical Architecture

AccessCheck is built for performance and transparency:

*   **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui.
*   **Backend Scanner**: Node.js, Playwright, Axe-core, Cheerio.
*   **Data Pipeline**: NDJSON (Newline Delimited JSON) Streaming API.

### The Streaming API (NDJSON)
Because crawling 50+ pages can take several minutes, the backend does not wait for the entire scan to finish. Instead, it uses **Server-Sent Streaming**. 

As soon as a single page finishes its Axe-core scan, the API instantly streams that row of data back to the React frontend. The UI builds the report row-by-row in real-time, providing immediate feedback and a live progress indicator.

## Setup and Installation

AccessCheck runs entirely locally on your machine. **No API keys, no subscriptions, and no cloud dependencies are required.**

### Prerequisites
*   Node.js (v20+ recommended)
*   npm or pnpm

### Running Locally

1. **Install Dependencies**
   (This will install Next.js, Playwright, and download the required Chromium headless browser).
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Run a Scan**
   Open your browser and navigate to `http://localhost:3000`. Enter any URL (e.g., `https://example.com`) to begin the deep crawl.

## Features at a Glance

*   **Recursive Deep Crawling**: Automatically finds and queues internal links.
*   **Real-time NDJSON Streaming**: See results build instantly on the screen as each page is tested.
*   **Actionable Fixes**: Returns the exact CSS selector, the impact level, and plain-English instructions on how to fix the violation.
*   **Page Attribution**: Clearly labels exactly *which* sub-page a specific violation was found on.
*   **PDF Export**: Easily download the final comprehensive scorecard to share with stakeholders or attach to Jira tickets.

---
*Built with modern web technologies for teams who take accessibility seriously.*