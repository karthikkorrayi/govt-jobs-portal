import cron from "node-cron"
import { exec } from "child_process"

// Job scraping — every 6 hours (unchanged)
cron.schedule("0 */6 * * *", () => {
  exec("npm run scrape")
})

// Mock test generation — once daily at 2 AM (adjust to your actual demand;
// every 6h here would flood mock_tests with near-duplicate batches)
cron.schedule("0 2 * * *", () => {
  exec("npm run generate-test")
})