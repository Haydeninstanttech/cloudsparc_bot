// Chat GPT Bot made by cloudsparc_development at https://github.com/Haydeninstanttech // Using Open AI API  https://platform.openai.com // 
// IF you use this code for any projects please include my discord server and discord username, it is appreciated! // 
// Image Generation V1 3/15/2024 

// READ ME \\
// 'channel_id' is for the text generation 
// 'channel_id2' is for the image generation 


require ('dotenv/config');
const { Client, IntentsBitField } = require('discord.js'); // Require discord.js 
const { Configuration, OpenAIApi } = require('openai'); // Require openAIApi 

const config = require("./config.json"); // Require config.json 

const client = new Client({  
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
}); // Create Intents 

client.on('ready',() => {
    console.log("The bot is online!");

    client.user.setActivity({
        name: "Watching Change ME",

    });
}); // Activity Status


//image start 
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== config.channel_id2) return; 
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: "msg.content"}];

    conversationLog.push({
        role: 'user',
        content: message.content,
    }); // Making sure it does not reply to other bots or text starting with '!' 

    await message.channel.sendTyping(); 

    let prevMessages = await message.channel.messages.fetch({ limit: 15});
    prevMessages.reverse();
    
    prevMessages.forEach((msg) => {
        if (message.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content,
        }) 
    }) // Saves user's most recent question 

    const response = await openai.createImage({
        model: "dall-e-3",
        prompt: message.content,
        n: 1,
        size: "1024x1024",
      });
      image_url = response.data.data[0].url;

    message.reply(image_url = response.data.data[0].url);
});
//image end

// chat start 
client.on('messageCreate', (message) => {
    console.log(message);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== config.channel_id) return; 
    if (message.content.startsWith('!')) return;

    let conversationLog2 = [{ role: 'system', content: "You are a friendly chatbot."}];

    conversationLog2.push({
        role: 'user',
        content: message.content,
    }); // Making sure it does not reply to other bots or text starting with ! 

    await message.channel.sendTyping(); 

    let prevMessages = await message.channel.messages.fetch({ limit: 15});
    prevMessages.reverse();
    
    prevMessages.forEach((msg) => {
        if (message.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        conversationLog2.push({
            role: 'user',
            content: msg.content,
        }) 
    }) // Saves user's most recent question 

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog2,
    }); // contacts ChatGPT Server to solve question // also logs conversation//message//

    message.reply(result.data.choices[0].message); // Replies with the answer to the user's question 
}); 
//chat end 

const configuration = new Configuration({
    apiKey: config.API_KEY, // identifies the API_KEY Found in config.json 
});
const openai = new OpenAIApi (configuration); 



client.login(config.token); // identifies the bot Token found in config.json 

