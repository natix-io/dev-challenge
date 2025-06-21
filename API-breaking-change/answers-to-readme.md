## Answers

### Question 1

A **breaking change** is any change to an API that causes existing clients to fail or behave incorrectly without
modification. In the context of the Weather API, one clear example would be **changing the structure of the response**.
For instance, if we change the `"Weather"` key from an array of objects to a nested array format, like this:
`[ [{...}], [{...}] ]`, it would break any frontend expecting a flat array and iterating directly over it. A second
breaking change is **removing a required field**—if we remove `"condition"` from each weather object, any frontend
trying to display weather descriptions would encounter undefined values or crash. Lastly, **changing data types** is
another common issue—if we change `"temperature"` from a string (`"18"`) to a number (`18`), this could break UI
bindings or fail validation logic on clients that expect it as a string.

### Question 2

When supporting multiple frontend clients with different release cycles, it's critical to **introduce changes in a
backward-compatible way first**. In my previous team, we implemented **API versioning** to manage this: older clients
continued using `/v1/weather`, while newer clients migrated to `/v2/weather` with the updated schema. For more dynamic
control, we also used **feature flags** tied to client IDs or environment variables, allowing us to toggle new response
formats on or off for specific apps.

### Question 3

To catch breaking changes early, one effective approach we've used is **consumer-driven contract testing** with **Pact**. This allows frontend teams to define expectations for the API response, which are then validated automatically
whenever the backend changes. We also leveraged **OpenAPI specs**, and required that every schema update go through a
validation pipeline. For frontend-backend integrations built with **TS-Rest**, changes in the API contract are enforced
at compile time—if the backend's types don’t match the expected frontend types, TypeScript throws an error. We combined
this with **automated CI checks** and **snapshot tests**, ensuring that even minor structural or type changes trigger
reviews before deployment.

### Question 4

Our internal policy for managing schema changes followed a **strict process** to prevent breakages. First, any proposed
schema change required an RFC (Request for Comments) shared in Teams channel and documented in our
API changelog. Schema changes had to be backwards-compatible unless marked as versioned changes (e.g., `/v2`).
We also used **TS-Rest contracts** across services, ensuring that both the producer (backend) and 
consumers (frontends) adhered to the same interface contracts. Pull requests that included schema changes
were required to pass both unit tests and **contract validation checks** before merge. This approach significantly
reduced regressions and allowed safer coordination across distributed teams.
