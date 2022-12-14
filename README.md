<!-- Title -->
<h1 align="center">Airline Bot</h1>
  <p align="center">
    This is just a simple Airline Bot management system.
    <br />
</h1>

<!-- Getting Started -->

## 🛠 Getting Started

To get a local copy up and running follow these simple steps.
<br/>

<!-- Installation -->

### **Step 1:** Setup / Installation

1. Clone the repository

```sh
git clone https://github.com/IsEmil/airline-bot.git
```

### **Step 2:** Setup / Installation

2. Install NPM packages

```sh
npm install
```

### **Step 3:** Setup / Installation

3. Run the Discord bot (You do this after u have done the configuration.)

```sh
node .
```

### Configurations

Edit the config.js file and insert your credentials (you can modify the config file inside src/config.js)
Remember to also add a .env file (to get the example just view .env.example)

```js
module.exports = exports = {
    token: process.env.TOKEN, // These you don't touch.
    mongo: process.env.MONGO_URI, // These you don't touch.
    guild: "", // Your discord guild id here so slash commands can be created.
    roblox: "", // Your roblox bot account cookie (how to get roblox cookie: https://noblox.js.org/tutorial-Authentication.html)
    roblox_ranking: false, // If you wish the bot to autorank the user in roblox group.
    group: 0, // Your roblox group id

    embeds: {
        colors: {
            default: "#2f3136",
            primary: "#4752c4",
            success: "#359553",
            danger: "#d53b3e"
        }
    }
}
```

<br/>

<!-- License -->
## License

Copyright © 2022 Emil (hi@isemil.me)

Distributed under the MIT License. See `LICENSE` for more information.
