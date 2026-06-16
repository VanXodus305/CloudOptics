import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: ".env" });

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const BYPASS_SECRET = process.env.TEST_BYPASS_SECRET || "cloudoptics-bypass-secret-12345";

// ANSI escape codes for coloring console output
const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  
  // Foreground Colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Background Colors
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
};

function header(title) {
  const width = 66;
  const line = "─".repeat(width);
  console.log(`\n${COLORS.cyan}┌${line}┐`);
  const pad = Math.floor((width - title.length) / 2);
  const leftPad = " ".repeat(pad);
  const rightPad = " ".repeat(width - title.length - pad);
  console.log(`│${leftPad}${COLORS.bold}${COLORS.white}${title}${COLORS.reset}${COLORS.cyan}${rightPad}│`);
  console.log(`└${line}┘${COLORS.reset}`);
}

function subHeader(title) {
  console.log(`\n${COLORS.bold}${COLORS.magenta}▶  ${title}${COLORS.reset}`);
}

async function makeRequest(endpoint, params = {}) {
  const url = new URL(endpoint, BASE_URL);
  Object.entries(params).forEach(([key, val]) => url.searchParams.append(key, val));

  const response = await fetch(url.toString(), {
    headers: {
      "x-bypass-auth": BYPASS_SECRET,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function runTests() {
  const start = Date.now();
  let passedCount = 0;
  let failedCount = 0;
  
  const testResults = [];

  function assert(condition, message, testGroup) {
    if (condition) {
      console.log(`  ${COLORS.green}✔${COLORS.reset} ${COLORS.gray}PASS:${COLORS.reset} ${message}`);
      passedCount++;
      testResults.push({ group: testGroup, name: message, status: "PASS" });
    } else {
      console.error(`  ${COLORS.red}✘${COLORS.reset} ${COLORS.bold}${COLORS.red}FAIL:${COLORS.reset} ${message}`);
      failedCount++;
      testResults.push({ group: testGroup, name: message, status: "FAIL" });
    }
  }

  // Visual Banner
  console.log(`\n${COLORS.bgMagenta}${COLORS.bold}${COLORS.white}  CLOUDOPTICS API ROUTE VERIFICATION SUITE  ${COLORS.reset}`);
  console.log(`${COLORS.gray}🔗 Target Server: ${COLORS.reset}${COLORS.bold}${COLORS.underline}${BASE_URL}${COLORS.reset}\n`);

  try {
    // 1. Summary API
    header("GET /api/dashboard/summary");
    
    subHeader("Standard Fetch");
    const summary = await makeRequest("/api/dashboard/summary");
    assert(typeof summary === "object", "Response must be a JSON object", "Summary API");
    assert(summary.totalSpend !== undefined, "totalSpend is defined", "Summary API");
    assert(summary.budget !== undefined, "budget limit is defined", "Summary API");
    assert(summary.remainingBudget !== undefined, "remainingBudget is calculated", "Summary API");
    assert(summary.activeAlerts !== undefined, "activeAlerts count is present", "Summary API");
    assert(summary.computeSpend !== undefined, "computeSpend cost breakdown is present", "Summary API");
    assert(summary.storageSpend !== undefined, "storageSpend cost breakdown is present", "Summary API");
    assert(summary.rdsSpend !== undefined, "rdsSpend cost breakdown is present", "Summary API");
    assert(summary.totalSavings !== undefined, "totalSavings potential is present", "Summary API");
    
    // Display summary data in grid
    console.log(`\n  ${COLORS.gray}Parsed Data Metrics:${COLORS.reset}`);
    console.log(`  ├── Spend:     ${COLORS.green}$${summary.totalSpend.toFixed(2)}${COLORS.reset}`);
    console.log(`  ├── Budget:    ${COLORS.yellow}$${summary.budget.toFixed(2)}${COLORS.reset}`);
    console.log(`  ├── Remaining: ${COLORS.blue}$${summary.remainingBudget.toFixed(2)}${COLORS.reset}`);
    console.log(`  ├── Savings:   ${COLORS.cyan}$${summary.totalSavings.toFixed(2)}${COLORS.reset}`);
    console.log(`  └── Alerts:    ${COLORS.red}${summary.activeAlerts} Active${COLORS.reset}`);

    subHeader("Environment Filter (Production)");
    const prodSummary = await makeRequest("/api/dashboard/summary", { environment: "Production" });
    assert(prodSummary.totalSpend !== undefined, "Production spend matches structure", "Summary API");
    assert(prodSummary.totalSpend <= summary.totalSpend, "Production spend is a subset of overall spend", "Summary API");
    console.log(`  └── Prod Spend: ${COLORS.green}$${prodSummary.totalSpend.toFixed(2)}${COLORS.reset}`);


    // 2. Trends API
    header("GET /api/dashboard/trends");
    
    const trends = await makeRequest("/api/dashboard/trends");
    assert(Array.isArray(trends), "Trends response must be an array", "Trends API");
    if (trends.length > 0) {
      assert(trends[0].date !== undefined, "Trend elements contain 'date' string", "Trends API");
      assert(trends[0].spend !== undefined, "Trend elements contain 'spend' numeric cost", "Trends API");
      
      console.log(`\n  ${COLORS.gray}Sample Trend Record:${COLORS.reset}`);
      console.log(`  └── Date: ${COLORS.white}${trends[0].date}${COLORS.reset} ── Spend: ${COLORS.green}$${trends[0].spend.toFixed(2)}${COLORS.reset}`);
    } else {
      console.log(`  ${COLORS.yellow}⚠ No trend records returned.${COLORS.reset}`);
    }


    // 3. Services API
    header("GET /api/dashboard/services");
    
    const services = await makeRequest("/api/dashboard/services");
    assert(Array.isArray(services), "Services response must be an array", "Services API");
    if (services.length > 0) {
      console.log(`\n  ${COLORS.gray}Aggregated Service Allocation Breakdown:${COLORS.reset}`);
      services.forEach((s) => {
        assert(s.service !== undefined, `Allocation service name '${s.service}' is present`, "Services API");
        assert(typeof s.value === "number", `Allocation value for ${s.service} is numeric`, "Services API");
        console.log(`  ├── ${s.service.padEnd(5)}: ${COLORS.green}$${s.value.toFixed(2)}${COLORS.reset}`);
      });
    }


    // 4. Alerts API
    header("GET /api/optimization/alerts");
    
    const alerts = await makeRequest("/api/optimization/alerts");
    assert(Array.isArray(alerts), "Optimization alerts response must be an array", "Alerts API");
    if (alerts.length > 0) {
      console.log(`\n  ${COLORS.gray}Detected FinOps Opportunities:${COLORS.reset}`);
      const limitAlerts = alerts.slice(0, 3);
      limitAlerts.forEach((a) => {
        assert(a.resourceId !== undefined, `Alert contains target resource: ${a.resourceId}`, "Alerts API");
        assert(a.type !== undefined, `Alert defines opportunity class: ${a.type}`, "Alerts API");
        assert(a.potentialSavings !== undefined, `Alert projects savings: $${a.potentialSavings.toFixed(2)}`, "Alerts API");
        console.log(`  ├── [${COLORS.red}${a.type}${COLORS.reset}] Resource: ${COLORS.bold}${a.resourceId}${COLORS.reset} ── Savings: ${COLORS.green}$${a.potentialSavings.toFixed(2)}/mo${COLORS.reset}`);
      });
      if (alerts.length > 3) {
        console.log(`  └── ... and ${alerts.length - 3} other active optimization recommendation(s)`);
      }
    } else {
      console.log(`  ${COLORS.green}✔ No critical cost optimization warnings found.${COLORS.reset}`);
    }


    // 5. Resources API
    header("GET /api/resources");
    
    subHeader("Standard Fetch");
    const resources = await makeRequest("/api/resources");
    assert(Array.isArray(resources), "Resources response must be an array", "Resources API");
    if (resources.length > 0) {
      const first = resources[0];
      assert(first.id !== undefined, "Resource schema contains database id", "Resources API");
      assert(first.name !== undefined, "Resource schema contains name ID", "Resources API");
      assert(first.service !== undefined, "Resource schema contains service type", "Resources API");
      assert(first.cost !== undefined, "Resource schema calculates projected monthly cost", "Resources API");
      assert(first.status !== undefined, "Resource schema contains active state status", "Resources API");
      assert(first.region !== undefined, "Resource schema contains deployment region", "Resources API");
      assert(first.environment !== undefined, "Resource schema contains environment tag", "Resources API");

      console.log(`\n  ${COLORS.gray}Sample Resource Inventory Record:${COLORS.reset}`);
      console.log(`  ├── ID:          ${COLORS.white}${first.name}${COLORS.reset}`);
      console.log(`  ├── Service:     ${COLORS.magenta}${first.service}${COLORS.reset}`);
      console.log(`  ├── Env:         ${COLORS.blue}${first.environment}${COLORS.reset}`);
      console.log(`  ├── Cost Projection: ${COLORS.green}$${first.cost.toFixed(2)}/mo${COLORS.reset}`);
      console.log(`  └── Status:      ${first.status === "Running" ? COLORS.green : COLORS.red}${first.status}${COLORS.reset}`);
    }

    subHeader("Filtered Query (Environment & Service)");
    const filtered = await makeRequest("/api/resources", { environment: "Production", service: "EC2" });
    assert(Array.isArray(filtered), "Filtered query returns list array", "Resources API");
    if (filtered.length > 0) {
      let matchCount = 0;
      filtered.forEach((r) => {
        if (r.environment === "Production" && r.service === "EC2") {
          matchCount++;
        }
      });
      assert(matchCount === filtered.length, `All ${filtered.length} filtered items match constraints`, "Resources API");
    }

    // End-of-Run Summary Report
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n${COLORS.bgGreen}${COLORS.bold}${COLORS.white}  VERIFICATION SUMMARY REPORT  ${COLORS.reset}`);
    console.log(`${COLORS.gray}⏱ Execution Time: ${COLORS.reset}${COLORS.bold}${duration}s${COLORS.reset}`);
    console.log(`${COLORS.gray}📊 Tests Evaluated: ${COLORS.reset}${COLORS.bold}${passedCount + failedCount}${COLORS.reset}`);
    console.log(`${COLORS.gray}🟩 Passed Checks:   ${COLORS.reset}${COLORS.green}${COLORS.bold}${passedCount}${COLORS.reset}`);
    console.log(`${COLORS.gray}🟥 Failed Checks:   ${COLORS.reset}${COLORS.red}${COLORS.bold}${failedCount}${COLORS.reset}\n`);

    // Beautiful Group-wise Status Table
    console.log(`${COLORS.bold}${COLORS.white}┌──────────────────────────────┬─────────────┬──────────┐${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.white}│ API Module Group             │ Checked     │ Status   │${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.white}├──────────────────────────────┼─────────────┼──────────┤${COLORS.reset}`);
    
    const groups = [...new Set(testResults.map(r => r.group))];
    groups.forEach((g) => {
      const groupTests = testResults.filter(r => r.group === g);
      const isFailed = groupTests.some(r => r.status === "FAIL");
      const statusText = isFailed ? `${COLORS.red}FAILED    ` : `${COLORS.green}SUCCESSFUL`;
      console.log(`│ ${g.padEnd(28)} │ ${String(groupTests.length).padStart(11)} │ ${statusText}${COLORS.reset} │`);
    });
    console.log(`${COLORS.bold}${COLORS.white}└──────────────────────────────┴─────────────┴──────────┘${COLORS.reset}\n`);

    if (failedCount > 0) {
      console.log(`${COLORS.bgRed}${COLORS.bold}${COLORS.white}  ❌ SYSTEM TESTS DETECTED FAILURES. VERIFICATION ABORTED.  ${COLORS.reset}\n`);
      process.exit(1);
    } else {
      console.log(`${COLORS.bgGreen}${COLORS.bold}${COLORS.white}  🎉 ALL CLOUDOPTICS API CHANNELS RESPONDING PERFECTLY. READY FOR FRONTEND.  ${COLORS.reset}\n`);
      process.exit(0);
    }
  } catch (error) {
    console.error(`\n${COLORS.bgRed}${COLORS.bold}${COLORS.white}  💥 RUNTIME EXCEPTION DETECTED:  ${COLORS.reset}`);
    console.error(`${COLORS.red}${error.stack || error.message}${COLORS.reset}\n`);
    process.exit(1);
  }
}

runTests();
