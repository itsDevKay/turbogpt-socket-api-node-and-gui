const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: { origins: '*:*' }
});
const Docker = require('dockerode');
const { Configuration, OpenAIApi } = require("openai");
 
const docker = new Docker({socketPath: '/var/run/docker.sock'});
agents = []
 
// Socket.io event handler for starting a Docker container
io.on('connection', (socket) => {
    socket.on('join_room', async (data) => {
        socket.join(data.room)
        socket.emit('join_room_announcement', data)
        console.log(`✅ Room: ${data.room} was joined successfully.`)
    })

    socket.on('room_left', async (data) => {
        socket.leave(data.room)
        socket.emit(`✅ Room: ${data.room} was left successfully.`)
        console.log(`✅ Room: ${data.room} was left successfully.`)
    })

    socket.on('query_gpt', async (data) => {
        console.log(`✅ Container creation request received: ${JSON.stringify(data)}`)
        socketServer = 'http://192.168.0.222:3000'
        goals = ''
        data.goals.forEach(g => { goals = goals + `${String(g)}/;` })

        let err_response = ''
        try {
            const configuration = new Configuration({
                apiKey: data.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            try {
                // Used to verify that API key is valid
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: "Say this is a test",
                    temperature: 0,
                    max_tokens: 7,
                });
                console.log(response.data)

                const container = await docker.createContainer({
                    Image: 'turbogpt',
                    AttachStdin: false,
                    AttachStdout: false,
                    AttachStderr: false,
                    Tty: false,
                    OpenStdin: false,
                    StdinOnce: false,
                    env: [
                        `agent_name=${data.agent_name}`,
                        `agent_description=${data.agent_description}`,
                        `agent_goals=${goals}`,
                        `agent_continuous=${data.agent_continuous}`,
                        `OPENAI_API_KEY=${data.OPENAI_API_KEY}`,
                        `socket_server=${socketServer}`,
                        `socket_room=${data.room}`
                    ]
                })
    
                await container.start()
                console.log(container.id)
                agents.push({
                    room: data.room,
                    container: JSON.stringify(container),
                    container_id: container.id
                })
    
                socket.emit('docker_container_started', {
                    message: '✅ Docker container started. Agent loading..',
                    container_id: container.id
                })
            } catch (err) {
                if (err.response.status == 401) {
                    err_response = '401 Request failed. Unauthorized. Token is invalid.'
                } else {
                    err_response = `${err.response.status} [${err.response.statusText}]: ${err.message}`
                }
                socket.emit('error', { 
                    message: err_response ? err_response : err.message,
                    route: 'query_gpt'
                })
            }
        } catch (err) {
            socket.emit('error', { 
                message: err_response ? err_response : err.message,
                route: 'query_gpt'
            })
        }
    })

    socket.on('kill_container', async (data) => {
        const container_id = data.container_id
        console.log(data)
        try {
            // Find container by id
            const container = await docker.getContainer(container_id)
            await container.stop()

            // Remove from agents
            let containerIndex = agents.findIndex(a => a.container_id === container_id)
            agents.splice(containerIndex, 1)
            console.log({containerIndex, agents})

            socket.emit('kill_response', { 
                message: `✅ Container exited successfully: ${container_id}`
            })
        } catch (err) {
            console.log(err.message)
            socket.emit('error', { 
                message: err.message,
                route: 'kill_container'
            })
        }
    })

    socket.on('gpt_response', async (data) => {
        let container_id = agents.filter(obj => {
            return obj.room === data.room
        })
        container_id = container_id[0].container_id
        console.log(container_id)
        let response = {
            message: data.message,
            container_id: container_id
        }
        console.log(response)
        io.to(data.room).emit('gpt_response', response)
        console.log(`✅ GPT Responded successfully to room [ ${data.room} ] with message.`)
    })

    // Socket.io event handler for running a command inside a Docker container
    // socket.on('run-command', async (data) => {
    //     const { containerName, command } = data;

    //     try {
    //         // Find container by name
    //         const container = await docker.getContainer(containerName);
    //         const exec = await container.exec({
    //         Cmd: command,
    //         AttachStdout: true,
    //         AttachStderr: true
    //         });

    //         const stream = await exec.start();

    //         // Stream output to client
    //         stream.on('data', (chunk) => {
    //         socket.emit('command-output', { message: chunk.toString() });
    //         });
    //     } catch (err) {
    //         socket.emit('error', { message: err.message });
    //     }
    // });
});
 
// Start server
server.listen(3000, () => {
    console.log('Server started on port 3000');
});