# Security Audit Dashboard

An interactive, client-side application built with **Next.js 16** and **React 19** to help developers conduct security audits of their web applications. The checklist is primarily based on the **OWASP Top 10** guidelines, providing actionable fixes and best practices for common security vulnerabilities.

This project is built to be open, accessible, and easily extensible for the community!

## 🚀 Features

- **Interactive Checklist**: Track your security audit progress globally and by category.
- **OWASP Top 10 Mapping**: Security checks are categorized and linked directly to OWASP Top 10 vulnerability categories.
- **Local State Persistence**: Your audit progress is automatically saved to your browser's `localStorage`, so you can close the tab and resume later.
- **Rich Filtering & Search**: Filter checks by severity (Critical, High, Medium), category, or use the search bar to find specific vulnerabilities.
- **Responsive Layout**: Designed to work seamlessly on both desktop and mobile devices.
- **Dark Mode Support**: Built-in toggle for light and dark themes, persisting to your system preference or local storage.
- **Code Snippets & Reference Material**: Each security check comes with detailed explanations, safe code examples, and links to external resources for learning.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting & Formatting**: ESLint & Prettier

## 📂 Project Structure

```text
.
├── app/                  # Next.js App Router (pages and global layouts)
├── components/           # Reusable UI components (Dashboard, Sidebar, Filters, etc.)
├── data/                 # The core security checklist data (checks.ts)
├── hooks/                # Custom React hooks (useAuditState.ts for logic & persistence)
├── types/                # TypeScript interfaces and type definitions
├── eslint.config.mjs     # ESLint configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Project dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

Ensure you have **Node.js** (v20 or newer recommended) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/security-audit-nextjs.git
   cd security-audit-nextjs
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🐳 Docker Deployment

You can easily deploy this application using Docker. A `Dockerfile` is included in the root of the project.

### Build the Docker Image

```bash
docker build -t security-audit-dashboard .
```

### Run the Docker Container

```bash
docker run -p 3000:3000 security-audit-dashboard
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📝 How to Use the Dashboard

1. **Review Checks**: Browse through the different security categories listed in the sidebar.
2. **Read Details**: For every check, review the details and recommended code fix to ensure your actual codebase meets the requirements.
3. **Mark as Passed**: Check the box for tests that your application complies with. The progress bar/gauge will automatically update.
4. **Filter & Search**: Use the top filter bar if you want to focus heavily on "Critical" vulnerabilities, or if you want to hide the checks you've already passed.
5. **Resume Anytime**: Close the application when you're done; your progress uses local storage and will be waiting right where you left it.

## 🤝 Customizing the Audit List

If you would like to edit or add strict checks tailored to your organization, you can modify the data directly:

- Open `data/checks.ts`.
- Add, update, or remove check objects following the `Check` interface definition. Categories, tags, and stats will automatically adjust to the updated data constraints!

## 💡 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
