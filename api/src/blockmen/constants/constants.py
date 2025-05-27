from enum import Enum

class RequestType(Enum):
    CHAT = "chat"
    MOVE = "move"
    DISCONNECT = "disconnect"
    PING = "ping"
    JOIN_GROUP = "join_group"