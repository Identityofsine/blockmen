from abc import ABC
import asyncio
import websockets
import websockets.asyncio.server as ws_server

from model.client.client import Client
from model.player.player import Player
from service.logger import logDebug, logInfo, logWarning
from websocket.request_handler import RequestRegistry
from validator.validator import Validator

import json

class WebSocketInterface(ABC):
    def __init__(self):
        self.socketRunning = False
        self.clients: list[Client] = []
        asyncio.run(self.init())

    async def init(self):
        """
        Initialize the WebSocket server.
        """
        self.server = await ws_server.serve(handler=self.on_connect, port=9090, host="0.0.0.0")
        self.socketRunning = True
        logInfo(f"WebSocket server started on 0.0.0.0:{9090}")
        await self.server.serve_forever()

    async def on_connect(self, server_connection: ws_server.ServerConnection):
        """
        Handle a client connection.
        """
        logInfo(f"Client connected: {server_connection.remote_address}")
        client = Player(self.clients.__len__() + 1, 0, server_connection, 0)
        self.clients.append(client)
        # non blocking listener
        await self.broadcast_helloworld(client)
        await self.catch_message(client)

    async def broadcast_helloworld(self, client: Client):
        """
        Broadcast a message to all connected clients.
        """
        try:
            logDebug(f"Sending client {client.client_id} 'Hello World'")
            await client.getConnection().send("Hello World")
        except websockets.exceptions.ConnectionClosed:
            logWarning(f"Client {client.client_id} disconnected (broadcast_helloworld)")

    async def catch_message(self, client: Client):
        """
        Catch and handle messages from a client.
        """
        try:
            logDebug(f"Waiting for message from client {client.client_id}")
            while True:
                message_from_client = await client.getConnection().recv()
                logDebug(f"Received message from client {client.client_id}: {message_from_client}")
                try:
                    request_json = json.loads(message_from_client)
                    is_valid, request = Validator.validate_request(request_json)
                    
                    if is_valid:
                        response = await self.send_to_handler(client, request)
                    else:
                        response = json.dumps({"status": "error", "message": request})
                        logWarning(f"Invalid request from client {client.client_id}: {request}")
                        
                except json.JSONDecodeError as e:
                    logWarning(f"Invalid JSON from client {client.client_id}: {message_from_client}")
                    response = json.dumps({"status": "error", "message": {"Invalid JSON format"}})
                # Send a response back to the client
                if response:
                    await client.getConnection().send(response)

        except websockets.exceptions.ConnectionClosed:
            logWarning(f"Client {client.client_id} disconnected (catch_message)")
            self.remove_client(client)
        except Exception as e:
            logWarning(f"Error in communication with client {client.client_id}: {e}")
            self.remove_client(client)

    async def send_to_handler(self, client: Client, request_data: dict) -> str:
        """
        Handle a client request and return a response.
        This method uses the RequestRegistry to find the appropriate handler for the request.
        client - The client that sent the request.
        request_data - The data sent by the client.
        context - The context of the WebSocketInterface.
        """
        return await RequestRegistry.handle_request(client, request_data, context=self)

    def remove_client(self, client: Client):
        """
        Remove a client from the active client list.
        """
        if client in self.clients:
            self.clients.remove(client)
            asyncio.create_task(client.getConnection().close())