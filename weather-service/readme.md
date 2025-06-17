

# Resilient Weather Backend
## Task Overview
You're tasked with building a backend API that exposes reliable weather data to a frontend. The frontend requests the current weather for the city the user is in — but there's a catch: the only way to get this information is via an external weather API that is rate-limited and suffers from occasional downtime.
Your goal is to design and implement a resilient backend that:
- Minimizes calls to the external weather API
- Handles API failures gracefully


## Context and Scope
1. The external weather API is limited to 100 requests per hour.
2. It returns detailed weather data for a given city on the current day. As shown example
3. You must support approx. 100,000 daily active users across approx. 2,500 different cities across the globe. Users use the service at any time  throughout the day.
4. User authentication and external API authentication are out of scope. Simply response will be open to any call  and assume the external API will reply to requests coming from our cluster according to the limit mentioned in 1.


Example of  External API response per  city

```{
  "weather": [
    { "hour": 0, "temperature": "18°C", "condition": "Clear" },
    { "hour": 1, "temperature": "17°C", "condition": "Clear" },
    ...
    { "hour": 23", "temperature": "16°C", "condition": "Cloudy" }
  ]
}
```



## Endpoint Base Info

``` GET /weather?city=CityName ```


Response:
```
{
  "Weather": [],
   …
}
```
  


🧪 Acceptance Criteria
- You may use any programming language. Even pseudocode or a clearly structured functional design (e.g. flowchart-style logic) is acceptable — what matters is the clarity and quality of your technical design and solution.
- You may mock any libraries or databases. The focus is not third-party integration.
- Clearly describe the input and output of each major function in your solution. This helps us understand your reasoning behind  your technical design.
- Expand the response object: the example provided is minimal. Based on your experience, design a response that communicates effectively with the frontend/UI.



