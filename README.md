# Awesome Talon [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of awesome [Talon](https://talonvoice.com/) resources, command sets, plugins, and tools for voice-controlled computing.

Talon is a hands-free input system that enables you to write code, play games, and control your computer using voice, eye tracking, and noise recognition. Created by [Ryan Hileman](https://github.com/lunixbochs), Talon is available on macOS, Linux, and Windows. The alpha version is free; the beta version with newer features is available via Patreon.

## Contents

- [Official Resources](#official-resources)
- [Community](#community)
- [Command Sets](#command-sets)
- [Code Editing](#code-editing)
- [Browser Extensions](#browser-extensions)
- [Mouse and Cursor Control](#mouse-and-cursor-control)
- [Editor and IDE Integrations](#editor-and-ide-integrations)
- [Speech Engines](#speech-engines)
- [Accessibility](#accessibility)
- [AI and LLM Integration](#ai-and-llm-integration)
- [Noise Recognition](#noise-recognition)
- [Application-Specific Commands](#application-specific-commands)
- [Window Management](#window-management)
- [Gaming](#gaming)
- [Developer Tools](#developer-tools)
- [Hardware Integrations](#hardware-integrations)
- [Internationalization](#internationalization)
- [Nix / NixOS](#nix--nixos)
- [Notable Personal Configurations](#notable-personal-configurations)
- [Related Projects](#related-projects)
- [Learning and Practice](#learning-and-practice)
- [Talks and Demos](#talks-and-demos)
- [Podcasts](#podcasts)
- [Blog Posts and Articles](#blog-posts-and-articles)
- [Academic Research](#academic-research)

---

## Official Resources

- [Talon Downloads](https://talonvoice.com/dl/) - Official downloads page for macOS, Linux, and Windows.
- [Talon Documentation](https://talonvoice.com/docs/) - Official Talon 0.4 docs.
- [Talon Slack](https://talonvoice.com/chat) - Official Talon community Slack, the best place to get help.
- [Talon Patreon](https://www.patreon.com/join/lunixbochs) - Support development and get access to the beta version with newer features.
- [Talon GitHub](https://github.com/talonvoice) - Official Talon repositories.
- [Talon Changelog](https://talonvoice.com/dl/latest/changelog.html) - Release notes and changelog.

## Community

- [Talon Community Wiki](https://talon.wiki/) - Community-maintained wiki with comprehensive documentation.
- [Talon Community Wiki (GitHub)](https://github.com/TalonCommunity/Wiki) - Source for the community wiki.
- [KnowBrainer Forums - Talon Thread](https://forums.knowbrainer.com/forum/third-party-command-utilities-vocola-unimacro-voicepower-python/404-wow-i-m-uninstalling-dragon-no-longer-need-it-as-i-am-100-happy-with-talon-voice) - Forum discussions about Talon Voice.

## Command Sets

*Voice command sets that provide the core vocabulary for controlling your computer with Talon.*

- [talonhub/community](https://github.com/talonhub/community) - The main community-supported voice command set for Talon. The recommended starting point for new users.
- [talonhub/community-beta](https://github.com/talonhub/community-beta) - Fork of community for developing against features in the beta version of Talon.
- [AndreasArvidsson/andreas-talon](https://github.com/AndreasArvidsson/andreas-talon) - User scripts for Talon Voice with extensive customizations for voice coding.
- [2shea/talon_starter_pack](https://github.com/2shea/talon_starter_pack) - Basic starter pack of voice commands for getting started with Talon.
- [Xe/invocations](https://github.com/Xe/invocations) - Spoken word invocations for Talon.
- [chaosparrot/marithime_talon](https://github.com/chaosparrot/marithime_talon) - A Talon command set focused on keeping you in the flow while dictating and creating text.
- [mirober/MR-talon](https://github.com/mirober/MR-talon) - Talon scripts for voice coding and general computer control.
- [C-Loftus/colton_talon](https://github.com/C-Loftus/colton_talon) - Supplementary scripts to Talon Community.
- [lucillablessing/betterinput](https://github.com/lucillablessing/betterinput) - More versatile input actions for Talon Voice.
- [rokubop/roku-talon-shared](https://github.com/rokubop/roku-talon-shared) - Shared Talon scripts for mouse movement, gaming, parrot config, and more.

## Code Editing

*Tools for editing code by voice, including structural editing and navigation.*

- [cursorless-dev/cursorless](https://github.com/cursorless-dev/cursorless) - A spoken language for structural code editing, enabling voice coding at speeds faster than keyboard. Decorates every token on screen for rapid semantic manipulation.
- [Cursorless Website](https://www.cursorless.org/) - Official Cursorless website with docs and tutorials.
- [cursorless-dev/cursorless-talon](https://github.com/cursorless-dev/cursorless-talon) - The Talon-side plugin for Cursorless.
- [cursorless-dev/command-server](https://github.com/cursorless-dev/command-server) - Secure VS Code communication channel designed for voice coding.
- [cursorless-dev/vscode-parse-tree](https://github.com/cursorless-dev/vscode-parse-tree) - Syntax trees for VS Code using tree-sitter, used by Cursorless.
- [hands-free-vim/cursorless.nvim](https://github.com/hands-free-vim/cursorless.nvim) - Neovim plugin to support Cursorless.
- [mirober/mathfly-talon](https://github.com/mirober/mathfly-talon) - Talon scripts for dictating mathematics into editors like LyX and Scientific Notebook.
- [FireChickenProductivity/TalonVoiceCodingSupplement](https://github.com/FireChickenProductivity/TalonVoiceCodingSupplement) - Programming supplemental configuration for ideas unsuitable for community.

## Browser Extensions

*Tools for navigating and interacting with web browsers by voice.*

- [david-tejada/rango](https://github.com/david-tejada/rango) - Cross-browser extension for controlling your browser by voice. Draws letter hints next to clickable elements.
- [david-tejada/rango-talon](https://github.com/david-tejada/rango-talon) - Talon user file set for the Rango browser extension.

## Mouse and Cursor Control

*Alternative ways to control the mouse and cursor without using your hands.*

- [wolfmanstout/talon-gaze-ocr](https://github.com/wolfmanstout/talon-gaze-ocr) - Advanced cursor control using eye tracking and OCR. Click, select, or position caret adjacent to any visible text.
- [splondike/talon_ui_helper](https://github.com/splondike/talon_ui_helper) - Package for making it easier to build new mouse-controlling voice commands.
- [AndrewDant/screen-spots](https://github.com/AndrewDant/screen-spots) - Save screen locations to later click on or move to using voice.
- [splondike/talon_telector](https://github.com/splondike/talon_telector) - Text selection overlay for Talon.
- [Antman261/talon-matrix-mouse](https://github.com/Antman261/talon-matrix-mouse) - Click anywhere by speaking three words.
- [FireChickenProductivity/MouseControlChicken](https://github.com/FireChickenProductivity/MouseControlChicken) - Talon voice customization for controlling the mouse.
- [MichaelOmegatron/Omega_Mouse](https://github.com/MichaelOmegatron/Omega_Mouse) - An alternative way to interact with Control Mouse in Talon.
- [geobarry/eagle_talon](https://github.com/geobarry/eagle_talon) - Control mouse using a first-person navigation perspective with distances and directions.
- [rokubop/talon-mouse-rig](https://github.com/rokubop/talon-mouse-rig) - All-purpose mouse rig for Talon with movement and scrolling.
- [kelocoder/talon-mouse-pointer](https://github.com/kelocoder/talon-mouse-pointer) - Talon Voice module supporting relative mouse pointer movements.

## Editor and IDE Integrations

*Plugins and extensions for specific editors and IDEs.*

### VS Code

- [Cursorless (VS Code Marketplace)](https://marketplace.visualstudio.com/items?itemName=pokey.cursorless) - Structural voice coding at the speed of thought.
- [Talon (VS Code Marketplace)](https://marketplace.visualstudio.com/items?itemName=pokey.talon) - Extensions useful for Talon.
- [AndreasArvidsson/andreas-talon-vscode](https://github.com/AndreasArvidsson/andreas-talon-vscode) - VS Code extension used by Talon Voice.
- [paul-schaaf/talon-filetree](https://github.com/paul-schaaf/talon-filetree) - VS Code extension for navigating and manipulating the file tree by voice.
- [paul-schaaf/talon-filetree-commands](https://github.com/paul-schaaf/talon-filetree-commands) - Talon commands for the filetree VS Code extension.
- [Mark-Phillipson/TalonCommandSearchExtension](https://github.com/Mark-Phillipson/TalonCommandSearchExtension) - VS Code extension for searching and browsing Talon voice commands.

### Vim / Neovim

- [fidgetingbits/talon-vim](https://github.com/fidgetingbits/talon-vim) - Talon-side plugin for interacting with Vim/Neovim using Talon Voice.
- [hands-free-vim/neovim-talon](https://github.com/hands-free-vim/neovim-talon) - Talon user file set for controlling Neovim editing and terminals using voice.
- [hands-free-vim/talon.nvim](https://github.com/hands-free-vim/talon.nvim) - Neovim plugin to support Talon Voice and Cursorless.
- [hands-free-vim/command-server](https://github.com/hands-free-vim/command-server) - Neovim communication channel designed for voice coding.
- [seanyeh/talon.vim](https://github.com/seanyeh/talon.vim) - Vim syntax highlighting for Talon Voice config files.

### Emacs

- [jcaw/talonscript-mode](https://github.com/jcaw/talonscript-mode) - Emacs major-mode for `.talon` files.
- [rntz/emacs-talon](https://github.com/rntz/emacs-talon) - Emacs Talon integration.
- [rntz/talon_emacs_draft](https://github.com/rntz/talon_emacs_draft) - Using Emacs as a draft window for Talon.
- [wenkokke/spacemacs-talon](https://github.com/wenkokke/spacemacs-talon) - Talon Voice integration for Spacemacs.
- [kelocoder/talon-mode](https://github.com/kelocoder/talon-mode) - Emacs major mode for editing Talon Voice scripts.

### Sublime Text

- [trishume/SublimeTalon](https://github.com/trishume/SublimeTalon) - Sublime Text plugin for Talon integration.

### Terminal

- [FireChickenProductivity/TerminalChicken](https://github.com/FireChickenProductivity/TerminalChicken) - Talon voice extension for controlling terminal programs with Cursorless.

## Speech Engines

*Speech recognition engines compatible with Talon.*

- [Conformer (W2L)](https://talon.wiki/Resource%20Hub/Speech%20Engines/Conformer/) - Talon's built-in speech engine. Excellent accuracy and speed for both commands and dictation. Free, installed via Talon tray icon.
- [W2L Gen2](https://talon.wiki/Resource%20Hub/Speech%20Engines/W2L/) - Earlier Talon model with adequate command recognition but weaker dictation. Free.
- [Dragon Professional](https://www.nuance.com/dragon/business-solutions/dragon-professional-individual.html) - Commercial speech engine with strong accuracy. Windows only, $300-$500.
- [Webspeech](https://talon.wiki/Resource%20Hub/Speech%20Engines/Webspeech/) - Browser-based engine with excellent accuracy but added latency. Requires internet. Supports multiple languages.
- [Vosk](https://alphacephei.com/vosk/) - Offline open-source speech recognition. Supports 20+ languages. Dictation-only, needs a command engine.
- [fmcurti/finetunian](https://github.com/fmcurti/finetunian) - Finetuning Whisper for Talon Voice commands.

## Accessibility

*Tools that extend Talon's accessibility features.*

- [C-Loftus/sight-free-talon](https://github.com/C-Loftus/sight-free-talon) - Integrate Talon voice dictation with TTS, screen readers, braille, and more.
- [C-Loftus/Watercolor](https://github.com/C-Loftus/Watercolor) - Color Linux accessibility elements for mouse-free interaction.
- [tararoys/NVDA-Talon](https://github.com/tararoys/NVDA-Talon) - Complete control of your Windows machine without eyes, hands, or headphones via NVDA screen reader.
- [phillco/talon-axkit](https://github.com/phillco/talon-axkit) - Talon macOS accessibility magic.

## AI and LLM Integration

*Use AI and large language models with Talon voice commands.*

- [C-Loftus/talon-ai-tools](https://github.com/C-Loftus/talon-ai-tools) - Query LLMs and AI tools with voice commands.
- [voqal/voqal](https://github.com/voqal/voqal) - Voice native AI agent for developers.
- [Mark-Phillipson/QuickPrompts](https://github.com/Mark-Phillipson/QuickPrompts) - Helper for talon-ai-tools to store and browse prompts and apply to current selection.

## Noise Recognition

*Tools for Talon's parrot (noise recognition) system.*

- [chaosparrot/parrot.py](https://github.com/chaosparrot/parrot.py) - Computer interaction using audio and noise recognition. Train custom sounds (pops, clicks, hisses, and more) to trigger actions. Talon beta now includes first-party parrot model support based on this work.
- [chaosparrot/pandemonium_talon](https://github.com/chaosparrot/pandemonium_talon) - Personal parrot / Talon integration scripts.
- [rokubop/talon-parrot-tester](https://github.com/rokubop/talon-parrot-tester) - Visualization tool for analyzing your parrot noise recognition integration.
- [FireChickenProductivity/Viper](https://github.com/FireChickenProductivity/Viper) - Talon Voice hissing control customization.

## Application-Specific Commands

*Voice commands for specific applications.*

- [FireChickenProductivity/GoogleSheetsTalonCommands](https://github.com/FireChickenProductivity/GoogleSheetsTalonCommands) - Voice commands for working with Google Sheets.
- [FireChickenProductivity/MermaidDiagramsTalonVoice](https://github.com/FireChickenProductivity/MermaidDiagramsTalonVoice) - Talon voice commands for creating Mermaid diagrams.
- [FireChickenProductivity/TalonVoiceDiagramDrawing](https://github.com/FireChickenProductivity/TalonVoiceDiagramDrawing) - Diagram drawing commands for Vectr and Inkscape.
- [FireChickenProductivity/DiagramsDotNetTalonVoiceCommands](https://github.com/FireChickenProductivity/DiagramsDotNetTalonVoiceCommands) - Voice commands for working with diagrams.net.
- [FireChickenProductivity/TalonVoiceDesmosCommands](https://github.com/FireChickenProductivity/TalonVoiceDesmosCommands) - Talon voice commands for Desmos calculators.
- [FireChickenProductivity/Talon-Voice-EquatIO-Commands](https://github.com/FireChickenProductivity/Talon-Voice-EquatIO-Commands) - Talon voice commands for dictating math into EquatIO.
- [sblakey/talon-obsidian](https://github.com/sblakey/talon-obsidian) - Talon voice configuration for Obsidian.md.
- [lookbothways/TalonToMaya](https://github.com/lookbothways/TalonToMaya) - Talon Voice for Autodesk Maya.
- [tanglisha/blender-talon-voice-integration](https://github.com/tanglisha/blender-talon-voice-integration) - Blender integration for receiving commands from Talon Voice.
- [justpic1/Talon_Voice3D](https://github.com/justpic1/Talon_Voice3D) - Hands-free, terse CAD using Talon Voice.
- [taikuukaits/godot_talon](https://github.com/taikuukaits/godot_talon) - Talon voice commands for Godot game engine.
- [taikuukaits/unity_talon](https://github.com/taikuukaits/unity_talon) - Useful voice tools for Unity and C# for Talon.
- [mirober/talon-pyvda](https://github.com/mirober/talon-pyvda) - Talon scripts for manipulating virtual desktops on Windows.
- [MooersLab/talon-iterm2](https://github.com/MooersLab/talon-iterm2) - Bash commands for iTerm2 terminal emulator on the Mac.
- [MooersLab/talon-webpages](https://github.com/MooersLab/talon-webpages) - Open favorite web pages by voice command.
- [BlueDrink9/bspwm-talon](https://github.com/BlueDrink9/bspwm-talon) - Talon voice command set for BSPWM window manager.
- [Mark-Phillipson/VoiceLauncherBlazor](https://github.com/Mark-Phillipson/VoiceLauncherBlazor) - Blazor server-side app with app launcher, snippets, and Voice Admin for Talon Voice.

## Window Management

- [lunixbochs/talon_wm](https://github.com/lunixbochs/talon_wm) - Window management in Talon, by Talon's creator.

## Gaming

*Play games using Talon voice commands and noise recognition.*

- [diabeatz96/Talon-Game-Scripts](https://github.com/diabeatz96/Talon-Game-Scripts) - Open repository of Talon scripts for games supporting accessibility.
- [Metastruct/talon_gmod](https://github.com/Metastruct/talon_gmod) - Voice control for Garry's Mod.
- [brollin/speak-the-spire-talon](https://github.com/brollin/speak-the-spire-talon) - Voice commands for the Speak the Spire mod.
- [chaosparrot/talon_darksouls](https://github.com/chaosparrot/talon_darksouls) - User scripts for playing Dark Souls with Talon.
- [ziemus/talon_voice_games](https://github.com/ziemus/talon_voice_games) - Talon Voice game library with a custom game mode.
- [orlekc/talon-games](https://github.com/orlekc/talon-games) - Simple script library that makes playing games using Talon easier.
- [DarinM223/talon_mgba_http_controller](https://github.com/DarinM223/talon_mgba_http_controller) - Control mGBA games with Talon Voice.

## Developer Tools

*Tools for Talon developers to build and debug command sets.*

### UI and Visualization

- [chaosparrot/talon_hud](https://github.com/chaosparrot/talon_hud) - Unofficial Talon Head Up Display with visual feedback for commands.
- [AndreasArvidsson/talon-deck](https://github.com/AndreasArvidsson/talon-deck) - Interactive dashboard for Talon Voice.
- [rokubop/talon-ui-elements](https://github.com/rokubop/talon-ui-elements) - Library for building stateful voice-activated canvas UIs using HTML/CSS/React-inspired syntax.
- [FireChickenProductivity/PowerFace](https://github.com/FireChickenProductivity/PowerFace) - Simple Talon Voice extension for graphical interfaces.

### Recording and Macros

- [FireChickenProductivity/BAR](https://github.com/FireChickenProductivity/BAR) - Basic Action Recorder for recording Talon actions and outputting TalonScript code.
- [FireChickenProductivity/BasicActionRecordAnalyzer](https://github.com/FireChickenProductivity/BasicActionRecordAnalyzer) - Generate source code for Talon voice commands from recorded actions.
- [pokey/wax_talon](https://github.com/pokey/wax_talon) - Record your Talon sessions.
- [rntz/quick_macro](https://github.com/rntz/quick_macro) - Quick macros for Talon.
- [chaosparrot/talon_speed_dial](https://github.com/chaosparrot/talon_speed_dial) - Command macro builder for creating and connecting voice commands to buttons, noises, or keyboard shortcuts on the fly.

### Clipboard and Text

- [FireChickenProductivity/Talon-Voice-multidimensional-clipboard](https://github.com/FireChickenProductivity/Talon-Voice-multidimensional-clipboard) - Multidimensional clipboard for Talon Voice.
- [rntz/indexed_clipboard](https://github.com/rntz/indexed_clipboard) - An indexed clipboard for Talon.
- [splondike/talon_draft_window](https://github.com/splondike/talon_draft_window) - A window for editing prose using Talon voice control.
- [BlueDrink9/homophoner-talon](https://github.com/BlueDrink9/homophoner-talon) - Resolve homophones on the fly for Talon Voice.
- [MooersLab/talon-contractions](https://github.com/MooersLab/talon-contractions) - TalonScript file of expansions for common contractions in English.
- [wolfmanstout/talon-vocabulary-editor](https://github.com/wolfmanstout/talon-vocabulary-editor) - Experimental features for managing your Talon vocabulary.
- [AndreasArvidsson/clippy](https://github.com/AndreasArvidsson/clippy) - Clipboard manager with RPC, designed for Talon Voice integration.
- [AndreasArvidsson/clippy-talon](https://github.com/AndreasArvidsson/clippy-talon) - Talon voice commands for the Clippy clipboard manager.

### Utilities

- [pokey/upgrade-knausj](https://github.com/pokey/upgrade-knausj) - CLI to make it easier to upgrade your Talon community fork.
- [rokubop/talon-pack](https://github.com/rokubop/talon-pack) - Catalogs your Talon repo's contributions and dependencies.
- [rokubop/talon-input-map](https://github.com/rokubop/talon-input-map) - Combos, modes, throttling, debounce, and conditions for Talon input sources.
- [rokubop/talon-stable-input](https://github.com/rokubop/talon-stable-input) - Bind keys or pedals to Talon actions that won't be interrupted by voice commands.
- [rokubop/talon-hub-roku](https://github.com/rokubop/talon-hub-roku) - A collection of Talon repos for UI, mouse control, input mapping, parrot, and gaming.
- [fidgetingbits/talon-shotbox](https://github.com/fidgetingbits/talon-shotbox) - Multi-platform screenshot utility for use with Talon Voice.
- [FireChickenProductivity/Fire-Chicken-Library](https://github.com/FireChickenProductivity/Fire-Chicken-Library) - Library to make writing Talon Voice commands easier.
- [FireChickenProductivity/TalonKeyRebindings](https://github.com/FireChickenProductivity/TalonKeyRebindings) - Make key rebindings through text files.

### Libraries

- [cursorless-dev/talon-rpc](https://github.com/cursorless-dev/talon-rpc) - RPC library for Talon.
- [cursorless-dev/talon-snippets](https://github.com/cursorless-dev/talon-snippets) - Snippets library for Talon.
- [cursorless-dev/talon-command-client](https://github.com/cursorless-dev/talon-command-client) - Client-side code to communicate with VS Code command server from Talon.
- [dwighthouse/talonvoice-scripts](https://github.com/dwighthouse/talonvoice-scripts) - Scripts and helpers for use with Talon.

### Documentation

- [dwighthouse/unofficial-talonvoice-docs](https://github.com/dwighthouse/unofficial-talonvoice-docs) - Documenting learning experiences with Talon.

## Hardware Integrations

*Hardware that works with Talon and integration tools.*

- [Talon Community Hardware Guide](https://talon.wiki/Resource%20Hub/Hardware/) - Community wiki page with comprehensive hardware recommendations.

### Eye Trackers

- [Tobii 5 Setup Guide](https://talon.wiki/Resource%20Hub/Hardware/tobii_5/) - Setup guide for the Tobii 5 eye tracker with Talon.
- [Tobii 4C Setup Guide](https://talon.wiki/Resource%20Hub/Hardware/tobii_4c/) - Setup guide for the older Tobii 4C.

### Peripherals

- [jbarr21/streamdeck-talon](https://github.com/jbarr21/streamdeck-talon) - Toggle the Talon Voice speech engine and show status on Elgato Stream Deck.
- [mqnc/wiiheadmouse](https://github.com/mqnc/wiiheadmouse) - Module for using the WiiMote as a mouse in Talon Voice.
- [erhoppe/savant_pedal](https://github.com/erhoppe/savant_pedal) - Pedal integration for Talon.
- [ohare93/zsa-keymapp-talon](https://github.com/ohare93/zsa-keymapp-talon) - Control your ZSA keyboard using the Keymapp API in Talon.

## Internationalization

- [mqnc/talon_german](https://github.com/mqnc/talon_german) - German dictation mode for Talon Voice.
- [mqnc/talon_typography](https://github.com/mqnc/talon_typography) - Context-aware typesetting for Talon Voice.

## Nix / NixOS

- [nix-community/talon-nix](https://github.com/nix-community/talon-nix) - Auto packaging for Talon Voice on Nix.
- [polygon/talon.nix](https://github.com/polygon/talon.nix) - Nix flake for Talon Voice.

## Notable Personal Configurations

*Well-maintained personal command sets worth studying for learning and inspiration.*

- [jcaw/talon_config](https://github.com/jcaw/talon_config) - Talon config for coding by voice with many custom commands.
- [blakewatson/talon-scripts](https://github.com/blakewatson/talon-scripts) - User scripts for Talon.
- [gimpf/talon-config](https://github.com/gimpf/talon-config) - A complete user configset for Talon Voice.

## Related Projects

*Voice control and accessibility tools that complement or relate to the Talon ecosystem.*

- [Numen](https://numenvoice.org/) - Free and open-source voice control for Linux (AGPL). Runs entirely locally.
- [dictation-toolbox/Caster](https://github.com/dictation-toolbox/Caster) - Dragonfly-based voice programming toolkit for Dragon NaturallySpeaking.
- [daanzu/kaldi-active-grammar](https://github.com/daanzu/kaldi-active-grammar) - Python package for Kaldi-based speech recognition for voice coding.
- [Serenade](https://serenade.ai/) - Cloud/local voice-to-code platform.
- [adabru/eyeput](https://github.com/adabru/eyeput) - Eye tracking input method.
- [wolfmanstout/gaze-ocr](https://github.com/wolfmanstout/gaze-ocr) - The core gaze-OCR library (also available on [PyPI](https://pypi.org/project/gaze-ocr/)).
- [screen-ocr](https://pypi.org/project/screen-ocr/) - Screen OCR library for extracting text from screenshots, used by gaze-ocr.

## Learning and Practice

*Resources for learning Talon and improving your voice command skills.*

- [Talon Practice](https://chaosparrot.github.io/talon_practice/) - Interactive games and lessons to practice Talon commands.
- [Visual TalonScript Builder](https://visual-talonscript.pages.dev) - Web app for building custom Talon commands visually.
- [Talon Cheatsheet](https://tararoys.github.io/small_cheatsheet) - Small web-based Talon cheatsheet.
- [Talon-Knausj Cheatsheet](https://talon-knausj-cheatsheet.netlify.app/) - Web-based command reference for the community command set.
- [Stolen Sugar](https://github.com/stolen-sugar/stolen-sugar) - Explore alternative keywords for commands in the Talon community user file set.
- [Guenther Schmitz's Wiki](https://wiki.gpunktschmitz.com/index.php/Talon) - Configurations, troubleshooting, and solutions for Talon.
- [MooersLab/talon-voice-quizzes](https://github.com/MooersLab/talon-voice-quizzes) - Quizzes to support recall of Talon Voice commands.
- [MooersLab/talon-voice-quiz.el](https://github.com/MooersLab/talon-voice-quiz.el) - Talon Voice quiz in Emacs Lisp.
- [CodesAway/TAIPCodesAway](https://github.com/CodesAway/TAIPCodesAway) - Talon Automated Installation Platform.
- [Mark-Phillipson/Alphabet](https://github.com/Mark-Phillipson/Alphabet) - Talon alphabet with pictures.
- [Mark-Phillipson/snippetbrowser](https://github.com/Mark-Phillipson/snippetbrowser) - Browse Talon Voice snippets available on your system.

## Talks and Demos

*Conference talks, video demonstrations, and YouTube channels about Talon.*

### YouTube Channels

- [Tara Roys](https://www.youtube.com/@taboreroys) - Demos from Talon screenshare sessions and installation guides.
- [Pokey Rule](https://www.youtube.com/@PokeyRuleJams/) - Voice coding demos using Talon and Cursorless.
- [Andreas Arvidsson](https://www.youtube.com/@andreas_arvidsson) - Voice coding demos with Talon, eye tracking, and Cursorless.

### Conference Talks

- [Voice Driven Development - Emily Shea (Deconstruct 2019)](https://www.deconstructconf.com/2019/emily-shea-voice-driven-development) - Emily Shea's talk on transitioning to voice-driven development using Talon.
- [Perl Out Loud - Emily Shea (The Perl Conference 2019)](https://tpcip.sched.com/event/P05h/perl-out-loud) - Challenges of voice dictation including homophones and designing custom voice commands.
- [Cursorless: A Spoken Language for Editing Code - Pokey Rule (Strange Loop 2023)](https://www.thestrangeloop.com/2023/cursorless-a-spoken-language-for-editing-code.html) - Designing a spoken language for code editing using tree-sitter parsing.
- [Hands-Free Computer Use with Talon Voice - Trillium Smith (CFE 2025)](https://cfe.dev/sessions/vc2025-hands-free-computer-use/) - Demonstrating entirely hands-free computer control with Talon.
- [Cursorless: Keyboards and Mice Are Sooo Last Year - Pokey Rule (BangBangCon 2021)](https://www.youtube.com/watch?v=Py9xjeIhxOg) - 10-minute talk demonstrating Cursorless at the joy-of-computing conference.
- [Enhancing Productivity with Voice Computing - Blaine Mooers (EmacsConf 2023)](https://emacsconf.org/2023/talks/voice/) - Speech-to-text, speech-to-commands, and speech-to-code.

### Video Demos

- [I had to learn to code by voice](https://www.youtube.com/watch?v=FOJ6OvPf_nM) - A beginner coder using Talon.
- [Ryan Hileman Conformer Demo](https://twitter.com/lunixbochs/status/1378159234861264896) - Talon's creator demonstrating rapid code dictation.
- [Ryan's Street Fighter Demo](https://youtu.be/pf-jkbIPovs) - Playing Street Fighter using Talon pop and hiss noises.
- [Ryan's Eye Tracking Demo](https://youtu.be/VMNsU7rrjRI) - Mouse control via eye tracking.
- [Talon Eye Tracking + Optikey Mouse](https://www.youtube.com/watch?v=PQkJE-rtn-g) - Cursor control with eye and head tracking.
- [Talon Eye Tracking Explained](https://www.youtube.com/watch?v=_jfeHqUb3_0) - Overview of eye tracking functionality for newcomers.
- [Cursorless Demo](https://www.youtube.com/watch?v=h6lM68jU2iI) - Short demo of what Cursorless voice coding looks like.
- [Cursorless Tutorial Part I - Pokey Rule](https://www.youtube.com/watch?v=5mAzHGM2M0k) - Official tutorial on how to use Cursorless for voice coding.
- [Code With No Hands You Cowards! - Pokey Rule (Craft vs Cruft)](https://www.youtube.com/watch?v=KROR-WG60zE) - Interview and demo of Cursorless and voice coding.
- [Emoji Searching with Talon - Emily Shea](https://youtu.be/RA0idiJkZOg) - Demo of searching and inserting emoji by voice.
- [Mojolicious Perl App with Talon - Emily Shea](https://youtu.be/X6rsA0Svh2M) - Voice coding a Perl application with Talon.

## Podcasts

- [Voice Coding with Emily Shea and Ryan Hileman - Google Cloud Platform Podcast](https://www.gcppodcast.com/post/episode-223-voice-coding-with-emily-shea-and-ryan-hileman/) - Talon's creator and Emily Shea discuss voice coding.
- [Supper Club: Voice Coding with Pokey Rule - Syntax #481](https://syntax.fm/show/481/supper-club-voice-coding-with-pokey-rule) - Cursorless creator Pokey Rule talks about coding by voice.
- [Coding Without Your Hands - Josh Comeau (Changelog #423)](https://changelog.com/podcast/423) - Josh Comeau on his hands-free coding workflow with Talon and eye tracking.
- [Voice Coding is Really Good - Josh Comeau (Syntax #298)](https://syntax.fm/show/298/voice-coding-is-really-good-with-josh-comeau) - Josh Comeau discusses voice coding and accessibility with Talon.
- [Vibes from Strange Loop - Pokey Rule (Changelog #559)](https://changelog.com/podcast/559) - Hallway-track conversation with Pokey Rule about Cursorless as a spoken language.
- [Programming Without Hands - Andreas Arvidsson (IT Talks #104)](https://ittalks.libsyn.com/104-programming-without-hands-swe) - Voice-controlled programming and accessible work environments. In Swedish.
- [Alternative Tools for Programming - Andreas Arvidsson (IT Talks #188)](https://ittalks.libsyn.com/188-alternative-tools-for-programming-with-andreas-arvidsson) - Voice commands, foot pedals, and alternative input methods. In Swedish.

## Blog Posts and Articles

- [Coding with voice dictation using Talon Voice - Josh W. Comeau](https://www.joshwcomeau.com/blog/hands-free-coding/) - Comprehensive walkthrough of hands-free coding with Talon.
- [Speaking in code: hands-free input with Talon - Blake Watson](https://blakewatson.com/journal/speaking-in-code-hands-free-input-with-talon/) - Overview of Talon's voice recognition system.
- [Writing and coding by voice with Talon - Blake Watson](https://blakewatson.com/journal/writing-and-coding-by-voice-with-talon/) - Using Talon for writing and coding.
- [Getting Started with Voice Driven Development - Whale Quench](https://whalequench.club/blog/2019/09/03/learning-to-speak-code.html) - Beginner's guide to voice-driven development.
- [Coding With Talon Voice - narjoDev](https://blog.narjo.dev/coding-with-talon-voice) - Blog post on the Talon voice coding experience.
- [How I learned to code with my voice - whitep4nth3r](https://whitep4nth3r.com/blog/how-i-learned-to-code-with-my-voice/) - Personal experience learning to code by voice.
- [Talon Voice Speech to Code - ColorfulCode](https://colorfulcodesblog.wordpress.com/2019/12/12/talon-voice-speech-to-code-accessibility/) - Talon Voice from an accessibility perspective.
- [Talon: In-Depth Review - Hands-Free Coding](https://handsfreecoding.org/2021/12/12/talon-in-depth-review/) - Detailed review of Talon's features and capabilities.
- [Gaze OCR: Talon support and 10 new features - Hands-Free Coding](https://handsfreecoding.org/2022/11/27/gaze-ocr-talon-support-and-10-new-features/) - Deep dive into gaze-OCR features for Talon.
- [Four weeks of voice computing - Fileside](https://www.fileside.app/blog/2025-04-14_voice-computing/) - Learning voice computing over four weeks.
- [Hands-Free Computer Use: Setting Up Talon Voice - Cozy Informatics](https://cozy-informatics.io/hands-free-computer-use-setting-up-talon-voice-and-command-sets/) - Setup guide for Talon Voice and command sets.
- [David Tejada - Rango Project](https://davidtejada.dev/projects/rango/) - The story behind building the Rango browser extension.
- [Adventures in A11y: Trying Out Talon & Cursorless - mrnice.dev](https://www.mrnice.dev/posts/trying-out-talon-and-cursorless-part-0/) - Documenting the experience of learning Talon and Cursorless for accessibility.
- [Being Pokey Rule: Speaking Software Into Existence - Being Frank](https://www.being-frank.com/blog/being-pokey-rule-speaking-software-into-existence/) - Profile of Cursorless creator Pokey Rule.
- [Cursorless Is Alien Magic From the Future - Michael Tsai](https://mjtsai.com/blog/2023/11/14/cursorless-is-alien-magic-from-the-future/) - Commentary on Cursorless's capabilities.
- [Voice Coding: The Next Frontier of Programming - Mikael Ainalem](https://mikael-ainalem.medium.com/voice-coding-the-next-frontier-of-programming-d713cfa2d38b) - Vision for the future of voice-driven programming.
- [Speech-to-Code: Vibe Coding with Voice - Addy Osmani](https://addyo.substack.com/p/speech-to-code-vibe-coding-with-voice) - AI + voice as a new developer workflow.
- [Programming by Voice May Be the Next Frontier in Software Development - IEEE Spectrum](https://spectrum.ieee.org/programming-by-voice-may-be-the-next-frontier-in-software-development) - IEEE article on the future of voice programming.
- [Talon Voice, the Start of the Journey - Trillium Smith](https://trilliumsmith.com/blog/talon-voice-the-start-of-the-journey) - Personal journey into voice-controlled computing.
- [Andreas Is Programming Without Using His Hands - Redpill Linpro](https://careers.redpill-linpro.com/posts/andreas-is-programming-without-using-his-hands) - Profile of Andreas Arvidsson adopting Talon after repetitive strain injury.
- [Talon Voice and Extras Setup Notes - Jacob Egner](https://jacobegner.wordpress.com/2023/06/21/talon-voice-and-extras-setup-notes/) - Detailed setup documentation and configuration notes.

## Academic Research

- [Programming by Voice: Exploring User Preferences and Speaking Styles (ACM)](https://dl.acm.org/doi/fullHtml/10.1145/3571884.3597130) - Research on how developers speak code.
- [Programming by Voice Efficiency (DIVA)](https://www.diva-portal.org/smash/get/diva2:1617714/FULLTEXT01.pdf) - Study on voice programming efficiency in reactive and imperative paradigms.

---

## Contributing

Contributions welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

If you know of a Talon resource, command set, or tool that isn't listed here, please open a pull request or an issue.
