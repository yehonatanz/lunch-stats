# Lunch Stats
[Browse on Github Pages](https://yehonatanz.github.io/lunch-stats/)

## What is this?
A very basic utility to graph lunch arrival times
![image](https://user-images.githubusercontent.com/12269446/166142029-8a3e7de1-96fa-46a4-8667-42fba7b46cac.png)

## Why?
I got sick of guessing when my food delivery will arrive based on gut feeling and decided to utilize a data based approach 🤓

## How?
My company has a dedicated WhatsApp chat for announcing when a food delivery arrives.
I exported this chat to a txt file and wrote a python parser to convert it to JSON and a tiny [Plotly](https://plotly.com/javascript/) based frontend.
The entire thing is packed into a single HTML file for easy offline sharing.

### Wait but:
1. **Why not use WhatsApp's API?** That requires a server, credentials and possibly a WhatsApp business account
2. **Why not generate the chat file by scraping?** WhatsApp's web UI implements infinte scroll, which limits scraping (or requires Selenium-like solution, which I didn't feel like implementing)
3. **Why not generate the chat by querying IndexedDB?** Skimmed it and looks like it holds encrypted messages. Figuring out how to decode those would take me more time than parsing a txt file
4. **Why plot by search pattern instead of by resturaunt?** Identifying, extracting and normalizing resturatunts from free text WhatsApp message requires more NLP/heuristics effort than I was willing to put in

## What's next?
- Autocompletion in search textbox by existing strings
- Tags UI for searching multiple resturaunts, instead of separating by commas
- Percentiles view
- There are more possible improvements, but they will pend for user feedback 😇

## That's awesome! How can I help?
- Are you a developer? You're welcome tackle any of the issues in the What's next section!
- Are you in this WhatsApp group for longer than I am? You can export the chat and send it to me so we'll have more historic data!
- Do you have an idea for a cool feature? Open an issue!
- Order me lunch!
