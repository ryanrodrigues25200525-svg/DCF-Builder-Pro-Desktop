# DCF Builder Pro

An open-source desktop finance tool for valuing public companies.

DCF Builder Pro helps you search for a company, review its financials, adjust valuation assumptions, and build a DCF without setting up spreadsheets from scratch.

## Download

Get the latest app from the GitHub Releases page:

**[Download DCF Builder Pro](https://github.com/ryanrodrigues25200525-svg/dcf-builder-app/releases/latest)**

Choose the file for your computer:

| System | Download |
| --- | --- |
| macOS | `.dmg` |
| Windows | `.exe` |
| Linux | `.AppImage` or `.deb` |

You do not need to install Python, Node.js, npm, or any developer tools. The desktop app includes what it needs to run.

## What You Can Do

- Search public companies by ticker
- View company financial history
- Build a discounted cash flow valuation
- Change growth, margin, discount rate, and terminal value assumptions
- Run sensitivity analysis
- Reverse-engineer market expectations
- Compare companies using precedent and trading multiples
- Export valuation work

## First Open

This app is open source and currently not code-signed.

That means your computer may show a warning the first time you open it.

On macOS, right-click the app and choose **Open**. If needed, allow it in **System Settings > Privacy & Security**.

On Windows, choose **More info**, then **Run anyway**.

## Why This Exists

Most valuation tools are either locked behind expensive subscriptions or require building a model manually in Excel. DCF Builder Pro is meant to be a practical, transparent alternative for students, investors, analysts, founders, and anyone who wants to understand what a business might be worth.

## Open Source

The code is public so people can inspect it, learn from it, improve it, or adapt it for their own finance workflows.

Issues and pull requests are welcome.

## For Developers

Most users should download the app above. Developers who want to run the source locally can use:

```bash
git clone https://github.com/ryanrodrigues25200525-svg/dcf-builder-app.git
cd dcf-builder-app
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run install:all
npm run dev
```

Then open `http://localhost:3000`.

More setup notes are in [LOCAL_SETUP.md](LOCAL_SETUP.md).

