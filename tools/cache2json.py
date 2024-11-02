import json

DEBUG = False

# get next npc from cache, returning npc object and new index
def get_next(cache):
    npc_id = 0
    npc_level = 0
    line = cache.readline().strip()
    if not line:  # Check for end of file
        return None, cache.tell()
    
    while line != "break;":
        if line.startswith("case "):
            npc_id = line[5:-1].strip()
        elif line.startswith("cache[j].combatLevel = "):
            npc_level = line[23:-1].strip()
        
        line = cache.readline().strip()
        if not line:  # End of file reached
            return None, cache.tell()
    
    return {"id": npc_id, "level": npc_level}, cache.tell()

# load npc_configs.json
with open("npc_configs.json", "r") as f:
    npc_configs_arr = json.load(f)
npc_configs = {}
for npc in npc_configs_arr:
    npc_configs[npc["id"]] = npc

with open("every_2009_npc.txt", "r") as cache:
    # read all npcs from cache, storing combat level in npc_configs
    index = 0
    npc, index = get_next(cache)
    
    while npc is not None:
        if npc["id"] in npc_configs:
            npc_configs[npc["id"]]["combat_level"] = npc["level"]
        npc, index = get_next(cache)

# save updated npc_configs
with open("npc_data.json", "w") as f:
    json.dump(npc_configs, f, indent=2)
