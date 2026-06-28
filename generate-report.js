const fs = require('fs');
const path = require('path');
const reporter = require('multiple-cucumber-html-reporter');

const reportsDir = path.join(__dirname, 'reports');
const jsonReport = path.join(reportsDir, 'cucumber-report.json');
const htmlReportDir = path.join(reportsDir, 'html-report');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

if (!fs.existsSync(jsonReport)) {
  console.error('JSON report not found:', jsonReport);
  process.exit(1);
}

reporter.generate({
  jsonDir: reportsDir,
  reportPath: htmlReportDir,
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest',
    },
    device: 'Local test machine',
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'Playwright Automation Project I' },
      { label: 'Test framework', value: 'Cucumber + Playwright' },
      { label: 'Report generated', value: new Date().toISOString() },
    ],
  },
});

console.log(`HTML report generated at ${htmlReportDir}`);
