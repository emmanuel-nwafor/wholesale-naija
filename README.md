# Wholesale Naija Web Application 🇳🇬

## Overview
The Wholesale Naija Web Application is a robust e-commerce frontend built with Next.js 15, TypeScript, and Tailwind CSS. It provides a seamless and intuitive user experience for browsing products, managing categories, and handling user authentication for a wholesale marketplace.

## Features
- **Responsive Design**: Adapts beautifully to various screen sizes, from mobile devices to large desktops, ensuring accessibility for all users.
- **Dynamic Category Navigation**: Easily browse products through a horizontal, scrollable category list, with support for more categories via a mobile sidebar.
- **Product Search Functionality**: Integrated search bar for quickly finding desired products across the platform.
- **User Authentication Flows**: Dedicated pages for user login and account creation (signup), designed for secure access.
- **Modern UI/UX**: Utilizes Tailwind CSS for a clean, maintainable, and visually appealing interface.
- **Performance Optimized**: Leverages Next.js features like lazy loading and server-side rendering (SSR) capabilities for a fast user experience.

## Getting Started
To set up and run the Wholesale Naija Web Application locally, follow these steps.

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/appfur/wholesaleNaija-sellerWebsite.git
    cd wholesalenaija-webapp
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    # or using yarn
    # yarn install
    ```

### Environment Variables
This project primarily uses client-side environment variables, which can be configured within the Next.js setup. For API interactions, ensure your backend API URL is accessible or set up in a `.env.local` file if needed for client-side fetches.

No specific environment variables are explicitly defined in the provided project files for client-side configuration. However, for potential future API calls, you might typically define:

-   `NEXT_PUBLIC_API_BASE_URL`: The base URL for your backend API.
    *Example*: `NEXT_PUBLIC_API_BASE_URL=https://api.wholesalenaija.com`

### Running the Development Server
To start the development server:
```bash
npm run dev
# or using yarn
# yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. The page auto-updates as you edit files.

### Building for Production
To build the application for production:
```bash
npm run build
# or using yarn
# yarn build
```
This command compiles the application for production deployment.

### Starting the Production Server
To start the production server after building:
```bash
npm start
# or using yarn
# yarn start
```
This will serve the optimized production build.

## Technologies Used
The Wholesale Naija Web Application is built with a modern web development stack.

| Technology      | Description                                                    |
| :-------------- | :------------------------------------------------------------- |
| **Next.js 15**  | React framework for production-grade applications.             |
| **React 19**    | JavaScript library for building user interfaces.               |
| **TypeScript**  | Typed superset of JavaScript that compiles to plain JavaScript.|
| **Tailwind CSS**| Utility-first CSS framework for rapid UI development.         |
| **ESLint**      | Pluggable JavaScript linter for consistent code quality.       |
| **Prettier**    | Opinionated code formatter for consistent styling.             |
| **Lucide React**| Beautiful and customizable open-source icon library.           |
| **Recharts**    | Composable charting library built with React and D3.          |

## Author Info
Developed with passion by a dedicated developer.

*   **LinkedIn**: [Emmanuel Chinecherem](https://linkedin.com/in/yourusername)
*   **Twitter**: [@eChinecherem](https://twitter.com/yourtwitterhandle)
*   **Portfolio**: [Emmanuel](https://eco-studios-fullstack.vercel.app)

## License
This project is currently unlicensed. Please contact the author for details on usage and distribution.

---

[![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)

