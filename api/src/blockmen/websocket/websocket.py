from abc import ABC
import asyncio
import websockets
import websockets.asyncio.server as ws_server

from model.client.client import Client
from model.player.player import Player
from service.logger import logDebug, logInfo, logWarning, logError
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

                is_valid, request = Validator.validate_request(message_from_client)
                if is_valid:
                    result = await RequestRegistry.handle_request(client, request, context=self)
                    await self.send_response(result)
                else:
                    error_result = json.dumps({"status": "error", "message": request})
                    logWarning(f"Invalid request from client {client.client_id}: {request}")
                    await self.send_response((client, error_result))

        except websockets.exceptions.ConnectionClosed:
            logWarning(f"Client {client.client_id} disconnected (catch_message)")
            self.remove_client(client)
        except Exception as e:
            logError(f"Error in communication with client {client.client_id}: {e}")
            self.remove_client(client)

    def remove_client(self, client: Client):
        """
        Remove a client from the active client list.
        """
        if client in self.clients:
            asyncio.create_task(client.getConnection().close())
            self.clients.remove(client)

    async def send_response(self, result):
        """
        Sends a response to one or more clients.
        
        result can be:
            - (client, response)
            - (client_list, response)
        """
        recipients, response = result
        
        if isinstance(recipients, list):
            for client in recipients:
                try:
                    logDebug(f"Sending response to client {client.client_id}: {response}")
                    await client.getConnection().send(response)
                except Exception as e:
                    logError(f"Error sending response to client {client.client_id}: {e}")
        else:
            try:
                logDebug(f"Sending response to client {recipients.client_id}: {response}")
                await recipients.getConnection().send(response)
            except Exception as e:
                logError(f"Error sending response to client {recipients.client_id}: {e}")