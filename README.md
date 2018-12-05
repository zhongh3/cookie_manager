# cookie_manager
Policy-based Cookie Management Chrome Extension

In this Chrome extension, we implemented four cookie policies that can be toggled by the user. 
It provided user the flexibility to enhance the cookie management and prevent cookie related attacks. 

- Policy 1: Isolate HTTP and HTTPS Cookies
- Policy 2: Prevent Cookie Overwriting (path)
- Policy 3: Prevent Cookie Shadowing (domain)
- Policy 4: Stop User Tracking (Facebook)

Once load the chrome extension and click it, it will open a new tab in Chrome.
In the top bar, there are four toggle buttons to on/off each policy. 
In the body, the left column is to list all the request history. 
The right column dispalys the sent-out cookie before and after the policy is toggled.  
