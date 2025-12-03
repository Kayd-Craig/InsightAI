# 🧪 Tests Directory

This directory contains all testing-related files for the InsightAI project, organized for easy navigation and maintenance.

## 📁 Directory Structure

```
tests/
├── unit/                    # Unit tests for components and utilities
│   ├── app/components/     # App-specific component tests
│   ├── components/ui/      # UI component tests
│   └── hooks/              # Custom hooks tests
├── e2e/                     # End-to-end tests with Playwright
│   ├── example.spec.ts     # Basic functionality tests
│   └── landing-page.spec.ts # Landing page interaction tests
├── coverage/                # Test coverage reports and files
├── reports/                 # Test execution reports
├── configs/                 # Test configuration files
│   └── playwright.config.ts # Playwright configuration
└── __mocks__/              # Global mocks (currently empty)
```

## 🎯 Running Tests

### Unit Tests (Jest)
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Generate Excel-compatible coverage report
npm run test:coverage:excel
```

### End-to-End Tests (Playwright)
```bash
# Run all e2e tests
npm run test:e2e

# Run e2e tests with visual UI
npm run test:e2e:ui

# Run e2e tests in headed mode (visible browser)
npm run test:e2e:headed

# Debug e2e tests
npm run test:e2e:debug
```

## 📊 Coverage Reports

Coverage reports are generated in `tests/coverage/`:
- **HTML Report**: `index.html` (interactive)
- **CSV Report**: `test-coverage-report.csv` (Excel-compatible)
- **JSON Reports**: `coverage-summary.json`, `coverage-final.json`
- **XML Reports**: `cobertura-coverage.xml`, `clover.xml`

## 🏗️ Adding New Tests

### Unit Tests
1. Create test files in the appropriate subdirectory under `tests/unit/`
2. Follow the naming convention: `ComponentName.test.tsx`
3. Import components using absolute paths from `src/`

**Example:**
```typescript
// tests/unit/app/components/NewComponent.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import NewComponent from '../../../../src/app/components/NewComponent';

describe('NewComponent', () => {
  it('renders without crashing', () => {
    render(<NewComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### E2E Tests
1. Add test files to `tests/e2e/`
2. Follow the naming convention: `feature.spec.ts`
3. Use Playwright test framework

**Example:**
```typescript
// tests/e2e/new-feature.spec.ts
import { test, expect } from '@playwright/test';

test('new feature works correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

## 🔧 Configuration Files

- **Jest Config**: `../../jest.config.ts` (in app root)
- **Jest Setup**: `../../jest.setup.ts` (in app root)
- **Playwright Config**: `configs/playwright.config.ts`

## 📈 Test Statistics

- **Unit Tests**: 24 test suites, 243+ tests
- **E2E Tests**: 15 tests across 3 browsers (Chromium, Firefox, WebKit)
- **Coverage**: Comprehensive coverage reporting with multiple formats
- **Frameworks**: Jest + React Testing Library + Playwright

## 🎭 Benefits of This Organization

1. **Clean Navigation**: Easy to find app code vs. test code
2. **Organized Structure**: Related test files grouped together
3. **Professional Standards**: Follows industry best practices
4. **Easy Maintenance**: All test configs and reports in dedicated locations
5. **Better Git Management**: Simple ignore patterns for test artifacts

---

*This testing structure ensures comprehensive coverage while maintaining clean project organization.*