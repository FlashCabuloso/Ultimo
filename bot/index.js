const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits, Events, ActionRowBuilder, ButtonBuilder, EmbedBuilder, REST, Routes } = require('discord.js');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Lê o token do arquivo token.json
const tokenData = JSON.parse(fs.readFileSync('token.json', 'utf8'));
const TOKEN = tokenData.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Inicializa o cliente do bot
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
    // Registrar comandos Slash
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(client.user.id), {
                body: [
                    {
                        name: 'status',
                        description: 'Envia o status da loja',
                    },
                ],
            });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
});

// Responder ao comando Slash
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (commandName === 'status') {
            const embed = new EmbedBuilder()
                .setTitle('Status da Loja de Discord')
                .setDescription('Escolha o status da loja:')
                .setColor('#0099ff');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('online')
                        .setLabel('Online')
                        .setStyle(3), // Usar número 3 para 'SUCCESS'
                    new ButtonBuilder()
                        .setCustomId('offline')
                        .setLabel('Offline')
                        .setStyle(4)  // Usar número 4 para 'DANGER'
                );

            await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true,
            });
        }
    } else if (interaction.isButton()) {
        const { customId } = interaction;

        if (customId === 'online' || customId === 'offline') {
            // Atualizar o status e enviar uma resposta
            await interaction.update({
                content: `A loja está ${customId.charAt(0).toUpperCase() + customId.slice(1)}`,
                components: [],
            });

            // Enviar uma mensagem de confirmação
            await interaction.followUp({
                content: '✅ | Status alterado com sucesso!',
                ephemeral: true,
            });
        }
    }
});

client.login(TOKEN);

// Endpoint para atualizar o status
app.post('/update_status', async (req, res) => {
    const { status } = req.body;
    if (status === 'online' || status === 'offline') {
        console.log(`Status atualizado para ${status}`);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
