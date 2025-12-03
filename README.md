# InsightAI

**InsightAI** is an analytics and growth assistant for people wanting to grow their name, powered by AI. It connects directly with platforms like Instagram, TikTok, YouTube, and X (Twitter) to pull in-depth metrics, deliver actionable insights, and generate personalized growth strategies using a natural language AI assistant.

---

## 📦 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **AI Integration**: OpenAI GPT-4 or Gemini via API
- **Payments**: Stripe
- **APIs**: Instagram Graph API, YouTube Data API, TikTok Creator API, X API
- **Hosting**: Vercel

---

## Features

### Account Integration

- Create an account via OAuth integration
- Connect multiple social media accounts to a unified dashboard
- Seamlessly switch between integrated accounts within your InsightAI profile

### Intelligent Dashboard & Analytics

- Platform-specific dashboards for each integrated account
- Interactive interface with built-in AI assistant access
- Real-time analytics visualization from all connected platforms
- Unified view of cross-platform performance metrics

### AI-Powered Assistant

- Natural language conversations with advanced LLM agent
- Built on Model Context Protocol (MCP) architecture for sophisticated agentic capabilities
- Ask questions like:
  - "What content performed best this month?"
  - "How can I improve my engagement rate?"
  - "What posting strategy should I use?"
- Personalized, data-driven responses with visual breakdowns
- Actionable recommendations tailored to your brand growth goals
- Available directly from your dashboard for seamless interaction

### Data Security & Management

- Encrypted data transport between application layers
- Local data storage on user's machine during active sessions
- No persistent plaintext storage on external servers
- User-controlled data with privacy-focused architecture
- Secure pipelines maintaining data integrity while enabling AI insights

---

## 🧪 Development

### 🛠️ Getting Started

Follow these detailed steps to set up and run the InsightAI project locally:

#### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** - [Download from git-scm.com](https://git-scm.com/)

You can verify your installations by running:
```bash
node --version  # Should show v18.0 or higher
npm --version   # Should show version number
git --version   # Should show version number
```

#### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/austinwright10/InsightAI.git

# Navigate to the project root directory
cd InsightAI

# Navigate to the app directory (where the Next.js project lives)
cd app
```

#### Step 2: Install Dependencies

Choose one of the following package managers (npm is recommended if you're unsure):

**Using npm (recommended):**
```bash
npm install
```

**Using yarn (alternative):**
```bash
yarn install
```

This will install all required dependencies including Next.js, React, TypeScript, and other packages.

#### Step 3: Set Up Environment Variables

The project requires environment variables for various integrations. Follow these steps:

1. **Copy the example environment file:**
   ```bash
   # From the app directory, copy the example file
   cp ../.env.local.example .env.local
   ```

2. **Edit the environment file:**
   Open `.env.local` in your preferred text editor and fill in the required values:

   ```bash
   # Open with VS Code (if you have it installed)
   code .env.local
   
   # Or open with any text editor
   nano .env.local
   ```

3. **Required Environment Variables:**

   **Supabase Configuration (Required for authentication and database):**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

   **AI Integration (Required for AI assistant features):**
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   ```

   **Social Media APIs (Optional for full functionality):**
   ```env
   NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
   INSTAGRAM_APP_SECRET=your_instagram_app_secret
   ```

