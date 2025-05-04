from blockmen.model.client import Client

class Player(Client):
    def __init__(self, client_id: int, group_id: int, player_id: int):
        super().__init__(client_id, group_id)
        self.player_id = player_id

    def __repr__(self):
        return f"Player(client_id={self.client_id}, group_id={self.group_id}, player_id={self.player_id})"