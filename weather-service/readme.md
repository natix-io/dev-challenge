

# Resilient Weather Service
build a backend API that exposes weather data to a frontend. The frontend requests the today's weather for the city the user is in — there's a catch: the only way to get weather information is via an external weather API that is rate-limited.

Your goal is to design a resilient backend that:
- Moderates (minimizes) calls to the external weather API
- Handles API failures gracefully


## Context and Scope
1. The external weather API is limited to 100 requests per hour.
2. The external weather API returns detailed weather data for a given city on the current day everytime it's called. As shown in the example
3. You must support approx. 100,000 daily active users across approx. 2,500 different cities across the globe. Users use the service at any time throughout the day.
4. User authentication and external API authentication are out of scope of this task. Simply assume that the API you develop will be open to any call and the external weather API will reply to requests coming from our cluster according to the limit mentioned in 1.


Example of response for a passed city to the external weather API - The result is the weather for today

```
{
  "result": [
    { "hour": 0, "temperature": "18°C", "condition": "Clear" },
    { "hour": 1, "temperature": "17°C", "condition": "Clear" },
    ...
    { "hour": 23, "temperature": "16°C", "condition": "Cloudy" }
  ]
}
```



## Endpoint Base Info

``` GET /weather?city=CityName ```


Response:
```
{
  "weather": [
    { "hour": 0, "temperature": "18", "condition": "Clear" },
    { "hour": 1, "temperature": "17", "condition": "Clear" },
    ...
    { "hour": 23, "temperature": "16", "condition": "Cloudy" }
  ],
   …
}
```
  


## 🧪 Acceptance Criteria
- You may use any programming language. Even pseudocode or structured texts (e.g. workflow-style logic in written fromat) is acceptable — what matters is the clarity and quality of your technical design and solution.
- You may mock any libraries or databases you need. The focus is not on third-party integerations.
- Write down any assumptions — either as comments in the code or as side notes in a document.
- Clearly describe the input and output of each major function/step in your solution. This helps us understand your reasoning behind your technical design.
- Expand the response object: the example provided is minimal. Based on your experience, design a response that communicates effectively with the frontend/UI.



