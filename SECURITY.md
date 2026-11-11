# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability affecting the Slafurry Studios website or its production infrastructure, please report it responsibly to:

**[security@slafurrystudios.com](mailto:security@slafurrystudios.com)**

Security reports should not be submitted through public GitHub Issues, Pull Requests, social media, or other public channels.

Please provide enough information for the Slafurry Studios team to understand and reproduce the issue. Where applicable, include:

* A description of the vulnerability
* The affected URL, endpoint, or component
* Steps to reproduce the issue
* Proof of concept or relevant technical details
* Potential security impact
* Any other information that may help with investigation

Please avoid accessing, modifying, deleting, or exposing data that does not belong to you while investigating a potential vulnerability.

---

## Scope

This security policy applies to the production systems and services associated with the Slafurry Studios website, including:

* Public website
* Admin area
* Authentication and session management
* Supabase services
* PostgreSQL database
* API routes and server actions
* Comment and contact systems
* Analytics systems
* File and media storage
* Upload functionality
* Other production systems directly supporting the website

Issues affecting third-party services should generally be reported to the relevant service provider as well. If the issue has a direct security impact on Slafurry Studios systems, please include it in your report.

---

## Responsible Disclosure

Please do not publicly disclose a vulnerability before giving Slafurry Studios a reasonable opportunity to investigate and address it.

In particular, please do not:

* Create a public GitHub Issue containing vulnerability details
* Publish exploit code or proof-of-concept material that could enable exploitation
* Disclose sensitive information obtained through a vulnerability
* Access or alter data belonging to other users
* Perform actions that could disrupt production services

If you accidentally access sensitive information while investigating a vulnerability, stop testing the affected area and include the relevant details in your private report.

---

## Response

The Slafurry Studios team will make reasonable efforts to acknowledge security reports within **14 days** of receiving them.

After initial acknowledgement, the team may request additional information, investigate the report, determine its severity and validity, and work toward an appropriate resolution.

Response and remediation timelines may vary depending on the severity, complexity, and impact of the vulnerability.

---

## Recognition

Slafurry Studios does not currently operate a formal bug bounty or guaranteed security researcher rewards program.

However, we appreciate responsible security research and the time taken to report vulnerabilities privately and responsibly.

Where appropriate, the team may acknowledge researchers who help improve the security of our production systems.

---

## Production Only

This policy applies to the **production environment** of the Slafurry Studios website.

Development, local, sandbox, or otherwise non-production environments are outside the primary scope of this policy unless a vulnerability in such an environment directly exposes or compromises production systems or data.
