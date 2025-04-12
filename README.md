# VaultVeritus 🔐

**VaultVeritus** is an open-source password strength analyzer designed to help users evaluate and improve their passwords. It provides real-time feedback on password strength, highlighting areas for enhancement to ensure robust security practices.

## 🔍 Features

- **Real-Time Analysis:** Instantly evaluates password strength as users type.
- **Comprehensive Criteria Checks:**
  - Minimum and maximum length requirements.
  - Inclusion of uppercase and lowercase letters.
  - Presence of numbers and special characters.
  - Detection of common or easily guessable passwords.
- **User-Friendly Interface:** Clean and intuitive design for seamless user experience.
- **Responsive Design:** Optimized for various devices and screen sizes.

## 🛠️ Technologies Used

- **Frontend:**
  - [Vite](https://vitejs.dev/) – Fast and lightweight build tool.
  - [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework.
  - [TypeScript](https://www.typescriptlang.org/) – Typed superset of JavaScript.
- **Package Management:**
  - [Bun](https://bun.sh/) – Modern JavaScript runtime and package manager.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Bun](https://bun.sh/docs/installation) (or alternatively, [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/))

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/XaXtric7/VaultVeritus.git
   cd VaultVeritus
   ```

2. **Install Dependencies:**

   Using Bun:

   ```bash
   bun install
   ```

   Or using npm:

   ```bash
   npm install
   ```

3. **Start the Development Server:**

   Using Bun:

   ```bash
   bun dev
   ```

   Or using npm:

   ```bash
   npm run dev
   ```

4. **Access the Application:**

   Open your browser and navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
VaultVeritus/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── styles/         # Tailwind CSS configurations
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # Project metadata and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🧪 Testing

_Note: Testing scripts and configurations are currently under development._

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙌 Acknowledgements

- Inspired by the need for stronger password practices.
- Built with modern web development tools and best practices.
