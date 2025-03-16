# Tech Stack for IDA

## Overview

**IDA** is built using modern technologies to ensure a smooth, efficient, and scalable solution for users to search for medicines and locate nearby pharmacies. Below is the detailed **Tech Stack** we used for developing the application.

## Frontend

### 1. **Next.js**
- **Version**: Latest stable release
- **Role**: Next.js is used to build the frontend of the application. We chose Next.js due to its excellent server-side rendering (SSR) capabilities, API routes, and seamless integration with React.
- **Why Next.js**:
  - Built-in SSR for fast initial page loads.
  - API routes to handle backend interactions seamlessly.
  - React-based component system for reusability and maintainability.

### 2. **React**
- **Version**: Latest stable release
- **Role**: React powers the components and user interfaces of the application. It enables building interactive and dynamic UI elements, such as the **Medicine Search** and **Pharmacy Locator** components.
- **Why React**:
  - Component-based structure for modular and reusable code.
  - Declarative UI, ensuring the app is easy to manage and scale.
  - Rich ecosystem and community support.

### 3. **Tailwind CSS**
- **Version**: Latest stable release
- **Role**: Tailwind CSS is used for styling the application. It provides a utility-first CSS framework for creating custom designs quickly.
- **Why Tailwind CSS**:
  - Highly customizable and flexible for building modern UI designs.
  - Enables rapid development with pre-defined utility classes.
  - Easily adaptable to our app's design needs.


## Backend

### 1. **Agent.AI**
- **Role**: **Agent.AI** provides the intelligence behind the **Medicine Search** and **Pharmacy Locator** features. It powers the query and decision-making process for both medicine search and pharmacy location search using its advanced AI algorithms.
- **Why Agent.AI**:
  - Robust AI-powered responses for natural language understanding and processing.
  - Real-time search capabilities for medicines and pharmacies.
  - Provides an easy-to-use webhook integration to send and receive data.

### 2. **Next.js API Routes**
- **Role**: We use **Next.js API routes** to serve as a lightweight backend to handle the communication with **Agent.AI**. The API routes handle the POST requests from the frontend and relay the requests to **Agent.AI**.
- **Why Next.js API Routes**:
  - Simple and fast to set up in a **Next.js** application.
  - Easy to manage server-side logic directly within the application.
  - Supports asynchronous operations with Promises/async-await for handling API requests.

### 3. **Node.js**
- **Role**: Node.js powers the runtime environment for the backend of the Next.js app, making the entire platform highly scalable and responsive.
- **Why Node.js**:
  - Fast and efficient with its non-blocking event-driven architecture.
  - Perfect fit for building lightweight and high-performance web applications.

## Database

- **Supabase** : for user authentication and user history storage
## Deployment

### 1. **Vercel**
- **Role**: Vercel is used to deploy our Next.js application. It's the platform that powers **Next.js** and offers seamless deployment with automatic scalability.
- **Why Vercel**:
  - Extremely fast and easy deployment process for Next.js applications.
  - Automatic server-side rendering (SSR) and static site generation (SSG) with minimal configuration.
  - Built-in support for API routes and edge functions.

### 2. **GitHub**
- **Role**: GitHub is used for version control, enabling our team to collaborate and track changes to the codebase.
- **Why GitHub**:
  - Centralized version control system for easy collaboration.
  - Supports pull requests and branching, ensuring smooth teamwork and feature development.

## CI/CD

### 1. **GitHub Actions**
- **Role**: Used for continuous integration and continuous deployment (CI/CD) pipelines. It automates testing, building, and deployment of the application whenever a change is pushed to the repository.
- **Why GitHub Actions**:
  - Seamless integration with GitHub repositories.
  - Easy-to-set-up workflows for deploying Next.js applications.

## Security & Authentication

- **Environment Variables (via .env.local)**
  - We store sensitive data such as API keys, Agent ID, and webhook URLs in **environment variables**. This keeps our credentials safe and avoids hardcoding them into the source code.

- **HTTPS**
  - All API requests and frontend communication are routed through HTTPS for secure, encrypted connections.

## Future Enhancements

We are planning the following enhancements in the future:

- Integration with a **database** to store user history, preferences, and other data.
- Expansion of the **Pharmacy Locator** to include additional features such as real-time stock checking and pharmacy reviews.
- Integrating **user authentication** to allow personalized experiences for users, saving search history and preferences.

---

## Conclusion

IDA is powered by a combination of modern technologies, including **Next.js**, **React**, **Agent.AI**, and **Vercel**. These technologies provide a robust and scalable platform that offers a seamless experience for users to search for medicines and locate pharmacies.

By leveraging **Next.js** and **Agent.AI**, we were able to quickly integrate powerful AI features into our application, making it more interactive and useful for users.

---



