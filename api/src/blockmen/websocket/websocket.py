from abc import ABC
import asyncio
import websockets.asyncio
import websockets.asyncio.server as ws_server

from model.client.client import Client
from model.player.player import Player
from service.logger import logDebug, logInfo, logWarning

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
        print(f"Client connected: {server_connection.remote_address}")
        client = Player(self.clients.__len__() + 1, 0, server_connection, 0)
        self.clients.append(client)
        # non blocking listener
        await self.broadcast_helloworld()
        await self.catch_message(client)

    async def broadcast_helloworld(self):
        """
        Broadcast a message to all connected clients.
        """
        alive_clients = []
        for client in self.clients[:]:
            try:
                logDebug(f"Sending client {client.client_id} 'Hello World'")
                await client.getConnection().send("Hello World")
                alive_clients.append(client)
            except websockets.exceptions.ConnectionClosed:
                logWarning(f"Client {client.client_id} disconnected")
        self.clients = alive_clients

    async def catch_message(self, client: Client):
        """
        Catch and handle messages from a client.
        """
        try:
            logDebug(f"Waiting for message from client {client.client_id}")
            while True:
                request = await client.getConnection().recv()
                logDebug(f"Received message from client {client.client_id}: {request}")
                
                # Process the request
                response = self.handle_request(client, request)
                # Send a response back to the client if applicable
                if response:
                    await client.getConnection().send(response)

        except websockets.exceptions.ConnectionClosed:
            logWarning(f"Client {client.client_id} disconnected")
            self.remove_client(client)
        except Exception as e:
            logWarning(f"Error in communication with client {client.client_id}: {e}")
            self.remove_client(client)

    # Handle different types of requests from the client
    # This is a placeholder for the actual request handling logic
    # Will probably parse json here later
    def handle_request(self, client: Client, request: str) -> str:
        """
        Handle a client request and return a response if needed.
        """
        try:
            if request == "ping":
                logDebug(f"Client {client.client_id} sent a ping")
                return "pong"
            elif request == "disconnect":
                logInfo(f"Client {client.client_id} requested to disconnect")
                self.remove_client(client)
                return "Disconnected"
            else:
                logWarning(f"Unknown request from client {client.client_id}: {request}")
                return "Error: Unknown request"
        except Exception as e:
            logWarning(f"Error handling request from client {client.client_id}: {e}")
            return "Error: Internal server error"

    # Was getting runtime error when trying to remove client from list while iterating over it
    # So we are using a separate method to remove the client from the list
    # and close the connection
    def remove_client(self, client: Client):
        """
        Remove a client from the active client list.
        """
        if client in self.clients:
            self.clients.remove(client)
            logInfo(f"Client {client.client_id} removed from client list.")
            asyncio.create_task(client.getConnection().close())