# SpendWise – Personal Budget Tracker

## Project Description
SpendWise is a responsive personal budgeting website. It helps users set a monthly budget, record everyday expenses, filter transactions by category and monitor how much money remains. Expense and budget data are saved in the browser using localStorage.

## Technologies Used
- HTML5 for the page structure and accessible forms
- CSS3 for the responsive layout, dashboard and visual design
- JavaScript (ES6) for calculations, validation, event handling and DOM updates
- Browser localStorage for saving data on the current device
- GitHub for source control and Netlify for static website hosting

## GitHub Repository Information
- Repository: https://github.com/Barach2001/week7_web_development
- Default branch: main
- Visibility: Public

## Live Netlify Website URL
**Deployment pending.** After importing this repository into your Netlify account, choose the `main` branch, set the publish directory to `.` (leave the build command empty), and assign a site name such as `spendwise-barach`. Add the resulting Netlify URL here:

`https://YOUR-NETLIFY-SITE-NAME.netlify.app`

Do not submit the placeholder as a live website URL.

## Project Files
- `index.html` – dashboard, budget summary, expense form and transaction table
- `style.css` – navy, teal and white visual identity plus responsive styling
- `script.js` – expense creation, deletion, filtering, budget calculations and localStorage
- `netlify.toml` – Netlify publish configuration and basic response headers

## Deployment Process Summary
1. Keep the complete project in this public GitHub repository.
2. Sign in to Netlify and choose **Add new project → Import an existing project**.
3. Connect GitHub and authorize access to `Barach2001/week7_web_development`.
4. Select the `main` branch. Leave the build command blank and set the publish directory to `.`.
5. Deploy the site, then open **Site configuration → Change site name** and choose an available name such as `spendwise-barach`.
6. Copy the generated `.netlify.app` address into the Live Netlify Website URL section above.
7. To test continuous deployment, make a visible change, commit and push it to `main`, then check the Netlify Deploys page for a new successful production deploy.
8. Open the live URL and test the form, filters, budget update, deletion, refresh persistence and mobile layout.

## Continuous Deployment Test
The repository is connected to GitHub-ready source code. Complete this test after Netlify has been connected: make a visible change to the page, push it to `main`, and verify that Netlify automatically publishes the new commit. Record the commit and deploy result here once verified.

## Challenges Encountered During Deployment
The Netlify project must be connected and published from the account owner's Netlify dashboard. The live URL and successful automatic-deployment result cannot be confirmed until that account connection and deployment are completed.

## Lessons Learned
- A static website can be published directly from a GitHub repository.
- Netlify can rebuild a site automatically when new commits are pushed to its connected branch.
- Correct file paths and a clear publish directory are important for deployment.
- Testing the published version helps catch missing assets and layout issues.
- Browser localStorage keeps this demo's data on the same browser and device; it is not a cloud database or account sync.

## Local Testing
Open `index.html` in a modern browser, or run a local static server from the project directory. Add expenses, change the budget, filter categories, delete a transaction and refresh the page to check that saved data remains available.

## Notes
SpendWise is an educational front-end project. It does not connect to a bank, process payments or send personal financial data to a server.