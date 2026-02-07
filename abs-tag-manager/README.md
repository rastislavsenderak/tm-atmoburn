# AtmoBurn Services - Tag Manager
This is Tampermonkey (https://www.tampermonkey.net/) script for Atmoburn game (https://www.atmoburn.com/).

## What it does
Simple colony and fleet tagging script. Just that. See example screenshot bellow.

## How to install
- You should have Tampermonkey (https://www.tampermonkey.net/) or equivalent
- Open `abs-tag-manager.user.js` file and go "Raw" in your browser - Tampermonkey should offer you "Install" button - and thats it.

> [!WARNING]
> Pre-v2.0 versions of this scripts uses GM_setValue for storage; in v2.0+ it changes to IndexedDB (AtmoBurnTagsDB).
> To preserve your data (tags) already create, one-time migraction is executed (once) and GM-based storage keys are deleted.
> This feature (one-time migration) will be deleted in v2.5 - after couple of weeks, perhaps.

## How to use
 1. Open colony or fleet screen.
 2. Use ALT-T for tag management, or click "tag" icon/symbol on screen title
 3. Add/remove tag(s)
 4. Check your colony and/or fleet menu (left/right column) - your tags should be visible now.
 5. More to come... see TODO list.  

## How it is implemented
- No remote calls, just screen parsing (your colony/fleet ID), local (browser) storage and (of course) modifying current page (displaying tags).
- This script uses IndexedDB AtmoBurnTagsDB storage. 
- You **may** lose your data when your browser history/cookies get deleted.

## Status
> [!WARNING]
> This is still under development. Beware!

## TODO list
- Remove tags (from storage) once object (colony/fleet) cease to exist
- Add filtering by tags - hide all NOT having the tag, hide all HAVING the tag
- AUTOTAGS! Add criteria for autotagging, for example
  - when happines < 40 then add "Health" red tag
  - when iron < 10k then add "RES" red tag
  - when gold > 100k then add "RES" green tag
  - when fleet has less then 10% of max fuel then add "OOF" (out-of-fuel) tag
  - and remove tags as well when condition is not met

## Screenshots
As an example:
![Example screenshot](doc/Screenshot1.png)