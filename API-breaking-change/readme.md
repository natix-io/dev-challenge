

# Handling API Breaking Changes 


Imagine you’re designing and maintaining an internal or public-facing **Weather API**. A basic version of the response looks like:

```
{
  "Weather": [
    { "hour": 0, "temperature": "18", "condition": "Clear" },
    { "hour": 1, "temperature": "17", "condition": "Clear" },
    ...
    { "hour": 23, "temperature": "16", "condition": "Cloudy" }
 ]
}
```

 Assumming this is the first published contract is consumed by multiple frontend apps already we need to introduced a change. please answer to these questions:
 

### 1 What Is a Breaking Change?

Provide examples of what would constitute a **breaking change** to this API response for the frontends that are using tihs endpoints. provide at least 3 example.

# ANSWER
A breaking change is any modification to the API contract that can cause consuming clients to fail or behave incorrectly without them making any adjustments. In the context of our weather API, typical breaking changes would include:

- Field name changes: Renaming "temperature" to "temp" immediately breaks frontends expecting the original key.
- Data type changes: Changing "temperature": "18" (string) to "temperature": 18 (number) can cause parsing failures or display issues on frontends relying on consistent types.
- Structural changes: Nesting "Weather" under a new object ({ "data": { "Weather": [...] } }) will break any direct access patterns like response.Weather

We had similar concept in LIS where common request/response models were being used by all the clients with minor changes, so changing any common field can impact any/all clients.

### 2 Coordinating Across Multiple Frontends

You have **multiple frontend clients** some update imidiately and some take their update only every 1–2 months.
**How would you handle an API schema change across all of them safely?**

# ANSWER
When supporting multiple frontend clients — the safest approach is non-breaking releases through versioning and compatibility layers. 

LIS Project is where I had to extensively take care after releasing any change as multiple clients were using our services. We have ran into Production issue because of field change without proper testing, after which we had introduced few steps to adhere before releasing anything to Production

Following steps can be followed:
- Endpoint versioning: e.g., /v1/weather, /v2/weather. This gives clients a stable contract and freedom to upgrade when ready.
- Non-breaking additive changes: If a change can be made without removing or altering existing fields (e.g., adding a new `humidity` field), it can often be safely rolled out with good documentation.
- Dual-schema support: Maintain both old and new response schema behind API version headers or flags until all clients migrate.
- Proactive communication: Before a change releases, we issue changelogs, conduct API walkthroughs, and support A/B testing or feature toggles
- UAT Testing and Release Approval from clients as required

### 3 How to Catch Breaking Changes During Development

Describe how a team can **detect breaking changes early**, in your experince. please elaburate.

# ANSWER
In my experience, the most reliable way to catch breaking changes early is to introduce automated checks integrated into CI/CD. One key practice is implementing consumer-driven contract testing. 
In our teams, we used Pact and Contract Testing, where frontend teams defined the expected API response structure. These contracts were stored centrally and validated by the backend during every CI run. If any field is removed, renamed, or has its type changed, the contract test fails immediately — long before code hits production.

Testing screenshots for all possible Acceptance Criteria's in the user-story itself to refer it anytime. Also, helps for PR approval

Beyond tooling, we enforced a "contract review" checkpoint in every pull request that touched API-related code. This ensured that developers thought through versioning, compatibility, and migration plans up front — not as an afterthought. In our project, breaking changes weren't just technical decisions; they required business justification and coordinated communication across all stakeholders.

### 4 Policy for Releasing Changes

What internal **policy/process** was established to manage schema changes safely, in your previous team?

# ANSWER
In my previous teams, we treated schema changes — especially to public or shared APIs — as high-risk operations that required a defined policy and change request workflow. Our release process was driven by the principle of backward compatibility first, meaning no consumer-facing change was allowed to break existing clients.

Every change that's required to be implemented needs to go through,
- Design Review Phase (how critical it's and if it's really required?)
- Walkthrough of any change to consuming clients (wherever possible)
- Enough Unit and Integration Testing
- Testing screenshots for all possible Acceptance Criteria's in the user-story itself to refer it anytime. Also, helps for PR approval
- UAT Testing and client's approval/sign-off before releasing any change
- Open and Clear communication.
- We used to follow 7 days window time to release any change to Production that allows downstream teams enough time to test their change and get back to us in anycase of breaking change (also allow us to fix it in time)
- Follow up call with integration teams soon after change release to confirm if applications are up and running without any outages

## 🧪 Acceptance Criteria
- Answer these four questions thoroughly – at least one paragraph each, maximum half a page.
- Provide practical examples from your own experience. Don’t just rely on ChatGPT’s first suggestion — dig deeper!





