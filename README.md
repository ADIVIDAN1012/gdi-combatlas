# Combatlas - Indian Defense Encyclopedia

<div align="center">
  <img src="/public/favicon.png" alt="Combatlas Logo" width="100" height="100" />
  <h3>Specialized Interface for the Indian Defense Sector</h3>
  <p>Developed by Global Defense Index (GDI)</p>
</div>

---

## 📖 Overview

**Combatlas** is a modern, interactive web application designed to serve as a comprehensive encyclopedia for the Indian Armed Forces. It provides real-time data on military assets, including equipment of the Indian Army, Navy ships, and Air Force aircraft. The platform features an advanced AI chatbot, "Atlas," to assist users with queries related to Indian defense history, strategy, and capabilities.

## ✨ Key Features

-   **Dynamic Data Engine**: Automatically fetches and parses real-time data from Wikipedia, ensuring the information is always up-to-date without manual maintenance.
-   **Atlas AI Chatbot**: A specialized military-AI assistant powered by **Groq (Llama 3)**, capable of answering complex questions about Indian defense with context-aware responses.
-   **Secure Authentication**: Custom login system with **SHA-256 password hashing** and persistent session management using local storage.
-   **Interactive Dashboard**: A futuristic, sci-fi inspired UI with filtering capabilities to explore assets by branch (Army, Navy, Air Force).
-   **Responsive Design**: Built with a mobile-first approach using Tailwind CSS for a seamless experience across devices.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (v18)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Integration**: [Groq API](https://groq.com/) (Llama-3.3-70b-versatile)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository** (or extract the project folder):
    ```bash
    git clone <repository-url>
    cd combatlas
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and add your Groq API key:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:5173` to view the application.

## 🔒 Security

-   **Credential Storage**: User passwords are hashed using **SHA-256** before being stored in the browser's Local Storage.
-   **Data Privacy**: No personal data is sent to external servers other than the AI chat queries (which are processed by Groq).

## 🤝 Credits

**Architected by**: Aaditya Sadhu
**Organization**: Global Defense Index (GDI)

---
*Jai Hind* 🇮🇳
