
```markdown
# API Documentation

## Overview

This document provides details about the APIs used in the **Health Assistant AI Platform** project. The platform integrates two main APIs:

1. **HereMap API**: Used for location-based services, including pharmacy search based on the user's location.
2. **Agent.AI API**: Used for the **Medicine Search** and **Pharmacy Locator** features to provide detailed information about medicines and locate pharmacies.

---

## Table of Contents
1. [HereMap API](#heremap-api)
   - [Overview](#overview)
   - [Authentication](#authentication)
   - [Endpoints](#endpoints)
     - [Search for Pharmacies](#search-for-pharmacies)
     - [Geolocation](#geolocation)
2. [Agent.AI API](#agentai-api)
   - [Overview](#overview-1)
   - [Authentication](#authentication-1)
   - [Endpoints](#endpoints-1)
     - [Medicine Search](#medicine-search)
     - [Pharmacy Locator](#pharmacy-locator)
3. [Error Handling](#error-handling)

---

## HereMap API

### Overview
The **HereMap API** is used to fetch location-based data, such as finding nearby pharmacies based on the user’s search query and their current location. This API enables the platform to provide a seamless, location-aware experience for users searching for pharmacies.

### Authentication
To authenticate requests to the **HereMap API**, you need an API key. Follow these steps to get your API key:
1. Go to [Here Developer Portal](https://developer.here.com/).
2. Create an account and log in.
3. Create a new project and generate an API key.

The API key should be included in the request headers for authentication.

### Endpoints

#### Search for Pharmacies
To search for pharmacies based on the user’s location or a specific query (e.g., a city name or coordinates), use the **Search for Pharmacies** endpoint.

**Request**:
```http
GET https://places.ls.hereapi.com/places/v1/discover/explore
```

**Parameters**:
- `q`: Search query (e.g., "pharmacy").
- `at`: Latitude and longitude of the search location (e.g., "52.5200,13.4050" for Berlin).
- `apiKey`: Your HereMap API key.

**Response**:
```json
{
  "results": {
    "items": [
      {
        "title": "Pharmacy Name",
        "vicinity": "Street Name, City",
        "position": [52.5200, 13.4050],
        "category": "Pharmacy"
      },
      // More results
    ]
  }
}
```

#### Geolocation
For geolocation features, HereMap provides a geolocation service that converts addresses into coordinates.

**Request**:
```http
GET https://geocoder.ls.hereapi.com/6.2/geocode.json
```

**Parameters**:
- `searchtext`: Address or location to search for.
- `apiKey`: Your HereMap API key.

**Response**:
```json
{
  "Response": {
    "View": [
      {
        "Result": [
          {
            "Location": {
              "Latitude": 52.5200,
              "Longitude": 13.4050
            }
          }
        ]
      }
    ]
  }
}
```

---

## Agent.AI API

### Overview
The **Agent.AI API** is used to enable AI-powered features, including **Medicine Search** and **Pharmacy Locator**. The API allows querying a large database of medicines and finding nearby pharmacies based on the user's request.

### Authentication
To authenticate requests to the **Agent.AI API**, an API key is required. You can obtain your API key by signing up on the Agent.AI platform. The API key is passed in the request headers.

### Endpoints

#### Medicine Search
The **Medicine Search** endpoint allows users to search for detailed information about a specific medicine, including usage, dosage, side effects, and more.

**Request**:
```http
POST https://api-lr.agent.ai/v1/agent/{AGENT_ID}/webhook/{WEBHOOK_ID}
```

**Headers**:
- `Authorization`: `Bearer {AGENT_API_KEY}`

**Body**:
```json
{
  "user_input": "medicine_name"
}
```

**Parameters**:
- `user_input`: The name of the medicine the user is searching for.

**Response**:
```json
{
  "response": {
    "medicine_name": "Aspirin",
    "uses": "Pain relief, anti-inflammatory",
    "side_effects": "Nausea, stomach upset",
    "dosage": "500 mg"
  }
}
```

#### Pharmacy Locator
The **Pharmacy Locator** feature enables users to find nearby pharmacies based on a searched medicine.

**Request**:
```http
POST https://api-lr.agent.ai/v1/agent/{AGENT_ID}/webhook/{WEBHOOK_ID}
```

**Headers**:
- `Authorization`: `Bearer {AGENT_API_KEY}`

**Body**:
```json
{
  "user_input": "find pharmacy for Aspirin"
}
```

**Response**:
```json
{
  "response": {
    "pharmacies": [
      {
        "name": "Pharmacy One",
        "location": "123 Main St, City",
        "distance": "2 km"
      },
      {
        "name": "Pharmacy Two",
        "location": "456 Another St, City",
        "distance": "3 km"
      }
    ]
  }
}
```

---

## Error Handling

Both APIs (HereMap and Agent.AI) may return errors based on different conditions such as incorrect parameters, invalid API keys, or network issues.

- **HereMap API** errors include invalid API keys, exceeded usage limits, and incorrect parameters.
  - Example response:
    ```json
    {
      "error": {
        "code": 403,
        "message": "Forbidden: Invalid API Key"
      }
    }
    ```

- **Agent.AI API** errors may occur if the API key is missing or incorrect, or if there is an issue with the input format.
  - Example response:
    ```json
    {
      "error": {
        "message": "Invalid request: Missing or invalid parameters"
      }
    }
    ```

In case of an error, check the error message and validate the API key, query parameters, and the network connection.

---

## Conclusion

This documentation provides an overview of the **HereMap API** and **Agent.AI API**, both of which power the core functionality of the **Health Assistant AI Platform**. By using these APIs, we can provide users with accurate, real-time information about medicines and nearby pharmacies, making it easier for them to manage their health.

For further details, check the API documentation provided by **HereMap** and **Agent.AI**:

- [HereMap API Documentation](https://developer.here.com/documentation)
- [Agent.AI API Documentation](https://www.agent.ai/)
```



