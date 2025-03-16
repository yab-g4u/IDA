Got it! Here's an updated version of the `integration.md` document that outlines the **steps for integrating** **Medicine Search** and **Pharmacy Locator** inside your **Next.js** application. This is written to show how the integration was done for a **hackathon submission**.

```markdown
# Hackathon Submission: Integration of Medicine Search & Pharmacy Locator with Next.js

## Overview

As part of our hackathon project, we integrated two essential features, **Medicine Search** and **Pharmacy Locator**, powered by **Agent.AI**, into our **Next.js** application. The integration allows users to search for medicines and locate nearby pharmacies based on their location, making it easier for them to find health solutions.

This document outlines the **steps** we followed to successfully integrate both features into our frontend.

## Prerequisites

Before beginning the integration, ensure the following:

- **Next.js** setup in your project.
- **Node.js** and **npm/yarn** installed.
- **Agent.AI API credentials** (API key, Agent ID, and webhook URL).
- Secure storage for API keys (via environment variables).

## Steps to Integrate Medicine Search & Pharmacy Locator

### Step 1: Install Dependencies

We first installed the necessary dependencies to manage HTTP requests. Although Next.js provides the native `fetch` API, we decided to use `axios` for better handling of request/response formats. To install `axios`, run:

```bash
npm install axios
```

### Step 2: Set Up Environment Variables

We stored our **Agent.AI API credentials** securely by adding them to a `.env.local` file in the root of the project. These credentials include:

- **AGENT_API_KEY**: The API key for authenticating requests to **Agent.AI**.
- **AGENT_ID**: The unique ID for our agent.
- **AGENT_WEBHOOK_URL**: The webhook URL for sending queries to **Agent.AI**.

```plaintext
AGENT_API_KEY=your-agent-api-key-here
AGENT_ID=your-agent-id-here
AGENT_WEBHOOK_URL=your-agent-webhook-url-here
```

### Step 3: Create API Routes for Medicine Search and Pharmacy Locator

We created two separate API routes within the `pages/api` directory of our Next.js project. These routes handle the interaction with **Agent.AI** for **Medicine Search** and **Pharmacy Locator**:

#### Medicine Search API Route (`pages/api/medicine-search.js`)

```javascript
import { NextResponse } from "next/server";

export async function handler(req, res) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    try {
      const response = await fetch(process.env.AGENT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AGENT_API_KEY}`,
        },
        body: JSON.stringify({
          id: process.env.AGENT_ID,
          user_input: userInput,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return res.status(200).json({
          success: true,
          medicines: data.medicines || [],
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch medicine data',
        });
      }
    } catch (error) {
      console.error('Error with Medicine Search:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
```

#### Pharmacy Locator API Route (`pages/api/pharmacy-locator.js`)

```javascript
import { NextResponse } from "next/server";

export async function handler(req, res) {
  if (req.method === 'POST') {
    const { userInput } = req.body;

    try {
      const response = await fetch(process.env.AGENT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AGENT_API_KEY}`,
        },
        body: JSON.stringify({
          id: process.env.AGENT_ID,
          user_input: userInput,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return res.status(200).json({
          success: true,
          pharmacies: data.pharmacies || [],
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch pharmacy data',
        });
      }
    } catch (error) {
      console.error('Error with Pharmacy Locator:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
```

### Step 4: Create Frontend Components

We created two React components to handle the **Medicine Search** and **Pharmacy Locator** features. These components allow users to input their queries and display the results from **Agent.AI**.

#### Medicine Search Component (`components/MedicineSearch.js`)

```javascript
import { useState } from 'react';

const MedicineSearch = () => {
  const [medicineName, setMedicineName] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/medicine-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: medicineName }),
      });

      const data = await res.json();
      if (data.success) {
        setMedicines(data.medicines);
      } else {
        setError('No medicines found');
      }
    } catch (err) {
      console.error('Error fetching medicine data:', err);
      setError('An error occurred while fetching medicine data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search for Medicine</h2>
      <input
        type="text"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        placeholder="Enter medicine name"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Medicine'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {medicines.length > 0 ? (
          medicines.map((medicine, index) => (
            <li key={index}>
              <strong>{medicine.name}</strong>
              <p>{medicine.details}</p>
            </li>
          ))
        ) : (
          <p>No medicines found.</p>
        )}
      </ul>
    </div>
  );
};

export default MedicineSearch;
```

#### Pharmacy Locator Component (`components/PharmacyLocator.js`)

```javascript
import { useState } from 'react';

const PharmacyLocator = () => {
  const [location, setLocation] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/pharmacy-locator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: location }),
      });

      const data = await res.json();
      if (data.success) {
        setPharmacies(data.pharmacies);
      } else {
        setError('No pharmacies found');
      }
    } catch (err) {
      console.error('Error fetching pharmacy data:', err);
      setError('An error occurred while fetching pharmacy data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pharmacy Locator</h2>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your location"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Pharmacies'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {pharmacies.length > 0 ? (
          pharmacies.map((pharmacy, index) => (
            <li key={index}>
              <strong>{pharmacy.name}</strong>
              <p>{pharmacy.address}</p>
              <p>{pharmacy.services}</p>
            </li>
          ))
        ) : (
          <p>No pharmacies found.</p>
        )}
      </ul>
    </div>
  );
};

export default PharmacyLocator;
```

### Step 5: Use the Components in Pages

In the `pages/index.js`, we imported and used both components to display them on the homepage:

```javascript
import MedicineSearch from '../components/MedicineSearch';
import PharmacyLocator from '../components/PharmacyLocator';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Health Assistant</h1>
      <MedicineSearch />
      <PharmacyLocator />
    </div>
  );
}
```



### Step 6: Test and Debug

- After completing the integration, we tested the **Medicine Search** and **Pharmacy Locator** features by entering sample queries.
- We ensured that all API routes, components, and UI elements functioned correctly.
- We also implemented error handling to manage issues like network failure or no data found.

## Conclusion

By following these steps, we successfully integrated **Medicine Search** and **Pharmacy Locator** features into our **Next.js** application. This integration enhances the user experience by providing quick and easy access to critical healthcare resources.

---
