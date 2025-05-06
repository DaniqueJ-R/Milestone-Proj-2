# Roamly – Test Plan Document

## 1. Introduction

This test plan outlines the strategy and procedures for verifying the functionality, performance, responsiveness, and accessibility of **Roamly**, a travel destination finder built with HTML, CSS, and JavaScript using the OpenCage Geocoding API and Leaflet.js.

Automated testing with Jest was initially planned but deprioritized due to time constraints and focus on core feature completeness and user experience. To ensure quality, an extensive manual test plan was executed, including edge-case scenarios and responsive layout testing across devices. This approach ensured full functional coverage and a stable user experience.

## 2. Objectives

* Verify all core features function as expected across devices and browsers.
* Ensure user input is validated and errors are handled gracefully.
* Confirm compatibility across modern browsers and screen sizes.
* Validate accessibility according to WCAG standards.
* Identify and document bugs or issues for future improvements.

## 3. Scope

### In-Scope:

* Geolocation search
* Map rendering and interactivity
* Responsive layout
* Error handling
* Accessibility

### Out-of-Scope:

* Backend testing (none implemented)
* API internal testing (OpenCage/Leaflet reliability is assumed)

---

## 4. Test Environment

| Component      | Specification                                                               |
| -------------- | --------------------------------------------------------------------------- |
| Devices Tested | iPhone SE, iPhone 13, Galaxy S10, iPad Air, MacBook Pro 13", Windows Laptop |
| Browsers       | Chrome, Firefox, Safari, Edge                                               |
| Tools Used     | Chrome DevTools, Lighthouse, axe-core, screen readers (NVDA, VoiceOver)     |

---

## 5. Test Cases

### 5.1 Functional Tests

| TC#  | Test Description    | Steps                      | Expected Result             | Status |
| ---- | ------------------- | -------------------------- | --------------------------- | ------ |
| TC01 | Valid city search   | Enter "Paris" and submit   | Map shows location and pins | ✅      |
| TC02 | Invalid input       | Enter "123abc" and submit  | Show error message          | ✅      |
| TC03 | Empty input         | Submit with empty field    | Warning appears             | ✅      |
| TC04 | API error handling  | Disable network and search | Show fallback error         | ✅      |
| TC05 | Rapid input changes | Search 3 cities quickly    | Map updates correctly       | ✅      |

### 5.2 UI & Responsiveness

| TC#  | Device    | Description   | Expected Behavior       | Status |
| ---- | --------- | ------------- | ----------------------- | ------ |
| TC06 | iPhone SE | Mobile layout | Map scales, UI readable | ✅      |
| TC07 | iPad Air  | Medium screen | Two-column layout       | ✅      |
| TC08 | Desktop   | Full screen   | Expanded map and form   | ✅      |

### 5.3 Accessibility

| TC#  | Area          | Test               | Result                      |
| ---- | ------------- | ------------------ | --------------------------- |
| TC09 | Contrast      | Use checker tool   | Pass (meets AA)             |
| TC10 | Keyboard nav  | Use tab key        | All elements reachable      |
| TC11 | ARIA & labels | Screen reader test | Reads all controls properly |

---

## 6. Known Issues

| ID  | Description                      | Priority | Workaround    | Fix Plan                                  |
| --- | -------------------------------- | -------- | ------------- | ----------------------------------------- |
| K01 | Map scroll trap on touch devices | Medium   | N/A           | Investigate Leaflet mobile event handlers |
| K02 | API over-limit not clearly shown | High     | Refresh later | Plan to handle HTTP 402                   |

---

## 7. Results Summary

| Category            | Pass | Fail | Notes                    |
| ------------------- | ---- | ---- | ------------------------ |
| Functional          | 5    | 0    | All major flows work     |
| UI & Responsiveness | 3    | 0    | Tested on 5 screen sizes |
| Accessibility       | 3    | 0    | Meets WCAG AA            |
