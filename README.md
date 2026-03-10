# 🛥️ Lime Pitch - Sara Lemos Client Dashboard

A premium, fully-featured **Next.js 16** dashboard designed for specialized yacht listings management. This application provides a seamless experience for managing yacht data, subscription plans, and account preferences with a modern, responsive UI.

---

## ⚡ Key Features

- **📊 Dashboard Overview:** Real-time summary of yacht listings and account activity.
- **⚓ Listings Management:** Comprehensive interface to view, filter, and manage existing yacht listings.
- **📤 Easy Uploads:** Streamlined process for creating new yacht listings with multi-step support.
- **💳 Subscription Management:** Integrated billing and plan management for platform users.
- **⚙️ Advanced Settings:** Granular control over account preferences and profile information.
- **🔐 Secure Authentication:** Robust auth flow powered by **NextAuth.js**.
- **📱 Responsive Design:** Fully optimized for desktop, tablet, and mobile devices using **Tailwind CSS 4**.
- **🔔 Real-time Notifications:** Instant feedback and updates using **Sonner** and **Socket.io**.
- **🧪 Modern Tooling:** Built with **React 19**, **TanStack Query**, and **ShadCN UI**.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15.1.4](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **UI/Components:** [ShadCN UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)
- **Charts:** [Recharts](https://recharts.org/)
- **API Client:** [Axios](https://axios-http.com/)
- **Development Tools:** ESLint, Prettier, Husky, lint-staged

---

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (pages and layouts)
├── components/     # Reusable UI components (Dashboard, Auth, shared units)
├── contexts/       # React Context providers (Sidebar, Theme, etc.)
├── hooks/          # Custom React hooks for API and logic
├── lib/            # Utility functions and shared library configurations
├── services/       # API service layers
├── types/          # TypeScript definitions and interfaces
└── config/         # Application-wide configuration and routing
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RashedulHaqueRasel1/sara-lemos-client-dashboard.git
   cd sara-lemos-client-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   _Edit `.env.local` with your database URL, auth secrets, and API keys._

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧑‍💻 Author

**Rashedul Haque Rasel**

Built with ❤️ for excellence in yacht management interfaces.

📧 Email: [rashedulhaquerasel1@gmail.com](mailto:rashedulhaquerasel1@gmail.com)
🌐 Portfolio: [Link](https://rashedul-haque-rasel.vercel.app)
