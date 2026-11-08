# Request Workbench — Product owner handover

**From** Product Owner, Municipal Requests  
**To** Project Manager and the developer joining the Request Workbench team

Hi both,

Welcome to the team. Request Workbench is where our caseworkers pick up project requests that municipalities have already sent us. The caseworkers open a request, check that the information we need is there, correct the record as details come in, and mark it **Reviewed** when the intake check is complete. The operations lead uses that status to see which requests are still waiting for attention. A review is a check that the request is complete for intake. The funding decision happens elsewhere.

You’re joining with a working request list and a read-only detail view. Use the current `case/start-here` checkout and its sample requests. The README in that folder explains how to run it. We want to build on what’s there. The list is how caseworkers find their work today, and they’ll still need to move between requests and see which are **New** and which are **Reviewed**.

## What we heard from the intake team

### Bug 1 — The request details don’t explain what’s missing

> **Caseworker, on Fjordby’s school renovation**  
> “I can find the request, but when I open it, I want to know what’s holding it up. In this case the budget hadn’t come through. I can see the budget flag, but I still have to work out for myself whether anything else is missing and whether the request is ready to review.”

### Bug 2 — Caseworkers can’t save corrections to an open request

> **Caseworker, on Vesteng’s sports centre request**  
> “The description tells me roughly what they’re doing, but the project title is empty. Sometimes I get one missing detail before the other. I still want to save what I know so the next person can pick up from there. When I record a correction before lunch, a colleague opening the request after lunch should see it. And a title that’s just spaces shouldn’t get through.”

### Feature request — Mark a request Reviewed and show its review activity (High)

> **Operations lead, on Sodal’s library refurbishment**  
> “That one already had the information we needed. A caseworker should be able to finish the review without inventing a reason to edit it first. Later, when someone asks whether we reviewed it, I want to open the request and see when it happened and who recorded it. If someone tries again because they’re unsure the first action went through, I expect to see one review in the history.”

## Other requests for the backlog

### Feature request — Sign in and sign out (High)

We’re getting ready to use the workbench with more than one caseworker. Staff need to sign in as themselves before they can see or change requests, and they need a way to sign out, especially when they share a workstation. When a caseworker reviews a request, the record needs to identify the person who was signed in.

### Feature request — User profile (High)

A signed-in caseworker needs somewhere to check which account they’re using and update the name shown to colleagues. Changes to a profile should only affect the person who owns it. If a caseworker changes their display name, the operations lead still needs to be able to tell who made an earlier change.

### Feature request — Audit log (High)

Operations sometimes needs to reconstruct what happened to a request before it was reviewed. They need to know who saved a change, what changed and when, including when the request moved to **Reviewed**. Caseworkers still need the short review entry on the request itself. The operations lead needs a fuller history they can consult during a follow-up. Bring me any decisions about who else should see that history.

### Feature request — Danish and English UI (Medium)

Some caseworkers prefer Danish and some work in English. They should be able to choose either language and find the same choice the next time they open the app. The choice applies to the interface, including status labels and messages about missing information. Municipality names, project titles and descriptions should read as entered.

### Feature request — Dark mode (Low)

A few staff have asked for a darker display when working in low light. They’d like to switch between light and dark and keep their choice the next time they open the app. Request statuses and messages about missing information still need to be easy to read in both modes.

## A few decisions we’ve already made

For intake we need a municipality name, a project title and confirmation that the budget was received. A name or title made up of whitespace is missing. The description is optional. The **Budget attached** flag records what the caseworker has confirmed. Document handling stays with the existing process.

It’s fine to save an incomplete request and come back to it. It stays **New** until a caseworker explicitly marks it **Reviewed**. Completing the information makes it eligible for review. The only statuses we use in the queue are **New** and **Reviewed**. Caseworkers should be able to tell what still needs attention on an open request and whether their saved changes resolved it.

The review should reflect the information actually saved for the request. If someone is working from an old screen or tries an action twice, we still need a reliable record. Once a request is **Reviewed**, colleagues can open it and read its details and review activity. The record is closed for editing.

For this release, focus on the internal intake workflow and use the supplied fictional data. Municipal submissions, document uploads, funding decisions and changes to the existing export are outside the scope of this release. Keep the screens, messages and activity written for caseworkers.

## What I need from you

**PM**, propose what we can credibly put in front of intake for the next review. Consider how the high-priority requests depend on one another and which changes we can verify together. If something needs to be deferred, tell me what the caseworkers would still be doing manually. Bring me any question that changes the business rules or what we’d be comfortable releasing.

**Developer**, get to know the current app and bring your reading of these notes back to the PM. I’d like to hear what the app already supports, where the gaps are and what you’re assuming. Use Codex or your team’s AI tools as you work, from making sense of the feedback and reading the existing code through planning, implementation and verification. Decide what context and team guidance those tools need, what they can do independently and when they should hand a decision back to you. The team owns the code review, and I’ll confirm any change to the intake policy.

At the review, show us a realistic caseworker handover. I want to see what happens to an incomplete request, what a colleague sees after reopening a saved request and what the record looks like once a caseworker has reviewed it. For any other backlog items you take on, bring enough evidence to discuss what you checked, how the team could investigate a problem and what’s still open. I’d also like to hear one decision you made about how to work with Codex and what happened as a result.

Thanks,  
Product Owner

---

*For hackathon participants: This brief is the alternative to the session cards. Both routes start from the same `case/start-here`. As each topic comes up, decide where it helps with the work in front of you and be ready to explain how you applied it.*