4. **How to Get API Keys:**

   - **Supabase**: Create a free account at [supabase.com](https://supabase.com), create a new project, and find your keys in Project Settings > API
   - **OpenAI**: Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
   - **Facebook/Instagram**: Create a developer account at [developers.facebook.com](https://developers.facebook.com)

   **Note:** For testing purposes, you can use placeholder values, but some features may not work without valid API keys.

#### Step 4: Run the Development Server

Start the development server using one of these commands:

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

You should see output similar to:
```
▲ Next.js 14.0.0
- Local: http://localhost:3000
- Ready in 2.1s
```

#### Step 5: Open the Application

1. Open your web browser
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. You should see the InsightAI landing page

#### Step 6: Verify the Setup

To ensure everything is working correctly:

1. **Check the landing page loads** - You should see the main InsightAI interface
2. **Test navigation** - Click through different sections
3. **Check the console** - Open browser developer tools (F12) and look for any error messages

#### Troubleshooting Common Issues

**Port 3000 is already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## 💳 Subscription System

InsightAI includes a complete subscription management system powered by Stripe. Users can subscribe to unlock premium features like unlimited social media integrations and advanced analytics.

### 🚀 Features

- **Two-tier pricing**: Basic ($9.99/month) and Pro ($19.99/month) plans
- **Secure payments**: Full Stripe integration for payment processing
- **Subscription management**: Cancel, reactivate, and upgrade/downgrade plans
- **Feature gating**: Automatic access control based on subscription status
- **Real-time sync**: Database automatically updates with Stripe webhooks

### 🧪 Testing the Subscription System

#### Prerequisites
- Stripe test account created at [dashboard.stripe.com](https://dashboard.stripe.com)
- Environment variables configured (see STRIPE_INTEGRATION_GUIDE.md)
- Database migration run (`001_create_subscriptions_table.sql`)

#### Test Flow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Settings**: Visit `http://localhost:3000/settings`

3. **Try accessing integrations**:
   - Click "Manage/Add" under Integrations
   - Should show payment modal (subscription required)

4. **Complete a test subscription**:
   - Select Basic or Pro plan
   - Click "Subscribe" 
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete checkout with any future expiry date and CVC

5. **Simulate webhook (Development Only)**:
   - After successful payment, you'll be redirected to settings
   - Click the blue "🔄 Simulate Webhook for Last Payment" button
   - This creates the subscription record locally (webhooks don't work on localhost)

6. **Test subscription management**:
   - Should now see subscription management interface
   - Try canceling subscription
   - Try reactivating subscription
   - Access integrations (should work now)

#### Test Cards

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0000 0000 3220`

#### Production Notes

- In production, webhooks work automatically (no simulation needed)
- Switch to live Stripe keys for real payments
- Set up webhook endpoint in Stripe dashboard

---

**Module not found errors:**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment variable issues:**
- Ensure `.env.local` is in the `app` directory (not the root)
- Check that all required variables are set
- Restart the development server after changing environment variables

**TypeScript errors:**
```bash
# Check TypeScript compilation
npm run build
```

#### Alternative Setup Methods

**Using Docker (Advanced):**
If you prefer using Docker:
```bash
# From the app directory
docker build -t insightai .
docker run -p 3000:3000 insightai
```

**Using GitHub Codespaces:**
You can also run this project in GitHub Codespaces by clicking the "Code" button on the GitHub repository and selecting "Create codespace on main".

#### Next Steps

Once you have the project running:

1. **Explore the codebase** - Check out the `src/` directory for the main application code
2. **Run tests** - See the testing section below for running the test suite
3. **Check the dashboard** - Navigate to `/dashboard` to see the analytics interface
4. **Test AI features** - Try the chat interface (requires OpenAI API key)

### 🧪 Testing

InsightAI has a comprehensive test suite covering components for the main application components. We use **Jest** and **React Testing Library** for unit and integration testing, plus **Playwright** for end-to-end testing.

#### 🏃‍♂️ Running Unit Tests

```bash
# Navigate to the app directory
cd app

# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Generate Excel-compatible coverage report
npm run test:coverage:excel

# Run specific test file
npm test -- AccountSignIn.test.tsx

# Run tests for specific directory
npm test -- --testPathPatterns="src/app/components"

# Run tests in verbose mode (detailed output)
npm test -- --verbose
```

#### 📋 What's Being Tested

Our test suite covers all major application components with comprehensive testing patterns:

**🎭 UI Components (14 test suites)**

- **Modal Components**: LoginModal, SignUpModal, OtpModal
- **Navigation**: Navbar, SocialMediaDropdown, Logo
- **Charts & Visualization**: BarChart, LineChart, GraphLottie
- **Interactive Elements**: AccountSignIn, AIBackground
- **Chat Interface**: GeminiChat with AI integration
- **Landing Page**: LandingPage with complex interactions
- **Dashboard**: Dashboard (currently commented out)

**🔧 Testing Patterns**

- **Component Rendering**: Verifies components render without crashing
- **User Interactions**: Button clicks, form submissions, input changes
- **State Management**: Component state updates and prop changes
- **API Integration**: Mocked API calls and error handling
- **Responsive Design**: Mobile/desktop layout testing
- **Accessibility**: ARIA labels, keyboard navigation
- **Error Boundaries**: Error handling and validation

**🎯 Advanced Mocking**

- **External Libraries**: Recharts, FontAwesome, Lottie, Framer Motion
- **Next.js Components**: Image, dynamic imports
- **APIs**: Supabase, Gemini AI, authentication
- **Browser APIs**: Window resize, Math.random, scrollIntoView

#### 📊 Test Coverage Summary

```
File                     | % Stmts | % Branch | % Funcs | % Lines
-------------------------|---------|----------|---------|--------
src/app/components       |  76.57% |   87.75% |  57.89% |  76.57%
All files                |  18.16% |   58.90% |  25.58% |  18.16%
```

**Component Test Count:**

- Total: **156 tests** across **14 test suites**
- Passing: **132 tests** (84.6% pass rate)
- New Components: **8 new test suites** added with **119 new tests**

#### 🎭 End-to-End Testing with Playwright

InsightAI uses **Playwright** for comprehensive end-to-end testing across multiple browsers. Our e2e tests validate the complete user journey and real browser interactions.

```bash
# Run all e2e tests
npm run test:e2e

# Run e2e tests with UI mode (visual test runner)
npm run test:e2e:ui

# Run e2e tests in headed mode (visible browser)
npm run test:e2e:headed

# Run e2e tests in debug mode
npm run test:e2e:debug

# List all available e2e tests
npx playwright test --list
```

**🌐 Browser Coverage**

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

**🎯 E2E Test Scenarios**

- **Landing Page Flow**: Complete user interaction journey
- **Email Input Validation**: Form interactions and validation
- **Navigation Testing**: Menu and link functionality
- **Responsive Design**: Multi-viewport testing
- **Framework Validation**: Basic Playwright functionality tests

**📊 E2E Test Summary**

- Total: **12 tests** (4 test scenarios × 3 browsers)
- Coverage: **Cross-browser compatibility** testing
- Reports: **HTML reports** with trace collection on failure

#### 🔨 Creating New Tests

When adding new components, follow these testing patterns:

**1. Basic Test Structure**

```typescript
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import YourComponent from './YourComponent'

// Mock external dependencies
jest.mock('external-library', () => ({
  ExternalComponent: ({ children }: any) => (
    <div data-testid='external'>{children}</div>
  ),
}))

describe('YourComponent', () => {
  it('renders without crashing', () => {
    expect(() => render(<YourComponent />)).not.toThrow()
  })

  it('displays correct content', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

**2. Testing User Interactions**

```typescript
it('handles button click', async () => {
  const mockCallback = jest.fn()
  render(<YourComponent onClick={mockCallback} />)

  const button = screen.getByRole('button')
  fireEvent.click(button)

  expect(mockCallback).toHaveBeenCalled()
})
```

**3. Testing State Changes**

```typescript
it('updates state on input change', async () => {
  render(<YourComponent />)

  const input = screen.getByPlaceholderText('Enter value')
  fireEvent.change(input, { target: { value: 'new value' } })

  expect(input).toHaveValue('new value')
})
```

**4. Mocking Complex Dependencies**

```typescript
// For chart libraries
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => (
    <div data-testid='bar-chart'>{children}</div>
  ),
  Bar: ({ dataKey }: any) => <div data-testid='bar' data-key={dataKey} />,
}))

// For API calls
jest.mock('@/lib/api', () => ({
  apiCall: jest.fn(() => Promise.resolve({ data: 'mock data' })),
}))
```

**5. Testing Async Operations**

```typescript
import { waitFor } from '@testing-library/react'

it('handles async operations', async () => {
  render(<YourComponent />)

  const button = screen.getByText('Load Data')
  fireEvent.click(button)

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

#### 🏗️ Test File Organization

- **Test files**: Organized in dedicated `tests/` directory
- **Unit tests**: `tests/unit/` with preserved src/ directory structure
- **E2E tests**: `tests/e2e/` for Playwright tests
- **Coverage reports**: `tests/coverage/` for all coverage files
- **Configuration**: Jest config in `jest.config.ts`, Playwright config in `tests/configs/`

#### 🔍 Testing Best Practices

- **Test behavior, not implementation**: Focus on what the user sees and does
- **Use descriptive test names**: `it('should update user profile when save button is clicked')`
- **Mock external dependencies**: Keep tests isolated and fast
- **Test error states**: Verify error handling and edge cases
- **Maintain test coverage**: Aim for >80% coverage on new components
- **Keep tests focused**: One assertion per test when possible

---
