from abc import ABC, abstractmethod
from typing import Dict, Type, Any, Optional
from service.logger import logDebug, logInfo, logWarning
from dataclasses import dataclass
from constants.constants import RequestType
import inspect

# This module defines a request handler system for the websocket.
# It allows for the registration of different request types and their corresponding handlers.

@dataclass
class BaseRequest(ABC):
    """
    Base class for all request types.
    """
    type: str
    data: Optional[dict] = None
    error: Optional[dict] = None

    @classmethod
    @abstractmethod
    async def process(cls, client: Any, request_instance: 'BaseRequest', context: Any = None) -> str:
        """
        Process the request and return a response.
        """
        pass

class RequestRegistry:
    """
    Registry for request handlers.
    """
    _registry: Dict[str, Type[BaseRequest]] = {}

    @classmethod
    def register(cls, request_type: str):
        """
        Decorator to register a request handler.
        """
        def decorator(request_class):
            cls._registry[request_type] = request_class
            return request_class
        return decorator

    @classmethod
    def get_handler(cls, request_type: str) -> Optional[Type[BaseRequest]]:
        """
        Get the handler class for a request type.
        """
        return cls._registry.get(request_type)

    @classmethod
    async def handle_request(cls, client: Any, request_data: dict, context: Any = None) -> str:
        """
        Handle a request and return a response.
        """
        request_type = request_data.get("type")
        if not request_type:
            return f"Error: Unknown request type '{request_type}'"

        handler_class = cls.get_handler(request_type)
        if not handler_class:
            return f"Error: Unknown request type '{request_type}'"

        try:
            # Create an instance of the handler class
            request_instance = handler_class(**request_data)
            logDebug(f"\nProcessing request: {request_instance}\nFrom: {client}")
            process_method = handler_class.process

            # Check if the process method is a coroutine function and call it accordingly
            # It works because it does
            if inspect.iscoroutinefunction(process_method):
                return await process_method(client, request_instance, context)
            else:
                return process_method(client, request_instance, context)
        except Exception as e:
            return f"Error processing request: {str(e)}"

# Examples of request handlers
# Eventually, these can be moved to separate files
# e.g. api/src/blockmen/websocket/request_handlers/ping.py or api/src/blockmen/websocket/request_handlers/disconnect.py
@RequestRegistry.register(RequestType.PING.value)
class PingRequest(BaseRequest):
    """
    {
        "type": "ping"
    }
    """
    @classmethod
    def process(cls, client, request_instance, context):
        return "pong"

@RequestRegistry.register(RequestType.DISCONNECT.value)
class DisconnectRequest(BaseRequest):
    """
    {
        "type": "disconnect"
    }
    """
    @classmethod
    def process(cls, client, request_instance, context):
        if not context or not hasattr(context, "remove_client"):
            return "Error: Context missing or invalid"

        context.remove_client(client)

        return f"Client {client.client_id} disconnected"

@RequestRegistry.register(RequestType.MOVE.value)
class MoveRequest(BaseRequest):
    """
    {
        "type": "move",
        "data": {
            "direction": "up"
        }
    }
    """
    @classmethod
    def process(cls, client, request_instance, context):
        if not request_instance.data or "direction" not in request_instance.data:
            return "Error: Missing direction in move request"
            
        direction = request_instance.data["direction"]
        if direction not in ["up", "down", "left", "right"]:
            return f"Error: Invalid direction '{direction}'"
            
        client.move(direction)
        return f"Moved {direction}. New position: ({client.x}, {client.y})"

@RequestRegistry.register(RequestType.CHAT.value)
class ChatRequest(BaseRequest):
    """
    {
        "type": "chat",
        "data": {
            "message": "Hello group!",
            "destination": "group"
        }
    }
    """
    @classmethod
    async def process(cls, client, request_instance, context):
        if not request_instance.data or "message" not in request_instance.data:
            return "Error: Missing message in chat request"

        msg_message = request_instance.data["message"]
        msg_destination = request_instance.data["destination"]
        msg_client_id = client.client_id
        msg_group_id = int(client.group_id)

        payload = f"User {msg_client_id} says: {msg_message}"

        # TODO
        # Want to handle sending to websocket outside of request handler
        # Want to pass json to websocket.py which involves client IDs as recipients
        # Will need to make response_handler in websocket.py
        for c in context.clients:
            if msg_destination == "group":
                if c.group_id == int(msg_group_id):
                    await c.getConnection().send(f"Group {msg_group_id}: {payload}")
            elif msg_destination == "all":
                await c.getConnection().send(f"All Chat: {payload}")

@RequestRegistry.register(RequestType.JOIN_GROUP.value)
class JoinGroupRequest(BaseRequest):
    """
    {
        "type": "join_group",
        "data": {
            "group_id": 1
        }
    }
    """
    @classmethod
    async def process(cls, client, request_instance, context):
        if not request_instance.data or "group_id" not in request_instance.data:
            return "Error: Missing group_id in join group request"

        requested_group_id = request_instance.data["group_id"]
        client.group_id = requested_group_id
        return f"Client {client.client_id} joined group {requested_group_id}"