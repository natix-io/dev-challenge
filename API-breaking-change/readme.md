

# Handling API Breaking Changes 


Imagine you’re designing and maintaining an internal or public-facing **Weather API**. A basic version of the response looks like:

```
{
  "Weather": [
    { "hour": 0, "temperature": "18", "condition": "Clear" },
    { "hour": 1, "temperature": "17", "condition": "Clear" },
    ...
    { "hour": 23", "temperature": "16", "condition": "Cloudy" }
 ]
}
```

 Assumming this is the first published contract is consumed by multiple frontend apps already we need to introduced a change. please answer to these questions:
 

### 1 What Is a Breaking Change?

Provide examples of what would constitute a **breaking change** to this API response for the frontends that are using tihs endpoints. provide at least 3 example.

### 2 Coordinating Across Multiple Frontends

You have **multiple frontend clients** some update imidiately and some take their update only every 1–2 months.
**How would you handle an API schema change across all of them safely?**

### 3 How to Catch Breaking Changes During Development

Describe how a team can **detect breaking changes early**, in your experince. please elaburate.


### 4 Policy for Releasing Changes

What internal **policy/process** was established to manage schema changes safely, in your previous team?





