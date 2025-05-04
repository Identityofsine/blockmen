from abc import ABC

class Client(ABC):
    def __init__(self, client_id: int, group_id: int):
        self.client_id = client_id
        self.group_id = group_id

    def __repr__(self):
        return f"Client(client_id={self.client_id}, group_id={self.group_id}"